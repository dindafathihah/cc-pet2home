'use strict'

module.exports=function(app){
    var myjson=require('./controller');
    
    //test api berjalan/tidak
    app.route('/')
        .get(myjson.index);

    //Khusus user
    app.route('/profile/:id')
        .get(myjson.profileUserId);
    app.route('/profile/delete/:id')
        .delete(myjson.deleteUser);
    app.route('/profile/update/:id')
        .put(myjson.editProfile)
    app.route('/register')
        .post(myjson.addUser)
    app.route('/login')
        .post(myjson.loginUser)
    
    //Khusus pet
    app.route('/postPet')
        .post(myjson.postPet)
    app.route('/profile/pet/:id')
        .get(myjson.getPetwithIduser);
    app.route('/getallpet')
        .get(myjson.getpet)
    app.route('/getPetWith/:id')
        .get(myjson.getPetwithIdpost)
    app.route('/post/update/:id')
        .put(myjson.editPost)
    app.route('/post/delete/:id')
        .delete(myjson.deletePost)

    //additional
    app.route('/search/title/:title')
        .get(myjson.getpostbytittle);
    app.route('/search/name/:name')
        .get(myjson.getuserbyname);
}