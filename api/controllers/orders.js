const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.order_get_all =  (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .exec()
    .then(docs => {
        res.status(200).json(docs)
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

exports.order_delete_order = (req, res, next) => {
    Order.remove(req.params.orderId)
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost/orders',
                body: { productId: 'Id', quantity:"number" }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}