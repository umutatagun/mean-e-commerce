const express = require('express');
const { Category } = require('../models/categories');
const mongoose = require('mongoose');
const router = express.Router();
const {Product} = require('../models/product');

// http://localhost:3000/api/v1/products
router.get(`/`,async(req,res) => {
  // localhost:3000/api/v1/products?categories=xx,yy
  let filter = {};
  if(req.query.categories){
    filter = {category: req.query.categories.split(',')};
  }  

  const newProduct = await Product.find(filter).populate('category');
    
  (!newProduct) ? res.status(500).json({success:false}) : res.send(newProduct);
})

// http://localhost:3000/api/v1/products/id
router.get('/:id',async(req,res) => {
  // populate id referansı verdiğimiz collection'ı detaylarıyla göstermemizi sağlıyor
  const product = await Product.findById(req.params.id).populate('category');
  
  (!product) ? res.status(500).send('Product not found') : res.status(200).send(product);
})

// http://localhost:3000/api/v1/products/get/count
router.get('/get/count',async(req,res) => {
  const productCount = await Product.countDocuments()
  
  if(!productCount){
    res.status(500).json({success:false});
  }
  res.status(200).send({
    count: productCount
  })
})

// http://localhost:3000/api/v1/products/get/featured/:count
router.get('/get/featured/:count',async(req,res) => {
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({isFeatured: true}).limit(+count); // + koyarak stringToInt cast yaptık
  
  if(!products){
    res.status(500).json({success:false});
  }
  res.status(200).send(products);
})
  
// http://localhost:3000/api/v1/products
router.post(`/`,async(req,res) => {
  const categoryId = mongoose.Types.ObjectId(req.body.category)
  const category = await Category.findById(categoryId);
  
  if(!category){
    return res.status(500).send('invalid category')
  }

  var newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: categoryId,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    newReviews: req.body.newReviews,
    isFeatured: req.body.isFeatured
  });

  newProduct = await newProduct.save();

  if(!newProduct)
  return res.status(500).send('The product cannot be created');

  return res.send(newProduct);
})

router.put('/:id',async(req,res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send('Invalid Product ID');
  }
  const categoryId = mongoose.Types.ObjectId(req.body.category);
  const category = await Category.findById(categoryId);
  
  if(!category){
    return res.status(400).send('invalid category')
  }

  const productId = mongoose.Types.ObjectId(req.params.id);
  const product = await Product.findByIdAndUpdate(
      productId,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        newReviews: req.body.newReviews,
        isFeatured: req.body.isFeatured
      },{new: true} // return edilen data yeni mi olsun eskisi mi ?
  );
  if(!product){
      return res.status(400).send('The product cannot be created!');
  }
  res.status(201).send(product);
})  

router.delete('/:id',(req,res) => {
  Product.findByIdAndRemove(req.params.id)
  .then((doc) => {
      if(doc){
          return res.status(200).json({success:true, message: 'The product is deleted'})
      }else{
          return res.status(400).json({success:false,message: 'Product not found'});
      }
  }).catch((err) => {
      return res.status(400).json({success: false, error: err });
  });
})

module.exports = router;

