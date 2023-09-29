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


var users = [
  {
    role: "ADMIN",
    name: "Edufect",
    empuserid: "1",
    email: "admin@edufect.com",
    password: "admin",
  },
  {
    role: "EMPLOYEE",
    name: "Jack Smith",
    empuserid: "2",
    email: "jack.smith@edufect.com",
    password: "jack123",
    details: {
      manager: "Tim Rogers",
      designation: "Manager",
      department: "Finance",
    },
    contact: {
      country: "USA",
      pincode: "NY4415",
      address: "101, 4th Street",
      city: "New York",
      mobile: "2452376733",
    },
    bills: [
      {
        amount: "2199",
        billid: "2",
        description: "Trip to London",
        empuserid: "2",
        expensetype: "Hotel",
        staystartdate: "11-October-2018",
        stayenddate: "15-October-2018",
        city: "London",
        hotel: "Inter Continental",
        corpbooking: "Yes",
      },
      {
        amount: "4845.50",
        billid: "1",
        description: "Trip to London",
        empuserid: "2",
        expensetype: "Travel",
        goflightDate: "7-March-2019",
        goflightOrigin: "Los Angeles",
        goflightDest: "Seattle",
        goflightNum: "DELTA451",
        backflightDate: "9-March-2019",
        backflightOrigin: "Seattle",
        backflightDest: "Los Angeles",
        backflightNum: "DELTA288",
        corpbooking: "No",
      },
      {
        amount: "99",
        billid: "3",
        description: "Salesforce Subscription",
        empuserid: "2",
        expensetype: "Software",
      },
      {
        amount: "59",
        billid: "4",
        description: "Monthy Mobile Bill",
        empuserid: "2",
        expensetype: "Communication",
      },
    ],
  },
  {
    role: "EMPLOYEE",
    name: "Mary Williams",
    empuserid: "3",
    email: "mary.williams@edufect.com",
  },
  {
    role: "EMPLOYEE",
    name: "Steve Cook",
    empuserid: "4",
    email: "steve@gmail.com",
  },
  {
    role: "EMPLOYEE",
    name: "Catherine",
    empuserid: "5",
    email: "catherine@gmail.com",
  },
  {
    role: "EMPLOYEE",
    name: "Eddy Williams",
    empuserid: "6",
    email: "eddy@gmail.com",
  },
  {
    role: "null",
    name: "yogesh sharma",
    empuserid: "7",
    email: "ysys@gmail.com",
  },
  {
    role: "EMPLOYEE",
    name: "Rahul sharma",
    empuserid: "8",
    email: "rahulsharma@gmail.com",
  },
  {
    role: "EMPLOYEE",
    name: "james william",
    empuserid: "9",
    email: "jameswilliam@edufect.com",
  },
  {
    role: "EMPLOYEE",
    name: "jack wick",
    empuserid: "10",
    password: "jack123",
    email: "jackwick@gmail",
  },
];

app.post("/empapp/loginuser", function (req, res) {
  let body = { email: req.body.email, password: req.body.password };
  let obj = users.find(
    (obj) => obj.email === body.email && obj.password === body.password
  );
  if (obj === undefined) res.status(401).send("Login Failed!!");
  else {
    res.send(obj);
  }
});
app.get("/empapp/emps", function (req, res) {
  let dispArr = [];
  users.map((obj) => {
    let obj1 = { ...obj };
    delete obj1.details;
    delete obj1.contact;
    delete obj1.bills;
    dispArr.push(obj1);
  });
  let page = +req.query.page;
  page = isNaN(page) ? 1 : page;
  //have to add pagination
  let respArr = pagination(dispArr, page);
  let len = dispArr.length;
  let quo = Math.floor(len / 10);
  let rem = len % 10;
  let extra = rem === 0 ? 0 : 1;
  let numofpages = quo + extra;
  let pageInfo = {
    pageNumber: page,
    numberOfPages: numofpages,
    numOfItems: 10,
    totalItemCount: dispArr.length,
  };
  res.json({
    data: respArr,
    pageInfo: pageInfo,
  });
});
app.post("/empapp/emps", function (req, res) {
  let body = { empuserid: users.length + 1, ...req.body };
  users.push(body);
  let obj = { ...body };
  delete obj.password;
  res.send(obj);
});
app.get("/empapp/empdept/:empuserid", function (req, res) {
  let empid = +req.params.empuserid;
  console.log(empid);
  let body = users.find((obj) => +obj.empuserid === empid);
  console.log(body);
  let obj = { ...body.details, empuserid: body.empuserid };
  res.send(obj);
});
app.post("/empapp/empdept/:empuserid", function (req, res) {
  let empid = +req.params.empuserid;
  let ind = users.findIndex((obj) => +obj.empuserid === empid);
  console.log(ind);
  let obj = { ...req.body };
  delete obj.empuserid;
  let body = users[ind];
  let obj1 = { ...body, details: { ...obj } };
  console.log(obj1);
  users[ind] = obj1;
  res.send(req.body);
});
app.get("/empapp/empcontact/:empuserid", function (req, res) {
  let empid = +req.params.empuserid;
  let obj = users.find((obj) => +obj.empuserid === empid);
  let body = { ...obj.contact, empuserid: obj.empuserid };
  res.send(body);
});


app.post("/empapp/empcontact/:empuserid", function (req, res) {
  let empid = +req.params.empuserid;
  let ind = users.findIndex((obj) => +obj.empuserid === empid);
  console.log(ind);
  let obj = { ...req.body };
  delete obj.empuserid;
  let body = users[ind];
  let obj1 = { ...body, contact: { ...obj } };
  console.log(obj1);
  users[ind] = obj1;
  res.send(req.body);
});
app.get("/empapp/empbills/:empuserid", function (req, res) {
  let empid = +req.params.empuserid;
  let ind = users.findIndex((obj) => +obj.empuserid === empid);
  let dispArr = users[ind].bills;
  let page = +req.query.page;
  page = isNaN(page) ? 1 : page;
  //have to add pagination
  let respArr = pagination(dispArr, page);
  let len = dispArr.length;
  let quo = Math.floor(len / 10);
  let rem = len % 10;
  let extra = rem === 0 ? 0 : 1;
  let numofpages = quo + extra;
  let pageInfo = {
    pageNumber: page,
    numberOfPages: numofpages,
    numOfItems: 10,
    totalItemCount: dispArr.length,
  };
  res.json({
    data: respArr,
    pageInfo: pageInfo,
  });
});
app.post("/empapp/empbills/:empuserid", function (req, res) {
  let empid = +req.params.empuserid;
  let ind = users.findIndex((obj) => +obj.empuserid === empid);
  console.log(ind);
  let obj = users[ind];
  if (obj.bills === undefined) {
    let billArr = [];
    let obj1 = { billid: 1, ...req.body };
    billArr.push(obj1);
    let obj2 = { ...obj, bills: billArr };
    users[ind] = obj2;
  } else {
    let billArr = obj.bills;
    console.log(billArr);
    let obj1 = { billid: billArr.length + 1, ...req.body };
    billArr.push(obj1);
    obj.bills = billArr;
    let obj2 = { ...obj };
    users[ind] = obj2;
  }
  console.log(users[ind]);
  res.send(req.body);
});
app.post("/empapp/hotelbill", function (req, res) {
  let body = req.body;
  let ind = users.findIndex((obj1) => +obj1.empuserid === +body.empuserid);
  let billInd = users[ind].bills.findIndex(
    (obj1) => +obj1.billid === +body.billid
  );
  //console.log(users[ind].bills[billInd])
  delete body.billid;
  delete body.empuserid;
  let body1 = users[ind].bills[billInd];
  //console.log(body, body1);
  let obj = { ...body1, ...body };
  //console.log(obj);
  users[ind].bills[billInd] = obj;
  res.send(users[ind]);
});
app.get("/empapp/hotelbill/:empid/:billid", function (req, res) {
  let empid = +req.params.empid;
  //console.log(empid);
  let ind = users.findIndex((obj1) => +obj1.empuserid === empid);
  let ob1 = users.find((obj1) => +obj1.empuserid === +empid);
  let billid = +req.params.billid;
  console.log(billid);
  let billInd = ob1.bills.findIndex((obj) => +obj.billid === billid);
  console.log(billInd);
  let obj = users[ind].bills[billInd];
  let obj1 = { empuserid: empid, ...obj };
  console.log(obj1);
  res.send(obj1);
});
app.get("/empapp/travelbill/:empid/:billid", function (req, res) {
  let empid = +req.params.empid;
  let ind = users.findIndex((obj1) => +obj1.empuserid === empid);
  let ob1 = users.find((obj1) => +obj1.empuserid === empid);
  let billid = +req.params.billid;
  console.log(ob1);
  //finding bill index
  let billInd = ob1.bills.findIndex((obj) => +obj.billid === billid);
  console.log(billInd);
  let obj = users[ind].bills[billInd];
  let obj1 = { empuserid: empid, ...obj };
  console.log(obj1);
  res.send(obj1);
});
app.post("/empapp/travelbill", function (req, res) {
  let body = req.body;
  console.log(body,'body');
  let ind = users.findIndex((obj1) => +obj1.empuserid === +body.empuserid);
  let billInd = users[ind].bills.findIndex(
    (obj1) => +obj1.billid === +body.billid
  );
  console.log(billInd);
  delete body.billid;
  delete body.empuserid;
  let body1 = users[ind].bills[billInd];
  let obj = { ...body, ...body1 };
  users[ind].bills[billInd] = obj;
  res.send(users[ind]);
});

function pagination(obj, page) {
  var resArr = obj;
  resArr = resArr.slice(page * 10 - 10, page * 10);
  return resArr;
}




