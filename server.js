const express = require('express');
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// static-files
app.use('/public/upload/', express.static('public/upload/'));

var route = require('./routes');
route(app);

// Start the server
const port = process.env.PORT || 3000;
const host = process.env.DB_HOST ;

app.listen(port, () => {
    console.log(`Server started on ${port} and running at ${host}`);
    
});


