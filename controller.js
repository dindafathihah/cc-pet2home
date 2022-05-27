'use strict'
var conne= require('./connection')


exports.index= function(req, res){
    res.status(200).json({
        success: true,
        message: 'My REST API works'
    })
}
