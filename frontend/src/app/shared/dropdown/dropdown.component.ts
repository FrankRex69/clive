import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators,
} from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'dropdown-item',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DropdownComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DropdownComponent,
    },
  ],
})
export class DropdownComponent
  implements OnInit, ControlValueAccessor, OnDestroy, Validator
{
  isListOpen: boolean;
  @Input() title: string;
  @Input() key: string;
  @Input() inputObs$: Observable<any[]>;
  items$: Observable<any[]>;
  searchStream$ = new BehaviorSubject('');
  @Input() selectedItem: any;
  @Output() event = new EventEmitter<any>();

  onChooseItem(item: any) {
    this.isListOpen = false;
    this.selectedItem = item;
    this.form.patchValue({
      input: this.selectedItem[this.key],
    });
    this.event.emit(this.selectedItem);
  }

  ngOnInit() {
    if (this.selectedItem) {
      this.form.patchValue({
        input: this.selectedItem[this.key],
      });
    }

    this.items$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(''),
      switchMap((search) =>
        this.inputObs$.pipe(
          map((obs) =>
            obs.filter((item) =>
              item[this.key].toLowerCase().includes(search.toLowerCase())
            )
          )
        )
      )
    );
  }

  form: FormGroup = this.fb.group({
    input: [null, [Validators.required]],
  });

  onTouched: Function = () => {};

  onChangeSubs: Subscription[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnDestroy() {
    for (let sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }

  registerOnChange(onChange: any) {
    const sub = this.form.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  registerOnTouched(onTouched: Function) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  writeValue(value: any) {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
    }
  }

  validate(control: AbstractControl) {
    if (this.form.valid) {
      return null;
    }
    let errors: any = {};
    errors = this.addControlErrors(errors, 'input');
    return errors;
  }

  addControlErrors(allErrors: any, controlName: string) {
    const errors = { ...allErrors };
    const controlErrors = this.form.controls[controlName].errors;
    if (controlErrors) {
      errors[controlName] = controlErrors;
    }
    return errors;
  }
}
