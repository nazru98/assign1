let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET , POST , OPTIONS ,  PUT , PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = 2410;
app.listen(port, () => console.log(`Listening on port ${port} !`));
let { data } = require("./productsDetail");

app.get("/shops1", function (req, res) {
    res.send(data.shops);
  
  });

  app.post("/shops1",function(req,res){
    let body=req.body   
    let maxid=data.shops.reduce((acc,cur)=>cur.shopId>=acc?cur.shopId:acc,0)
    let newid=maxid+1
    let newShop={shopId:newid,...body}
    data.shops.push(newShop)
    res.send(newShop)
  })

  app.get("/products1", function (req, res) {
    res.send(data.products);
  
  });

  app.post("/products1",function(req,res){
    let body=req.body   
    let maxid=data.products.reduce((acc,cur)=>cur.productId>=acc?cur.productId:acc,0)
    let newid=maxid+1
    let newProduct={productId:newid,...body}
    data.products.push(newProduct)
    res.send(newProduct)
  })

  app.put("/products1/:productId", function(req,res){
    let productId= +req.params.productId;
    let body=req.body;
    let index=data.products.findIndex((pr)=>pr.productId===productId)
    if(index>=0){
      let updatedProduct={productId:productId, ...body}
      data.products[index]=updatedProduct
      res.send(updatedProduct)
  
    }
    else
    res.status(404).send("No Product found")
  })


app.get("/purchases1", function (req, res) {
  const shopId = req.query.shop;
  const productId = req.query.product;
  const sort = req.query.sort;

  let filteredPurchases = data.purchases;
  
 
  if (shopId) {
    const shopIdNum = parseInt(shopId.replace("st", ""), 10);
    
    filteredPurchases = filteredPurchases.filter((purchase) => purchase.shopId === shopIdNum);
  }

  if (productId) {
    const productIdNums = productId.split(',').map(id => parseInt(id.replace("pr", ""), 10));
    
    filteredPurchases = filteredPurchases.filter((purchase) => productIdNums.includes(purchase.productid));
  }
  if (sort === 'QtyAsc') {
    filteredPurchases.sort((st1, st2) => st1.quantity - st2.quantity);
  }

  if (sort === 'QtyDesc') {
    filteredPurchases.sort((st1, st2) => st2.quantity - st1.quantity);
  }

  if (sort === 'ValueAsc') {
    filteredPurchases.sort((st1, st2) => st1.quantity * st1.price - st2.quantity * st2.price);
  }

  if (sort === 'ValueDesc') {
    filteredPurchases.sort((st1, st2) => st2.quantity * st2.price - st1.quantity * st1.price);
  }

  res.send(filteredPurchases);
});

  app.post("/purchases1",function(req,res){
    let body=req.body   
    let maxid=data.purchases.reduce((acc,cur)=>cur.purchaseId>=acc?cur.purchaseId:acc,0)
    let newid=maxid+1
    let newPurchase={purchaseId:newid,...body}
    data.purchases.push(newPurchase)
    res.send(newPurchase)
  })


  app.get("/purchases1/products1/:id",function(req,res){
    let id=+req.params.id
    const productPurchases = data.purchases.filter(
        (purchase) => purchase.productid === id
      );
    
      if (productPurchases.length > 0) {
        res.json(productPurchases);
      }  
})

app.get("/products1/:id",function(req,res){
    let id=+req.params.id
    let product=data.products.find(pr=>pr.productId===id)
    if(product)  res.send(product)
    else res.status(404).send("No Product Found")
   
})

app.get("/purchases1/shops1/:id",function(req,res){
    let id=+req.params.id
    const shopsPurchases = data.purchases.filter(
        (purchase) => purchase.shopId === id
      );
    
      if (shopsPurchases.length > 0) {
        res.send(shopsPurchases);
      }  
})




app.get("/totalPurchase1/shop1/:id", function (req, res) {
  const shopId = +req.params.id;
  const shop = data.shops.find((shop) => shop.shopId === shopId);

  if (!shop) {
      res.status(404).send("Shop not found.");
      return;
  }
  
  const totalPurchases = data.purchases.filter(
      (purchase) => purchase.shopId === shopId
  ).map((purchase) => {
      const product = data.products.find((product) => product.productId === purchase.productid);
      return {
          purchaseId: purchase.purchaseId,
          productid: purchase.productid,
          quantity: purchase.quantity,
          price: purchase.price,
          productName:  product.productName 
      };
  });

  let totalShopByDetail = {
      shopName: shop.name,
      shopId: shopId,
      totalPurchases: totalPurchases
  };

  res.send(totalShopByDetail);
});

app.get("/totalPurchase1/product1/:id", function (req, res) {
  const productId = +req.params.id;
  const product = data.products.find((product) => product.productId === productId);

  if (!product) {
      res.status(404).send("Product not found.");
      return;
  }
  
  const totalPurchases = data.purchases.filter(
      (purchase) => purchase.productid === productId
  ).map((purchase) => {
      const shop = data.shops.find((shop) => shop.shopId === purchase.shopId);
      return {
          purchaseId: purchase.purchaseId,
          shopId:purchase.shopId,
          price:purchase.price,
          quantity:purchase.quantity,

          shopName:shop.name  
      };
  });

  let totalShopByDetail = {
      productName: product.productName,
      productId: productId,
      totalPurchases: totalPurchases
  };

  res.send(totalShopByDetail);
});






const pageSize = 5;
let id = 745;
let persons = [
  {
    id: "1",
    name: "Jack Smith",
    age: 28,
    city: "London",
    company: "Apple",
  },
  {
    id: "2",
    name: "Bob Kelley",
    age: 37,
    city: "Paris",
    company: "Microsoft",
  },
  {
    id: "3",
    name: "Amit Gupta",
    age: 29,
    city: "New Delhi",
    company: "Google",
  },
  {
    id: "6",
    name: "Mary Stevens",
    age: 30,
    city: "London",
    company: "Facebook",
  },
  {
    id: "8",
    name: "Dave Burton",
    age: 31,
    city: "Paris",
    company: "Tesla",
  },
  {
    id: "11",
    name: "Pradeep Kumar",
    age: 43,
    city: "Bangalore",
    company: "Amazon",
  },
  {
    id: "16",
    name: "Tim Jonas",
    age: 47,
    city: "London",
    company: "Microsoft",
  },
  {
    id: "18",
    name: "Julia Martins",
    age: 34,
    city: "Paris",
    company: "Apple",
  },
  {
    id: "21",
    name: "Payal Sethi Gupta",
    age: 41,
    city: "New Delhi",
    company: "Microsoft",
  },
  {
    id: "25",
    name: "Anita Burton",
    age: 34,
    city: "London",
    company: "Google",
  },
  {
    id: "34",
    name: "George Matthews",
    age: 26,
    city: "London",
    company: "Tesla",
  },
  {
    id: "28",
    name: "Vish Talwar",
    age: 46,
    city: "New Delhi",
    company: "Amazon",
  },
  {
    id: "41",
    name: "Pooja Kaur",
    age: 25,
    city: "Bangalore",
    company: "Amazon",
  },
  {
    id: "51",
    name: "John Bundy",
    age: 27,
    city: "London",
    company: "Amazon",
  },
  {
    id: "52",
    name: "Anna Matthews",
    age: 39,
    city: "Paris",
    company: "Google",
  },
  {
    id: "53",
    name: "Pankaj Gupta",
    age: 32,
    city: "New Delhi",
    company: "Facebook",
  },
  {
    id: "56",
    name: "Kathy Graham",
    age: 34,
    city: "London",
    company: "Tesla",
  },
  {
    id: "58",
    name: "Tony Fullerton",
    age: 36,
    city: "Paris",
    company: "Amazon",
  },
  {
    id: "61",
    name: "Smita Kumar",
    age: 38,
    city: "Bangalore",
    company: "Microsoft",
  },
  {
    id: "76",
    name: "Harry Smith",
    age: 41,
    city: "London",
    company: "Apple",
  },
  {
    id: "78",
    name: "Amy Martins",
    age: 27,
    city: "Paris",
    company: "Microsoft",
  },
  {
    id: "81",
    name: "Richa Singh",
    age: 33,
    city: "New Delhi",
    company: "Google",
  },
  {
    id: "95",
    name: "Boris Thompson",
    age: 43,
    city: "London",
    company: "Tesla",
  },
  {
    id: "94",
    name: "John Major",
    age: 36,
    city: "London",
    company: "Amazon",
  },
  {
    id: "88",
    name: "Ashish Talwar",
    age: 57,
    city: "New Delhi",
    company: "Microsoft",
  },
  {
    id: "121",
    name: "T Ashwin",
    age: 40,
    city: "Bangalore",
    company: "Google",
  },
  {
    id: "145",
    name: "Steve Paine",
    age: 31,
    city: "London",
    company: "Apple",
  },
  {
    id: "167",
    name: "David Cummins",
    age: 42,
    city: "Paris",
    company: "Microsoft",
  },
  {
    id: "172",
    name: "Rishabh Gupta",
    age: 34,
    city: "New Delhi",
    company: "Google",
  },
  {
    id: "176",
    name: "Serena Stevens",
    age: 25,
    city: "London",
    company: "Facebook",
  },
  {
    id: "184",
    name: "Lionel Burton",
    age: 27,
    city: "Paris",
    company: "Tesla",
  },
  {
    id: "211",
    name: "Navdeep Kumar",
    age: 40,
    city: "Bangalore",
    company: "Amazon",
  },
  {
    id: "216",
    name: "Joe Harris",
    age: 45,
    city: "London",
    company: "Microsoft",
  },
  {
    id: "218",
    name: "Angela Smith",
    age: 33,
    city: "Paris",
    company: "Apple",
  },
  {
    id: "321",
    name: "Neha Sehgal",
    age: 41,
    city: "New Delhi",
    company: "Microsoft",
  },
  {
    id: "225",
    name: "Margaret B",
    age: 35,
    city: "London",
    company: "Google",
  },
  {
    id: "234",
    name: "Harry Seldon",
    age: 28,
    city: "London",
    company: "Tesla",
  },
  {
    id: "428",
    name: "Maya Iyer",
    age: 49,
    city: "New Delhi",
    company: "Amazon",
  },
  {
    id: "441",
    name: "Anita Sood",
    age: 29,
    city: "Bangalore",
    company: "Amazon",
  },
  {
    id: "151",
    name: "Donald Jr.",
    age: 32,
    city: "London",
    company: "Amazon",
  },
  {
    id: "252",
    name: "Timothy Matthews",
    age: 45,
    city: "Paris",
    company: "Google",
  },
  {
    id: "435",
    name: "Umesh Gupta",
    age: 26,
    city: "New Delhi",
    company: "Facebook",
  },
  {
    id: "286",
    name: "Stephanie Graham",
    age: 29,
    city: "London",
    company: "Tesla",
  },
  {
    id: "158",
    name: "Charles Bush",
    age: 32,
    city: "Paris",
    company: "Amazon",
  },
  {
    id: "261",
    name: "Sonia Aiyer",
    age: 35,
    city: "Bangalore",
    company: "Microsoft",
  },
  {
    id: "576",
    name: "Edwards Smith",
    age: 39,
    city: "London",
    company: "Apple",
  },
  {
    id: "378",
    name: "Ken Rosewel",
    age: 26,
    city: "Paris",
    company: "Microsoft",
  },
  {
    id: "281",
    name: "Rohit Jain",
    age: 33,
    city: "New Delhi",
    company: "Google",
  },
  {
    id: "295",
    name: "Michael Fox",
    age: 44,
    city: "London",
    company: "Tesla",
  },
  {
    id: "194",
    name: "Viktor Major",
    age: 38,
    city: "London",
    company: "Amazon",
  },
  {
    id: "688",
    name: "Joy Sharma",
    age: 54,
    city: "New Delhi",
    company: "Microsoft",
  },
  {
    id: "721",
    name: "Pranay Bansal",
    age: 37,
    city: "Bangalore",
    company: "Google",
  },
];
let products = [
  {
    id: "A101",
    name: "Pepsi 300ml",
    price: 20,
  },
  {
    id: "A232",
    name: "Diet Coke 300ml",
    price: 25,
  },
  {
    id: "A102",
    name: "Pepsi 500ml",
    price: 40,
  },
  {
    id: "A237",
    name: "Coke 1l",
    price: 75,
  },
  {
    id: "B034",
    name: "Fruit and Nuts - 40g",
    price: 15,
  },
  {
    id: "B035",
    name: "Crackles - 100g",
    price: 45,
  },
  {
    id: "B036",
    name: "Nutties - 20g",
    price: 10,
  },
  {
    id: "B173",
    name: "25gm bar",
    price: 35,
  },
];
let users = [
  { username: "Emp101", password: "Emp101", name: "Jack Smith", role: "user" },
  { username: "Emp107", password: "Emp107", name: "Mary Gomes", role: "user" },
  { username: "Emp211", password: "Emp211", name: "Anna Steve", role: "admin" },
  { username: "Emp218", password: "Emp218", name: "Bob Jenner", role: "admin" },
];

app.get("/productApp/products", function (req, res) {
  res.send(products);
});
app.get("/productApp/users", function (req, res) {
  let users1 = users.map((u) => ({
    username: u.username,
    name: u.name,
    role: u.role,
  }));
  res.send(users1);
});
app.post("/productApp/products", (req, res) => {
  const product = req.body;
  let prod = products.find((pr) => pr.id === product.id);
  if (!prod) {
    products.push(product);
    console.log(product);
    res.send(product);
  } else res.status(400).send("Product Id already exists");
});
app.post("/productApp/users", (req, res) => {
  const user = req.body;
  let u1 = users.find((u) => u.username === user.username);
  if (!u1) {
    users.push(user);
    let user1 = {
      username: user.username,
      name: user.name,
      role: user.role,
    };
    res.send(user1);
  } else res.status(400).send("Username already exists");
});
app.post("/productApp/login", (req, res) => {
  const details = req.body;
  let user = users.find(
    (u1) => u1.username === details.username && u1.password === details.password
  );
  if (user) {
    let u1 = {
      username: user.username,
      name: user.name,
      role: user.role,
    };
    res.send(u1);
  } else res.status(400).send("Invalid username or password");
});
app.get("/productApp/products/:id", function (req, res) {
  let id = req.params.id;
  let obj = products.find((obj1) => obj1.id === id);
  obj ? res.send(obj) : res.send("not found");
});
app.put("/productApp/products/:id", function (req, res) {
  let id = req.params.id;
  const product = req.body;
  let index = products.findIndex((obj1) => obj1.id === id);
  if (index >= 0) {
    products[index] = product;
    res.send(product);
  } else res.send("not found");
});
app.delete("/productApp/products/:id", function (req, res) {
  let id = req.params.id;
  let index = products.findIndex((obj1) => obj1.id === id);
  if (index >= 0) {
    let product = products.splice(index, 1);
    res.send(product);
  } else res.send("not found");
});
app.put("/productApp/users/:username", function (req, res) {
  let username = req.params.username;
  const user = req.body;
  let index = users.findIndex((obj1) => obj1.username === username);
  if (index >= 0) {
    users[index] = user;
    let user1 = {
      username: user.username,
      name: user.name,
      role: user.role,
    };
    res.send(user1);
  } else res.send("not found");
});
app.delete("/productApp/users/:username", function (req, res) {
  let username = req.params.username;
  let index = users.findIndex((obj1) => obj1.username === username);
  if (index >= 0) {
    let user = users.splice(index, 1);
    res.send("User deleted");
  } else res.send("not found");
});

app.get("/personApp/persons", function (req, res) {
  let page = req.query.page ? +req.query.page : 1;
  let city = req.query.city;
  let company = req.query.company;
  let data1 = persons;
  data1 = filterParam(data1, "city", city);
  data1 = filterParam(data1, "company", company);
  res.send(makeData(page, pageSize, data1));
});

app.post("/personApp/persons", (req, res) => {
  const person = req.body;
  person.id = id + 1;
  id = id + 1;
  persons.push(person);
  res.send(person);
});

let makeData = (pageNum, size, data1) => {
  let startIndex = (pageNum - 1) * size;
  let endIndex =
    data1.length > startIndex + size - 1
      ? startIndex + size - 1
      : data1.length - 1;
  let data2 = data1.filter(
    (lt, index) => index >= startIndex && index <= endIndex
  );
  let dataFull = {
    startIndex: data1.length > 0 ? startIndex + 1 : startIndex,
    endIndex: data1.length > 0 ? endIndex + 1 : endIndex,
    numOfItems: data1.length,
    data: data2,
  };
  return dataFull;
};

let filterParam = (arr, name, values) => {
  if (!values) return arr;
  let valuesArr = values.split(",");
  let arr1 = arr.filter((a1) => valuesArr.find((val) => val === a1[name]));
  return arr1;
};

app.get("/personApp/persons/:id", function (req, res) {
  let id = req.params.id;
  let obj = persons.find((obj1) => obj1.id === id);
  if (obj) res.send(obj);
  res.send("not found");
});

app.get("/productApp/users/:username", function (req, res) {
  let username = req.params.username;
  let user = users.find((obj1) => obj1.username === username);
  user ? res.send(user) : res.send("not found");
});

app.put("/personApp/persons/:id", function (req, res) {
  console.log("Put called");
  let id = req.params.id;
  const person = req.body;
  console.log(id, person);
  let updatedPerson = { id: id, ...person };
  let index = persons.findIndex((obj1) => obj1.id === id);
  if (index >= 0) {
    persons[index] = updatedPerson;
    res.send(updatedPerson);
  } else res.send("not found");
});

app.delete("/personApp/persons/:id", function (req, res) {
  let id = req.params.id;
  let index = persons.findIndex((obj1) => obj1.id === id);
  if (index >= 0) {
    let person = persons.splice(index, 1);
    res.send(person);
  }
  res.send("not found");
});