export interface Option {
  value: string;
  view: string;
}

export interface OrderForm {
  foodType: string;
  pizza: {
    size: string;
    toppings: string[];
    toppingsQuantity: string;
  };
  chicken: {
    sauce: string;
  };
}
