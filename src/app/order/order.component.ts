import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Option, OrderForm } from './order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
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
    { value: 'salami', view: 'Salami' },
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

  subscription: Subscription = new Subscription();

  foodType$: Observable<string>;
  isPizza$: Observable<boolean>;
  isChicken$: Observable<boolean>;
  cost$: Observable<number>;
  orderForm$: Observable<OrderForm>;

  sizeCostMap = {
    small: 5,
    medium: 10,
    large: 15
  };

  quantityCostMap = {
    normal: 0.5,
    extra: 1,
    double: 2
  };

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

    this.orderForm$ = this.orderForm.valueChanges;

    this.foodType$ = this.orderForm.valueChanges.pipe(
      map(form => form.foodType)
    );

    this.isPizza$ = this.foodType$.pipe(map(type => type === 'pizza'));
    this.isChicken$ = this.foodType$.pipe(map(type => type === 'chicken'));

    this.cost$ = this.orderForm.valueChanges.pipe(
      map(form => this.mapFormToCost(form)),
      startWith(0)
    );
  }

  private mapFormToCost(form: OrderForm): number {
    let cost = 0;
    if (form.foodType === 'pizza') {
      const size = form.pizza.size;
      if (!!size) {
        cost += this.sizeCostMap[size];
      }

      const toppings = form.pizza.toppings;
      if (!!toppings) {
        const quantity = form.pizza.toppingsQuantity;
        const toppingCost = !!quantity ? this.quantityCostMap[quantity] : 0;
        cost += toppingCost * toppings.length;
      }
    } else if (form.foodType === 'chicken') {
      cost = 6.99;
    }

    return cost;
  }
}
