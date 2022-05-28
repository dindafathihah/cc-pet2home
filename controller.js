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

exports.profileUserId = function (req, res) {
    let id = req.params.id

    conne.query('select * from user where id_user = ?', [id], function (error, rows) {
        
        res.send(
            {status:200, 
            error: false, 
            profile: ({
                data:rows
            })
            }
        )
    });
};

//delete with params(OK)
exports.deleteUser = function (req, res) {
    let id = req.params.id

    conne.query('delete from user where id_user = ?', [id], function (error, rows) {
        if (!error) {
            
            res.send(
                {status:200, 
                error: true, 
                message: 'Success deletes id = '+id
                }
            )
        } else if (error) {
            res.send(
                {status:500, 
                error: false, 
                message: 'Fail deletes id'
                }
            )
        }
    });
};

