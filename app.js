var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const hbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const db = require('./config/connection');
const session = require('express-session');


// Disable prototype access check
// hbs.handlebars.create().prototypeAccess = true;

db.connect((err)=>{
  if(err)
  {
    console.log("Connection Error" + err);
  }else{
    console.log("Database Connected!");
  }
});

var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname:'hbs',
                              defaultLayout: 'layout', 
                              layoutsDir: path.join(__dirname, 'views', 'layout'),
                              partialsDir: path.join(__dirname, 'views', 'partials')
                            }));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use(session({
  secret : "mysecretkey",
  cookie : {
    maxAge : 600000
  },
  resave: false, // Set to false to prevent session from being saved on every request
  saveUninitialized: false, // Set to false to prevent uninitialized sessions from being saved
  // Other session configuration options... //comments from ChatGPT
}))

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
