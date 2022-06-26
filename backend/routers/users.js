const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

//localhost:3000/api/v1/users
router.get('/',async(req,res) => {
    const userList = await User.find().select('-passwordHash');
    (!userList) ? res.status(500).json({success:false}) : res.status(200).send(userList);
})

//localhost:3000/api/v1/users/id
router.get('/:id',async(req,res) => {
    const userId = mongoose.Types.ObjectId(req.params.id);
    const user = await User.findById(userId).select('-passwordHash');
    (!user) ? res.status(500).json({message:'User not found'}) : res.status(200).send(user);
})

//localhost:3000/api/v1/users/
router.post('/',async(req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();

    if(!user){
        return res.status(500).json({success:false});
    }
    res.status(201).send(user);
});

//localhost:3000/api/v1/users/id
router.put('/:id',async(req,res) => {
    const userId = mongoose.Types.ObjectId(req.params.id);
    const userExist = await User.findById(userId);
    let newPassword;

    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password,10);
    }else{
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        },{new: true}
    );
    if(!user){
        return res.status(400).send('The user cannot be created');
    }
    res.status(201).send('User is Created');
});

//localhost:3000/api/v1/users/login
router.post('/login',async(req,res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send('User not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                userId: user._id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        res.status(200).send({user: user.email,token: token});
    }else{
        res.status(400).send('Password is wrong');
    }
})

//localhost:3000/api/v1/users/register
router.post('/register',async(req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();

    if(!user){
        return res.status(400).send("The user cannot be created");
    }
    res.status(201).send(user);
});

// http://localhost:3000/api/v1/users/get/count
router.get('/get/count',async(req,res) => {
    const userCount = await User.countDocuments()
    
    if(!userCount){
      res.status(500).json({success:false});
    }
    res.status(200).send({
      count: userCount
    })
})

// http://localhost:3000/api/v1/users/id
router.delete('/:id',(req,res) => {
    const userId = mongoose.Types.ObjectId(req.params.id);
    const user = User.findByIdAndDelete(userId).then((user) => {
        (!user) ? res.status(404).json({success:false ,message: 'User not found'}) : res.status(204).json({success:true,message: 'User is deleted'});
    });

})

module.exports = router;
