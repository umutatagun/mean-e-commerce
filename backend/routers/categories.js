const { Category } = require('./../models/categories');
const express = require('express');
const { default: mongoose } = require('mongoose');
const { json } = require('body-parser');
const router = express.Router();

router.use(json())

//api/v1/categories/
router.get('/',async(req,res) => {
    const categoryList = await Category.find();

    (!categoryList) ? res.status(500).json({success:false}) : res.status(200).send(categoryList);
})

router.get('/:id',async(req,res) => {
    const category = await Category.findById(req.params.id);

    (!category) ? res.status(500).json({success:false,message: 'The category with given ID not found'}) : res.status(200).send(category);
})

//api/v1/categories/id
router.put('/:id',async(req,res) => {
    const categoryId = mongoose.Types.ObjectId(req.params.id);
    const category = await Category.findByIdAndUpdate(
        categoryId,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },{new: true} // return edilen data yeni mi olsun eskisi mi ?
    );
    if(!category){
        return res.status(400).send('The category cannot be created!');
    }
    res.status(201).send(category);
})  

//api/v1/categories/
router.post('/',(req,res) => {
    const category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    category.save().then((createdCategory) => {
        res.status(201).json(createdCategory);
    }).catch((err) => {
        res.status(500).json({
            error:err,
            success:false
        })
    })
})

//api/v1/categories/id
router.delete('/:id',(req,res) => {
    Category.findByIdAndRemove(req.params.id)
    .then((doc) => {
        if(doc){
            return res.status(200).json({success:true, message: 'The category is deleted'})
        }else{
            return res.status(400).json({success:false,message: 'Category not found'});
        }
    }).catch((err) => {
        return res.status(400).json({success: false, error: err });
    });
})


module.exports = router