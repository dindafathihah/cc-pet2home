'use strict'

module.exports=function(app){
    var myjson=require('./controller');
    
    app.route('/')
        .get(myjson.index);

    //Khusus user
    app.route('/showData')
        .get(myjson.showUserDataHistory);
    app.route('/profile/:id')
        .get(myjson.profileUserId);
    app.route('/profile/delete/:id')
        .delete(myjson.deleteUser);
    app.route('/profile/updateData/:id')
        .put(myjson.editProfile)
    app.route('/register')
        .post(myjson.addUser)
    app.route('/login')
        .post(myjson.loginUser)

    //Isi App
    

}