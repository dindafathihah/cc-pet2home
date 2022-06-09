'use strict'
var conne = require('./connection')
var md5 = require('md5')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid')

exports.index = function(req, res) {
    res.status(200).json({
        success: true,
        message: 'My REST API works'
    })
}


//CRUD User
//sukses
exports.loginUser = function(req, res) {
    var email = req.body.email
    var password = md5(req.body.password)
    let values = [email, password]
    conne.query('select * from user where email = ? and password = ?', values, function(error, rows) {
        if (rows.length == 1) {
            //set token
            var token = jwt.sign({ id_user: rows[0].id_user, email: rows[0].email },
                process.env.TOKEN_KEY
            );
            res.status(200).json({
                status: 200,
                error: true,
                message: 'Login success',
                result: ({
                    token: token,
                    userId: rows[0].id_user,
                    email: rows[0].email,
                    username: rows[0].username
                })
            })
        } else if (rows.length !== 1) {
            res.status(401).json({
                status: 401,
                success: false,
                message: 'Login failed. Wrong email or password!',
            })
        }
    })
}

//sukses
exports.profileUserId = function(req, res) {
    let id = req.params.id

    conne.query('select * from user where id_user = ?', [id], function(error, rows) {
        res.status(200).json({
            status: 200,
            success: true,
            message: 'User found',
            result: ({
                data: rows
            }),
            userpic: '/public/upload/' + rows[0].avatar
        })
    });
};


//sukses
exports.addUser = function(req, res) {
    var email = req.body.email
    var id = nanoid(16)
    var username = req.body.username
    var password = md5(req.body.password)
    var phone_number = req.body.phone_number
    var birth_date = req.body.birth_date
    var birth_place = req.body.birth_place
    var role = 'member'
    var status = 'active'
    var avatar = 'default.png';
    var gender = null;
    var createdAt = new Date();
    var updatedAt = createdAt;
    conne.query('select email from user where email = ?', email, function(error, rows) {
        if (rows.length == null) {
            res.status(400).json({
                status: 400,
                success: false,
                message: 'Email has been taken. Try with another email'
            })
        } else if (rows.length == 0) {
            let values = ['user_' + id, email, username, password, phone_number, birth_date, birth_place, avatar, gender, role, status, createdAt, updatedAt]
            conne.query('insert into user (id_user, email, username, password, phone_number, birth_date, birth_place,avatar, gender, role, status,created_at, updated_at) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', values, function(error, rows, fields) {
                if (error) {
                    res.status(500).json({
                        status: 500,
                        success: false,
                        error
                    })
                } else {
                    res.status(201).json({
                        status: 201,
                        success: true,
                        message: 'Email registered successfully',
                        result: ({
                            userId: 'user_' + id,
                            email: email,
                            username: username
                        })
                    })

                }
            })
        }
    })
}


exports.getallUser = function(req, res) {
    conne.query(`select * from user `, function(error, rows) {
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Data has found',
            result: ({
                data: rows
            })
        })
    })
}

//sukses
exports.deleteUser = function(req, res) {
    let id = req.params.id

    conne.query('delete from user where id_user = ?', [id], function(error, rows) {
        if (!error) {
            //delete avatar user
            if (rows[0].avatar != 'default.png' || rows[0].avatar != null) {
                fs.unlink(__dirname + '/public/upload/user/' + rows[0].avatar, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File has been Deleted');
                    }
                });
            }
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Success deletes id = ' + id,

            })
        } else if (error) {
            res.status(404).json({
                status: 404,
                success: false,
                message: 'Fail deletes id =' + id
            })
        }
    });
};

//sukses
exports.editProfile = function(req, res) {
    let id = req.params.id;
    var username = req.body.username;
    var email = req.body.email;
    var birth_date = req.body.birth_date;
    var birth_place = req.body.birth_place;
    var phone_number = req.body.phone_number;
    var updated_at = new Date()
    var gender = req.body.gender

    // check user data
    conne.query('select * from user where id_user = ?', id, function(error, rows) {
        if (rows.length == 1) {

            //check image file
            if (req.file) {
                var avatar = req.file.fieldname + '_' + req.file.originalname;


                if (rows[0].avatar != 'default.png' || rows[0].avatar != null) {

                    //delete file
                    fs.unlink(__dirname + '/public/upload/' + rows[0].avatar, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('File has been Deleted');
                        }
                    });
                }
            } else {
                var avatar = rows[0].avatar
            };

            conne.query('update user set username = ?, password=?,email = ?, birth_date = ?, birth_place = ?,  phone_number=?, avatar = ?, updated_at=?, gender=? where id_user = ?', [username, rows[0].password, email, birth_date, birth_place, phone_number, avatar, updated_at, gender, id],
                function(error, rows, fields) {
                    if (error) {
                        res.status(500).json({
                            status: 500,
                            success: false,
                            error: error
                        })
                    } else if (!error) {
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: 'Success updates user with id = ' + id,
                            destination: '/public/upload/' + avatar
                        })
                    }
                }
            )
        } else {
            res.status(400).json({
                status: 400,
                success: false,
                message: 'user data not found'
            })
        }
    })
}


//CRUD PET
//sukses
exports.postPet = function(req, res) {

    //check image file
    if (!req.file) {
        res.status(400).send({
            status: 400,
            success: false,
            message: "No File is selected."
        })
    } else {
        var id = nanoid(16)
        var id_user = req.body.id_user
        var tittle = req.body.tittle
        var breed = req.body.breed
        var age = req.body.age
        var location = req.body.location
        var description = req.body.description
        var lat = req.body.lat
        var lon = req.body.lon
        var whatsapp = req.body.whatsapp
        var insta = req.body.insta
        var createdAt = new Date()
        var updatedAt = createdAt
        var image = req.file.fieldname + '_' + req.file.originalname;


        let values = ['posts-' + id, id_user, tittle, breed, age, location, lat, lon, description, insta, whatsapp, createdAt, updatedAt, image]
        conne.query('insert into posts (id_post, id_user, tittle, breed, age,location, lat, lon, description,  insta, whatsapp, created_at, updated_at, pic) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', values, function(error, rows, fields) {
            if (error) {
                res.status(500).send({
                    status: 500,
                    success: false,
                    message: error.message
                })
            } else {
                res.status(200).send({
                    status: 200,
                    success: true,
                    message: 'Post sent successfully'
                })
            }
        })
    }
}

//sukses
exports.getpet = function(req, res) {

    conne.query('select * from posts', function(error, rows) {

        res.status(200).send({
            status: 200,
            succes: true,
            message: 'Pet has found',
            result: ({
                data: rows
            })
        })
    });
}

//sukses
exports.getPetwithIduser = function(req, res) {
    let id = req.params.id
    conne.query('select * from posts where id_user = ?', [id], function(error, rows) {
        res.status(200).send({
            status: 200,
            success: true,
            message: 'Pet has found with id user = ' + id,
            result: ({
                data: rows
            })
        })
    });
}

//sukses
exports.getPetwithIdpost = function(req, res) {
    let id = req.params.id
    conne.query('select * from posts where id_post = ?', [id], function(error, rows) {
        res.status(200).send({
            status: 200,
            succes: true,
            message: 'Pet has found with id post = ' + id,
            result: ({
                data: rows
            })
        })
    });
}

//sukses 
exports.deletePost = function(req, res) {
    let id = req.params.id

    conne.query('delete from posts where id_post = ?', [id], function(error, rows) {
        if (!error) {

            res.status(200).send({
                status: 200,
                success: true,
                message: 'Success deletes post with id= ' + id,

            })
        } else if (error) {
            res.status(400).send({
                status: 400,
                success: false,
                message: 'Fail deletes post with id=' + id
            })
        }
    });
};

//sukses
exports.editPost = function(req, res) {
    var id_post = req.params.id;
    var tittle = req.body.tittle
    var breed = req.body.breed;
    var age = req.body.age;
    var location = req.body.location;
    var description = req.body.description;
    var insta = req.body.insta;
    var whatsapp = req.body.whatsapp;
    var updated_at = new Date();

    // check post data
    conne.query('select * from posts where id_post = ?', id_post, function(error, rows) {
        if (rows.length == 1) {

            //check image file
            if (req.file) {
                var image = req.file.fieldname + '_' + req.file.originalname;

                if (rows[0].pic != 'default.png' || rows[0].pic != null) {
                    //delete file
                    fs.unlink(__dirname + '/public/upload/' + rows[0].pic, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('File has been Deleted');
                        }
                    });
                }
            } else {
                var image = rows[0].pic
            };

            // update data 
            var values = [tittle, breed, age, location, description, insta, updated_at, image, whatsapp, id_post]
            console.log(values);
            conne.query('update posts set tittle = ?, breed = ?, age = ? , location = ? , description=?, insta=?, updated_at=?, pic=?, whatsapp=? where id_post=?', values, function(error, rows, fields) {

                if (error) {
                    res.status(500).json({
                        status: 500,
                        success: false,
                        message: error.message
                    })
                } else if (!error) {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: 'Post successfully updates, id = ' + id_post
                    })
                }
            })
        } else {
            res.status(400).json({
                status: 400,
                success: false,
                message: 'post data not found'
            })
        }
    });
}



exports.search = function(req, res) {
    let title = req.query.title
    let breed = req.query.breed

    if (breed == null || breed == undefined) {
        conne.query(`select * from posts where tittle like '%${title}%'`, function(error, rows) {
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Post has found with title = ' + title,
                result: ({
                    data: rows
                })
            })
        })
    } else if (title == null || title == undefined) {
        conne.query(`select * from posts where breed like '%${breed}%'`, function(error, rows) {
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Post has found with breed = ' + breed,
                result: ({
                    data: rows
                })
            })
        })
    } else if (title !== null && breed !== undefined) {
        conne.query(`select * from posts where tittle like '%${title}%' and breed like '%${breed}%'`, function(error, rows) {
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Post has found with title = ' + title + ' and breed = ' + breed,
                result: ({
                    data: rows
                })
            })
        })
    }
}

exports.searchUser = function(req, res) {
    let name = req.query.name

    conne.query(`select * from user where username like '%${name}%'`, function(error, rows) {
        res.status(200).json({
            status: 200,
            success: true,
            message: 'User has found with username = ' + name,
            result: ({
                data: rows
            })
        })
    })
}

exports.changePassword = function(req, res) {
    let id = req.params.id;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;

    conne.query('select * from user where id_user = ?', [id], function(error, rows) {

        if (rows.length != null) {
            if (rows[0].password == md5(oldPassword)) {

                //update password
                let id = rows[0].id_user;
                var username = rows[0].username;
                var password = md5(newPassword);
                var email = rows[0].email;
                var birth_date = rows[0].birth_date;
                var birth_place = rows[0].birth_place;
                var phone_number = rows[0].phone_number;
                var avatar = rows[0].avatar;
                var updated_at = new Date()
                var gender = rows[0].gender

                conne.query('update user set username = ?, password=?,email = ?, birth_date = ?, birth_place = ?,  phone_number=?, avatar = ?, updated_at=?, gender=? where id_user = ?', [username, password, email, birth_date, birth_place, phone_number, avatar, updated_at, gender, id],
                    function(error, rows, fields) {
                        if (error) {
                            res.status(500).json({
                                status: 500,
                                success: false,
                                error: error
                            })
                        } else if (!error) {
                            res.status(200).json({
                                status: 200,
                                success: true,
                                message: 'Updated password user successfully',
                            })
                        }
                    }
                )


            } else {
                res.status(200).json({
                    status: 200,
                    success: false,
                    message: 'Old Password not match '
                })
            }
        } else {
            res.status(200).json({
                status: 200,
                success: false,
                message: 'User not found'
            })
        }

    })


}