'use strict'
var conne= require('./connection')
var md5 = require('md5')
const { nanoid } = require('nanoid')


exports.index= function(req, res){
    res.status(200).json({
        success: true,
        message: 'My REST API works'
    })
}

exports.showUserDataHistory = function(req, res){
    conne.query('select * from user', function(error, rows, fields){
        res.status(200).json({
            success: false,
            rows
        })
    })
};

exports.profileUserId = function (req, res) {
    let id = req.params.id

    conne.query('select * from user where id_user = ?', [id], function (error, rows) {
        res.status(200).json({
            success: false,
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
            res.status(200).json({
                error: true, 
                message: 'Success deletes id = '+id
                }
            )
        } else if (error) {
            res.status(200).json({ 
                error: false, 
                message: 'Fail deletes id'
                }
            )
        }
    });
};

//update with params(OK)
exports.editProfile= function (req, res){
    //let id= req.body.id;
    let id = req.params.id
    let username=req.body.username;
   // let password=md5(req.body.password);
    let email=req.body.email;
    //let full_name=req.body.full_name;
    let birth_date=req.body.birth_date;
    let birth_place=req.body.birth_place;
    let phone_number=req.body.phone_number;

    conne.query('update user set username = ?, email = ?, birth_date = ?, birth_place = ?,  phone_number=?  where id_user = ?',
    [username, email, birth_date, birth_place, phone_number,id ], 
        function (error, rows, fields){
            if (error){
                res.status(500).json({
                    success: true,
                    message: 'Fail updates id'
                    }
                )
            } else if (!error) {     
                res.status(200).json({
                    success: false,
                    message: 'Success updates id = '+id
                    }
                )
            }
        }
    )
}


exports.addUser = function(req, res){
    var email = req.body.email
    var id  = nanoid(16)
    var username =req.body.username
    var password = md5(req.body.password)
    var phone_number = req.body.phone_number
    var birth_date=req.body.birth_date
    var birth_place=req.body.birth_place 
    var role="member"
    var status="active"
    conne.query('select email from user where email = ?',email, function (error, rows) {
        if (rows.length == 1){
            res.status(400).json({
                success: true,
                message: 'Email has been taken. Try with another email'
            })
        } else if(rows.length == 0){
            let values =['user_'+id, email, username, password, phone_number, birth_date, birth_place, role, status] 
            conne.query('insert into user (id_user, email, username, password, phone_number, birth_date, birth_place, role, status) values (?,?,?,?,?,?,?,?,?)', values, function(error, rows, fields){
                if(error){
                    res.status(500).json({
                        success: true,
                        error
                        }
                    )
                }else{
                    res.status(200).json({
                        success: false,
                        rows,
                        message: 'Email registered successfully'
                    })
                }
            })
        }
    })
}

exports.loginUser =  function (req,res){
    var email = req.body.email
    var password = md5(req.body.password)
    let values = [email,password]
    conne.query('select * from user where email = ? and password = ?', values,function (error, rows) {
        if (rows.length == 1){
            res.status(200).json({
                success: true,
                rows,
                message: 'Login success',
                user:({
                    id: rows[0].id_user,
                    username: rows[0].username
                })
            })
        }else if(rows.length !== 1){
            res.status(401).send({
                error: false,
                message: 'Login failed. Wrong email or password!',
            })
        }
    })
}

