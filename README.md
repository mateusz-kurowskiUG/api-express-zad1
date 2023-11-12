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

POST('/products'):
1. parametry produktu wysyłamy jako JSON w req.body
2. wymagane są wszystkie parametry klasy Item
PUT('/products/:id'):
1. Podajemy _id jako url.params.id
2. wartości do zmiany wysyłamy jako JSON w body np:
    {
        "name":"T",
        "price":13.99
    }

DELETE('/products/:id')
1. Podajemy _id jako url.params.id

GET('/products/report)
