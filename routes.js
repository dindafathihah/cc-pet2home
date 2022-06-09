'use strict'

module.exports = function(app) {
    var myjson = require('./controller');
    var auth = require("./VerifyToken");
    var upload = require('./multer-config');

    //test api berjalan/tidak
    app.route('/')
        .get(myjson.index);

    //Khusus user
    app.route('/profile/:id')
        .get(auth, myjson.profileUserId);
    app.route('/profile/delete/:id')
        .delete(auth, myjson.deleteUser);
    app.route('/profile/update/:id')
        .put(auth, upload.imageUpload.single('avatar'), myjson.editProfile)
    app.route('/register')
        .post(myjson.addUser)
    app.route('/login')
        .post(myjson.loginUser)
    app.route('/getAlluser')
        .get(auth, myjson.getallUser)

    //Khusus pet
    app.route('/postPet')
        .post(auth, upload.imageUpload.single('image'), myjson.postPet)
    app.route('/profile/pet/:id')
        .get(auth, myjson.getPetwithIduser);
    app.route('/getallpet')
        .get(auth, myjson.getpet)
    app.route('/getPetWith/:id')
        .get(auth, myjson.getPetwithIdpost)
    app.route('/post/update/:id')
        .put(auth, upload.imageUpload.single('image'), myjson.editPost)
    app.route('/post/delete/:id')
        .delete(auth, myjson.deletePost)

    //additional
    
    
    app.route('/search')
        .get(auth, myjson.search);
    app.route('/searchUser')
        .get(auth, myjson.searchUser);
}