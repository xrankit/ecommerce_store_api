# ecommerce_store_api

E-commerce Store API is a online REST API that you can use whenever you need Pseudo-real data for
your e-commerce or shopping website without running any server-side code.
It's awesome for teaching purposes, sample codes, tests and etc.

## Why?

When I wanted to design a shopping website prototype and needed fake data, I had to
create a JSON file from the base. I didn't find any online web service to return semi-real shop data.
so I decided to create this simple web service with NodeJs(express) and MongoDB as a database.

## Resources

There are 4 main resources need in shopping prototypes:

- Products 
- Carts 
- Users 
- Login Token 

### New! "Rating" (includes rate and count) has been added to each product object!

## How to

you can fetch data with any kind of methods you know(fetch API, Axios, jquery ajax,...)

### Get all products

```js
  .then((res) => res.json())
  .then((json) => console.log(json));
```

### Get a single product

```js
  .then((res) => res.json())
  .then((json) => console.log(json));
```

### Add new product

```js
{
  method: "POST",
  body: JSON.stringify({
    title: "test product",
    price: 13.5,
    description: "lorem ipsum set",
    image: "https://i.pravatar.cc",
    category: "electronic",
  }),
}
  .then((res) => res.json())
  .then((json) => console.log(json));

/* will return
{
 id:31,
 title:'...',
 price:'...',
 category:'...',
 description:'...',
 image:'...'
}
*/
```

## All available routes

### Products

```js
fields:
{
    id:Number,
    title:String,
    price:Number,
    category:String,
    description:String,
    image:String
}
```

GET:

- /products (get all products)
- /products/1 (get specific product based on id)
- /products?limit=5 (limit return results )
- /products?sort=desc (asc|desc get products in ascending or descending orders (default to asc))
- /products/products/categories (get all categories)
- /products/category/jewelery (get all products in specific category)
- /products/category/jewelery?sort=desc (asc|desc get products in ascending or descending orders (default to asc))

POST:

- /products

-PUT,PATCH

- /products/1

-DELETE

- /products/1

### Carts

```js
fields:
{
    id:Number,
    userId:Number,
    date:Date,
    products:[{productId:Number,quantity:Number}]
}
```

GET:

- /carts (get all carts)
- /carts/1 (get specific cart based on id)
- /carts?startdate=2020-10-03&enddate=2020-12-12 (get carts in date range)
- /carts/user/1 (get a user cart)
- /carts/user/1?startdate=2020-10-03&enddate=2020-12-12 (get user carts in date range)
- /carts?limit=5 (limit return results )
- /carts?sort=desc (asc|desc get carts in ascending or descending orders (default to asc))

POST:

- /carts

PUT,PATCH:

- /carts/1

DELETE:

- /carts/1

### Users

```js
fields:
{
    id:20,
    email:String,
    username:String,
    password:String,
    name:{
        firstname:String,
        lastname:String
        },
    address:{
    city:String,
    street:String,
    number:Number,
    zipcode:String,
    geolocation:{
        lat:String,
        long:String
        }
    },
    phone:String
}
```

GET:

- /users (get all users)
- /users/1 (get specific user based on id)
- /users?limit=5 (limit return results )
- /users?sort=desc (asc|desc get users in ascending or descending orders (default to asc))

POST:

- /users

PUT,PATCH:

- /users/1

DELETE:

- /users/1

### Auth

```js
fields:
{
    username:String,
    password:String
}
```

POST:

- /auth/login

## ToDo

- Add graphql support
- Add pagination
- Add another language support
