'use strict'
var conne= require('./connection')


exports.index= function(req, res){
    res.status(200).json({
        success: true,
        message: 'My REST API works'
    })
}

exports.showUserDataHistory = function(req, res){
    conne.query('select * from user', function(error, rows, fields){
        res.send(
            {status:200, 
            error: false, 
            rows})
    })
};
