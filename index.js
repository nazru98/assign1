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






