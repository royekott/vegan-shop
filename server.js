var express = require('express'); 
var port = process.env.PORT || 8080; 
var path = require('path'); 
var morgan = require('morgan'); 
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var cookieSession = require('cookie-session'); 
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = express.Router(); 
var appRoutes = require('./app/routes/api')(router);
var app = express(); 

// Connect to MongoDb
mongoose.connect('mongodb://roye:password1@ds038319.mlab.com:38319/shop-online',
 function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB'); 
    }
});

app.use(morgan('dev')); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({
    name: 'server-session-cookie-id',
    secret: 'mysupersecret', 
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 100, httpOnly: false }
  })
);

app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes); 
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html')); 
});
app.listen(port, function() {
    console.log('Running the server on port ' + port); 
});
