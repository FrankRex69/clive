import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Feature } from 'ol';
import LayerSwitcher, {
  BaseLayerOptions,
  GroupLayerOptions,
} from 'ol-layerswitcher';
import { defaults as defaultControls, MousePosition } from 'ol/control';
import Rotate from 'ol/control/Rotate';
import ScaleLine from 'ol/control/ScaleLine';
import { Coordinate, createStringXY } from 'ol/coordinate';
import { GeoJSON, GPX, IGC, KML, TopoJSON } from 'ol/format';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { DragAndDrop } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import 'ol/ol.css';
import * as olProj from 'ol/proj';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import View from 'ol/View';
import { combineLatest, Subject } from 'rxjs';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { AuthUser } from 'src/app/auth/auth-user.model';
import { StreamingRtmpService } from '../streaming-rtmp.service';
import { GpsService } from './gps.service';
import { KMZ } from './KMZ';
import {
  EPSG3857,
  EPSG4326,
  MapData,
  MapDataService,
} from './map-data.service';
import { MarkerService } from './marker.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ transform: 'scale(.1)', opacity: 0 }),
        animate('.5s ease-in', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('.5s ease-out', style({ transform: 'scale(0.1)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class MapComponent implements OnInit {
  destroy$ = new Subject();

  @Input() roomId: number;
  @Input() isInfo: boolean;
  @Input() user: AuthUser;
  @Input() isInsidePlayer: boolean;
  @Input() tag: string;

  mappa: Map;

  constructor(
    private mapService: MapDataService,
    public markerService: MarkerService,
    public gpsService: GpsService,
    public streamService: StreamingRtmpService,
    public socket: Socket
  ) {}

  ngOnInit(): void {
    /* MAPPA E LAYER */
    this.mapService
      .fetchMap(this.roomId)
      .pipe(
        tap((mapData: MapData) => {
          /* INIZIALIZZAZIONE MAPPA CON TIMEOUT PER CARICAMENTO PREVENTIVO LAYER */
          this.mappa = this.createMap(mapData);

          // this.addMouseInteraction();
          // this.addDragAndDropInteraction();

          this.gpsService.initGps(this.roomId);
          this.markerService.initMarker(this.roomId);

          if (!this.isInsidePlayer && this.user.btnInsMkr == 1) {
            this.mappa.on('click', (evt) => {
              const lonlat = olProj.transform(
                evt.coordinate,
                EPSG3857,
                EPSG4326
              );
              this.markerService.emitMarker(
                lonlat[1].toFixed(7),
                lonlat[0].toFixed(7),
                this.roomId
              );
            });
            /* CONTROLLI IN AGGIUNTA */
            this.mappa.addControl(new ScaleLine());
            this.mappa.addControl(
              new LayerSwitcher({
                reverse: true,
                groupSelectStyle: 'children',
                startActive: false,
                activationMode: 'click',
              })
            );
          } else {
            /* CONTROLLI RIMOSSI */
            this.mappa.removeControl(
              new Rotate({
                autoHide: false,
              })
            );
          }
        }),
        delay(1000),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.mappa.updateSize();
      });

    combineLatest([this.gpsService.coordinate$, this.markerService.marker$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([gps, marker]) => {
        let gpsCoords: Coordinate;
        let markerCoords: Coordinate;
        if (gps) {
          gpsCoords = [+gps.longitude, +gps.latitude];
          this.updateGpsLayer(gpsCoords);
        }
        if (marker) {
          markerCoords = [+marker.longitude, +marker.latitude];
          // ! this.mappa.getView().fit(this.polyline, { padding: [40, 40, 40, 40] });
          this.updateMarkerLayer(markerCoords, gpsCoords);
        } else {
          this.removeLayerByName('markerLayer');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  removeLayerByName(layerName: string) {
    if (this.mappa) {
      this.mappa.getLayers().forEach((layer) => {
        if (layer.get('name') && layer.get('name') === layerName) {
          console.log('🐱‍👤 : layer', layer.get('name'));
          this.mappa.removeLayer(layer);
        }
      });
    }
  }

  private gpsLayer: VectorLayer;
  private pointer: Feature;
  private accuracy: Feature;
  updateGpsLayer(coordinates: Coordinate) {
    if (this.mappa) {
      if (!this.pointer) {
        this.pointer = new Feature();
        this.accuracy = new Feature();
        this.pointer.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({
                color: '#FF0000',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          })
        );
        this.gpsLayer = new VectorLayer({
          title: 'Marker Operatore',
          source: new VectorSource({
            features: [this.accuracy, this.pointer],
          }),
        } as BaseLayerOptions);
        this.mappa.addLayer(this.gpsLayer);
      }
      this.pointer.setGeometry(
        olProj.fromLonLat(coordinates)
          ? new Point(olProj.fromLonLat(coordinates))
          : null
      );
      if (this.gpsService.followOperator) {
        this.mappa
          .getView()
          .setCenter(olProj.transform(coordinates, EPSG4326, EPSG3857));
      }
    }
  }

  private markerLayer: VectorLayer;
  private polyline: Feature;
  private marker: Feature;
  updateMarkerLayer(
    coordMarkerBlu: Coordinate,
    coordMarkerRed?: Coordinate
  ): void {
    if (this.mappa) {
      if (this.markerLayer) {
        this.mappa.removeLayer(this.markerLayer);
      }

      this.markerLayer = new VectorLayer({
        source: new VectorSource({
          features: null,
        }),
        name: 'markerLayer',
        title: 'Marker Indicazioni',
        visible: true,
      } as BaseLayerOptions);

      if (!this.marker) {
        this.marker = new Feature({
          geometry: fromLonLat(coordMarkerBlu)
            ? new Point(fromLonLat(coordMarkerBlu))
            : null,
        });
        this.marker.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 8,
              fill: new Fill({
                color: '#028ffa40',
              }),
              stroke: new Stroke({
                color: '#028ffa',
                width: 1,
              }),
            }),
          })
        );
      }
      this.marker.setGeometry(
        olProj.fromLonLat(coordMarkerBlu)
          ? new Point(fromLonLat(coordMarkerBlu))
          : null
      );
      this.markerLayer.getSource().addFeature(this.marker);

      if (coordMarkerRed) {
        if (!this.polyline) {
          let polyLine = new LineString([
            fromLonLat(coordMarkerBlu),
            fromLonLat(coordMarkerRed),
          ]);
          this.polyline = new Feature({ geometry: polyLine });
          this.polyline.setStyle(
            new Style({
              stroke: new Stroke({
                color: '#028ffa40',
                width: 4,
              }),
            })
          );
        }
        this.polyline.setGeometry(
          new LineString([
            fromLonLat(coordMarkerBlu),
            fromLonLat(coordMarkerRed),
          ])
        );
        this.markerLayer.getSource().addFeature(this.polyline);
      }

      this.mappa.addLayer(this.markerLayer);
    }
  }

  deleteMarkerLayer(): void {
    if (this.markerLayer) {
      this.mappa.removeLayer(this.markerLayer);
      this.markerService.emitDeletMarker(this.roomId);
    }
  }

  updateSize(): void {
    if (this.mappa) {
      setTimeout(() => {
        this.mappa.updateSize();
      }, 200);
    }
  }

  createMap(mapData: MapData) {
    return new Map({
      controls: defaultControls({
        attribution: false,
        zoom: false,
      }),
      target: 'map' + this.tag,
      layers: [
        new LayerGroup({
          title: 'Sfondi cartografici',
          layers: [
            new TileLayer({
              title: 'Google Streets',
              type: 'base',
              visible: false,
              source: new XYZ({
                url: 'http://mt1.googleapis.com/vt?x={x}&y={y}&z={z}',
              }),
            } as BaseLayerOptions),
            new TileLayer({
              title: 'Open Street Map',
              type: 'base',
              visible: true,
              source: new OSM(),
            } as BaseLayerOptions),
            new TileLayer({
              title: 'Google satellite',
              type: 'base',
              visible: false,
              source: new XYZ({
                url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}?key=AIzaSyAfSMp-syOQXDlulMxr14XIV4-hgOt2DRc',
              }),
            } as BaseLayerOptions),
            new TileLayer({
              // TODO ++++ SFONDO BIANCO
              title: 'Nessuno',
              type: 'base',
              visible: false,
              source: new XYZ({
                url: '',
              }),
            } as BaseLayerOptions),
          ],
        } as GroupLayerOptions),
        new LayerGroup({
          title: 'Progetto completo',
          layers: [
            new TileLayer({
              title: 'Nodi fisici',
              minZoom: 12,
              source: new TileWMS({
                url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                params: {
                  LAYERS: mapData.nodifisici,
                  TILED: true,
                },
                serverType: 'geoserver',
              }),
            } as BaseLayerOptions),
            new TileLayer({
              title: 'Nodi ottici',
              minZoom: 12,
              source: new TileWMS({
                url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                params: { LAYERS: mapData.nodiottici, TILED: true },
                serverType: 'geoserver',
              }),
            } as BaseLayerOptions),
            new TileLayer({
              title: 'Tratte',
              minZoom: 12,
              source: new TileWMS({
                url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                params: { LAYERS: mapData.tratte, TILED: true },
                serverType: 'geoserver',
              }),
            } as BaseLayerOptions),
          ],
        } as GroupLayerOptions),
      ],
      view: new View({
        center: olProj.transform(
          [mapData.longcentrmap, mapData.latcentromap],
          EPSG4326,
          EPSG3857
        ),
        zoom: 15,
      }),
    });
  }

  addMouseInteraction() {
    /* COORDINATE AL PASSAGGIO DEL MOUSE */
    let mousePosition = new MousePosition({
      coordinateFormat: createStringXY(7),
      projection: EPSG4326,
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;',
    });
    // controls: this.isInsidePlayer
    //   ? null
    //   : defaultControls({ attribution: false }).extend([
    //       this.mousePosition,
    //     ]),
    this.mappa.addControl(mousePosition);
  }

  addDragAndDropInteraction() {
    let dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [KMZ, GPX, GeoJSON, IGC, KML, TopoJSON],
    });
    // interactions: this.isInsidePlayer
    // ? null
    // : defaultInteractions().extend([this.dragAndDropInteraction]),
    this.mappa.addInteraction(dragAndDropInteraction);
    /* ISTRUZIONI AL DRAG & DROP DEL KML-KMZ */
    dragAndDropInteraction.on('addfeatures', (event: any) => {
      const vectorSourceKML = new VectorSource({
        features: event.features,
      });
      const vectorLayerKML = new VectorLayer({
        source: vectorSourceKML,
        opacity: 0.7,
        declutter: true,
        updateWhileInteracting: true,
        title: 'KMZ / KML',
      } as BaseLayerOptions);
      this.mappa.addLayer(vectorLayerKML);
      this.mappa.getView().fit(vectorSourceKML.getExtent());
    });
  }

  // private polylineLayer: VectorLayer;
  // updatePolyline(coordMarkerBlu: Coordinate, coordMarkerRed: Coordinate) {
  //   if (this.mappa) {
  //     if (!this.polyline) {
  //       let polyLine = new LineString([
  //         fromLonLat(coordMarkerBlu),
  //         fromLonLat(coordMarkerRed),
  //       ]);
  //       this.polyline = new Feature({ geometry: polyLine });
  //       this.polyline.setStyle(
  //         new Style({
  //           stroke: new Stroke({
  //             color: '#028ffa40',
  //             width: 4,
  //           }),
  //         })
  //       );
  //       this.polylineLayer = new VectorLayer({
  //         source: new VectorSource({
  //           features: [this.polyline],
  //         }),
  //       });
  //       this.mappa.addLayer(this.polylineLayer);
  //       // if (this.markerLayer) {
  //       //   this.markerLayer.getSource().addFeature(this.polyline);
  //       // }
  //     }
  //     this.polyline.setGeometry(
  //       new LineString([fromLonLat(coordMarkerBlu), fromLonLat(coordMarkerRed)])
  //     );
  //   }
  // }

  /* DISPLAY INFO KML/KMZ */
  // displayFeatureInfo(pixel: Pixel): void {
  //   if (this.isInfo) {
  //     const features = [];
  //     this.mappa.forEachFeatureAtPixel(pixel, (feature) => {
  //       features.push(feature);
  //     });
  //     if (features.length > 0) {
  //       const info = [];
  //       for (let i = 0; i < features.length; ++i) {
  //         const description =
  //           features[i].get('description') ||
  //           features[i].get('name') ||
  //           features[i].get('_name') ||
  //           features[i].get('layer');
  //         if (description) {
  //           info.push(description);
  //         }
  //       }
  //       document.getElementById('info').innerHTML =
  //         info.join('<br/>') || '&nbsp';
  //     } else {
  //       document.getElementById('info').innerHTML = '&nbsp;';
  //     }
  //   }
  // }

  // toggleDisplayInfo(): void {
  //   this.isInfo = !this.isInfo;
  // }
}
