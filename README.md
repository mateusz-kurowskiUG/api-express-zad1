# Zad1-Express-API

To run:
`pnpm start`

No credentials because of connecting to remote Atlas DB.

INSTRUKCJA:
struktura produktu:
Item{
    name: string;
    price: number;
    description: string;
    quantity: number;
    measure: string;
}
Endpointy:
 GET('/products'):
opcjonalnie parametry query: 
1. sort=<field>,<1 || -1>
2. filter=<field>,<wartość>
Przykładowy get:
https://api-express-zad1-a82d8b2c2903.herokuapp.com/products?filter=price,1499.99&sort=name,1


POST('/products'):
1. parametry produktu wysyłamy jako JSON w req.body
2. wymagane są wszystkie parametry klasy Item
przykładowy post:
https://api-express-zad1-a82d8b2c2903.herokuapp.com/products
  {
    "name": "Telewizor",
    "price": 1499.99,
    "description":
      "Robot kuchenny z funkcją gotowania, ważenie, wyrabiania ciasta itp.",
    "quantity": 6,
    "measure": "sztuki"
  }


PUT('/products/:id'):
1. Podajemy _id jako url.params.id
2. wartości do zmiany wysyłamy jako JSON w body np:
    {
        "name":"T",
        "price":13.99
    }

    przykładowy put:
https://api-express-zad1-a82d8b2c2903.herokuapp.com/products/6551dde2fbc99dd8aef79f26
(jeśli jest w bazie produkt o takim _id)
  {
    "name": "Telew",
    "price": 0
  }
DELETE('/products/:id')
1. Podajemy _id jako url.params.id
https://api-express-zad1-a82d8b2c2903.herokuapp.com/products/6551dde2fbc99dd8aef79f26
GET('/products/report)
https://api-express-zad1-a82d8b2c2903.herokuapp.com/products/report