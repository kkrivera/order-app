import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface Option {
  value: string;
  view: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;
  foodTypes: Option[] = [
    { value: 'pizza', view: 'Pizza' },
    { value: 'chicken', view: 'Chicken Nuggets' }
  ];
  sizes: Option[] = [
    { value: 'small', view: 'Small' },
    { value: 'medium', view: 'Medium' },
    { value: 'large', view: 'Large' }
  ];
  toppings: Option[] = [
    { value: 'pepperoni', view: 'Pepperoni' },
    { value: 'Salami', view: 'Salami' },
    { value: 'peppers', view: 'Peppers' },
    { value: 'onions', view: 'Onions' },
    { value: 'olives', view: 'Olives' }
  ];
  quantities: Option[] = [
    { value: 'normal', view: 'Normal' },
    { value: 'extra', view: 'Extra' },
    { value: 'double', view: 'Double' }
  ];
  sauces: Option[] = [
    { value: 'honey-mustard', view: 'Honey Mustard' },
    { value: 'ranch', view: 'Ranch' },
    { value: 'hot-sauce', view: 'Hot Sauce' },
    { value: 'none', view: 'None' }
  ];

  disabled$: Subject<boolean> = new BehaviorSubject<boolean>(true);
  subscription: Subscription = new Subscription();

  foodType$: Observable<string>;
  isPizza$: Observable<boolean>;
  isChicken$: Observable<boolean>;

  constructor() {}

  ngOnInit() {
    this.orderForm = new FormGroup({
      foodType: new FormControl(),
      pizza: new FormGroup({
        size: new FormControl(),
        toppings: new FormControl(),
        toppingsQuantity: new FormControl()
      }),
      chicken: new FormGroup({
        sauce: new FormControl()
      })
    });

    this.foodType$ = this.orderForm.valueChanges.pipe(
      map(form => form.foodType)
    );

    this.isPizza$ = this.foodType$.pipe(map(type => type === 'pizza'));
    this.isChicken$ = this.foodType$.pipe(map(type => type === 'chicken'));

    this.subscription.add(
      this.orderForm.valueChanges.subscribe(values => console.log(values))
    );

    this.disabled$.next(true);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submitOrder() {
    console.log(this.orderForm.value);
  }
}
