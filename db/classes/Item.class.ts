class Item {
  name: string;
  price: number;
  description: string;
  quantity: number;
  measure: string;
  constructor(
    name: string,
    price: number,
    description: string,
    quantity: number,
    measure: string
  ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.quantity = quantity;
    this.measure = measure;
  }
}
export default Item;
