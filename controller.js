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


//CRUD User
//sukses
exports.loginUser =  function (req,res){
    var email = req.body.email
    var password = md5(req.body.password)
    let values = [email,password]
    conne.query('select * from user where email = ? and password = ?', values,function (error, rows) {
        if (rows.length == 1){
            res.status(200).json({
                status:200,
                error: true,
                //message: 'Login success',
                result:({
                    userId: rows[0].id_user,
                    email: rows[0].email,
                    username: rows[0].username
                })
            })
        }else if(rows.length !== 1){
            res.status(401).json({
                status:401,
                error: false,
                message: 'Login failed. Wrong email or password!',
            })
        }
    })
}

//sukses
exports.profileUserId = function (req, res) {
    let id = req.params.id

    conne.query('select * from user where id_user = ?', [id], function (error, rows) {
        res.status(200).json({
            status:200,
            success: true,
            message: 'User found',
            result: ({
                data:rows
            })
            }
        )
    });
};


//sukses
exports.addUser = function(req, res){
    var email = req.body.email
    var id  = nanoid(16)
    var username =req.body.username
    var password = md5(req.body.password)
    var phone_number = req.body.phone_number
    var birth_date=req.body.birth_date
    var birth_place=req.body.birth_place 
    var role='member'
    var status='active'
    var createdAt = new Date();
    var updatedAt = createdAt;
    conne.query('select email from user where email = ?',email, function (error, rows) {
        if (rows.length == 1){
            res.status(400).json({
                status: 400,
                success: false,
                message: 'Email has been taken. Try with another email'
            })
        } else if(rows.length == 0){
            let values =['user_'+id, email, username, password, phone_number, birth_date, birth_place, role, status,createdAt, updatedAt] 
            conne.query('insert into user (id_user, email, username, password, phone_number, birth_date, birth_place, role, status,created_at, updated_at) values (?,?,?,?,?,?,?,?,?,?,?)', values, function(error, rows, fields){
                if(error){
                    res.status(500).json({
                        status:500,
                        success: false,
                        error
                        }   
                    )
                }else{
                    res.status(201).json({
                        status:201,
                        success: true,
                        message: 'Email registered successfully',
                        result: ({
                            userId: 'user_'+id,
                            email: email,
                            username: username
                        })
                    })
                    
                }
            })
        }
    })
}


exports.getallUser=function(req, res){
    conne.query(`select * from user `, function (error, rows){
        res.status(200).json({
            status:200,
            success: true,
            result: ({
                data:rows
            })
            }
        )
    })
}

//sukses
exports.deleteUser = function (req, res) {
    let id = req.params.id

    conne.query('delete from user where id_user = ?', [id], function (error, rows) {
        if (!error) {
            res.status(200).json({
                status:200,
                success: true, 
                message: 'Success deletes id = '+id,
                
                }
            )
        } else if (error) {
            res.status(404).json({ 
                status:404,
                success: false, 
                message: 'Fail deletes id='+id
                }
            )
        }
    });
};

//sukses
exports.editProfile= function (req, res){
    let id = req.params.id
    let username=req.body.username;
    let password=md5(req.body.password);
    let email=req.body.email;
    let birth_date=req.body.birth_date;
    let birth_place=req.body.birth_place;
    let phone_number=req.body.phone_number;
    let updated_at = new Date()

    conne.query('update user set username = ?, password=?,email = ?, birth_date = ?, birth_place = ?,  phone_number=?, updated_at=? where id_user = ?',
    [username, password, email, birth_date, birth_place,  phone_number,updated_at, id ], 
        function (error, rows, fields){
            if (error){
                res.status(500).json({
                    status:500,
                    success: false,
                    error: error
                    }
                )
            } else if (!error) {     
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Success updates user with id = '+id
                    }
                )
            }
        }
    )
}


//CRUD PET
//sukses
exports.postPet = function (req,res){
    var id  = nanoid(16)
    var id_user = req.body.id_user
    var tittle = req.body.tittle
    var breed = req.body.breed
    var age = req.body.age
    var location = req.body.location
    var description = req.body.description
    var whatsapp = req.body.whatsapp
    var insta = req.body.insta
    var createdAt = new Date()
    var updatedAt = createdAt
    let values =['posts-'+id, id_user,tittle,breed,age,location,description,insta,whatsapp,createdAt, updatedAt] 
    conne.query('insert into posts (id_post, id_user, tittle, breed, age,location, description,  insta, whatsapp, created_at, updated_at) values (?,?,?,?,?,?,?,?,?,?,?)', values, function(error, rows, fields){
        if(error){
            res.status(500).send(
                {status: 500,
                success: false, 
                error
                }
            )
        }else{
            res.status(200).send({
                status: 200,
                success: true,
                message: 'Post sent successfully'
            })
        }
    })
}

//sukses
exports.getpet = function(req,res){

    conne.query('select * from posts', function (error, rows) {
        
        res.status(200).send(
            {status:200,
            succes: true, 
            result: ({
                data:rows
            })
            }
        )
    });
}

//sukses
exports.getPetwithIduser =function(req,res){
    let id = req.params.id
    conne.query('select * from posts where id_user = ?', [id],function (error, rows) {
        res.status(200).send(
            {status:200,
            success: true, 
            result: ({
                data:rows
            })
            }
        )
    });
}

//sukses
exports.getPetwithIdpost =function(req,res){
    let id = req.params.id
    conne.query('select * from posts where id_post = ?', [id],function (error, rows) {
        res.status(200).send(
            {status:200,
            succes: true, 
            result: ({
                data:rows
            })
            }
        )
    });
}

//sukses 
exports.deletePost = function (req, res) {
    let id = req.params.id

    conne.query('delete from posts where id_post = ?', [id], function (error, rows) {
        if (!error) {
            
            res.status(200).send(
                { status:200,
                success: true, 
                message: 'Success deletes post with id= '+id,
            
                }
            )
        } else if (error) {
            res.status(400).send(
                {
                status:400,
                success: false, 
                message: 'Fail deletes post with id='+id
                }
            )
        }
    });
};

//sukses
exports.editPost= function (req, res){
    let id = req.params.id
    var tittle = req.body.tittle
    var breed = req.body.breed
    var age = req.body.age
    var location = req.body.location
    var description = req.body.description
    var insta = req.body.insta
    var updated_at = new Date()
    let values =[tittle,breed,age,location,description,insta, updated_at, id] 
    
    conne.query('update posts set tittle=?, breed=?, age=?, location=?, description=?, insta=?, updated_at=? where id_user=?', values, function(error, rows, fields){
        
            if (error){
                res.status(500).json({
                    status:500,
                    success: false,
                    message: 'Fail updates id',
                    error
                    }
                )
            } else if (!error) {     
                res.status(200).json({
                    status:200,
                    success: true,
                    message: 'Success updates id = '+id
                    }
                )
            }
        }
    )
}

exports.getpostbytittle = function (req,res){
    let title = req.params.title
    conne.query(`select * from posts where tittle like '%${title}%'`,function (error, rows) {
        res.status(200).send(
            {status:200,
            succes: true, 
            result: ({
                data:rows
            })
            }
        )
    });    
}

exports.getuserbyname = function (req, res) {
    let name = req.params.name
    conne.query(`select * from user where username like '%${name}%'`, function (error, rows) {
        res.status(200).json({
            status:200,
            success: true,
            result: ({
                data:rows
            })
            }
        )
    });
};

exports.search=function(req, res){
    let title=req.query.title
    let breed=req.query.breed

    if (breed == null || breed == undefined){
        conne.query(`select * from posts where tittle like '%${title}%'`, function (error, rows){
            res.status(200).json({
                status:200,
                success: true,
                result: ({
                    data:rows
                })
                }
            )
        })
    }else if (title == null || title == undefined){
        conne.query(`select * from posts where breed like '%${breed}%'`, function (error, rows){
            res.status(200).json({
                status:200,
                success: true,
                result: ({
                    data:rows
                })
                }
            )
        })
    }else if (title !== null && breed !== undefined){
        conne.query(`select * from posts where tittle like '%${title}%' and breed like '%${breed}%'`, function (error, rows){
            res.status(200).json({
                status:200,
                success: true,
                result: ({
                    data:rows
                })
                }
            )
        })
    }
}

exports.searchUser = function(req, res){
    let name= req.query.name

    conne.query(`select * from user where username like '%${name}%'`, function (error, rows){
        res.status(200).json({
            status:200,
            success: true,
            result: ({
                data:rows
            })
            }
        )
    })
}
