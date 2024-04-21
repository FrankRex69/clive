import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { DragAndDrop, defaults as defaultInteractions } from 'ol/interaction';
import { GPX, GeoJSON, IGC, KML, TopoJSON } from 'ol/format';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

import * as JSZip from 'jszip';
import { fromEvent } from 'rxjs';
import FormatType from 'ol/format/FormatType';
import { Options } from 'ol/format/KML';

export class KMZ extends KML {
  zip;

  constructor(opt_options) {
    const options = opt_options || {};
    options.iconUrlFunction = (href) => {
      let url = href;
      let path = window.location.href;
      path = path.slice(0, path.lastIndexOf('/') + 1);
      if (href.indexOf(path) === 0) {
        const regexp = new RegExp(href.replace(path, '') + '$', 'i');
        const kmlFile = this.zip.file(regexp)[0];
        if (kmlFile) {
          url = URL.createObjectURL(new Blob([kmlFile.asArrayBuffer()]));
        }
      }
      return url;
    };
    super(options);
    this.zip = new JSZip();
  }

  getKMLData(buffer) {
    let kmlData;
    this.zip.load(buffer);
    const kmlFile = this.zip.file(/.kml$/i)[0];
    if (kmlFile) {
      kmlData = kmlFile.asText();
    }
    return kmlData;
  }
  /*   getKMLImage(href) {
    let url = href;
    let path = window.location.href;
    path = path.slice(0, path.lastIndexOf('/') + 1);
    if (href.indexOf(path) === 0) {
      const regexp = new RegExp(href.replace(path, '') + '$', 'i');
      const kmlFile = this.zip.file(regexp)[0];
      if (kmlFile) {
        url = URL.createObjectURL(new Blob([kmlFile.asArrayBuffer()]));
      }
    }
    return url;
  } */

  getType() {
    return 'arraybuffer' as FormatType;
  }

  readFeature(source, options) {
    const kmlData = this.getKMLData(source);
    return super.readFeature(kmlData, options);
  }

  readFeatures(source, options) {
    const kmlData = this.getKMLData(source);
    return super.readFeatures(kmlData, options);
  }
}
