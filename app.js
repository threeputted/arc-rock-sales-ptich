// cd "C:\Users\j\Dropbox (Criterion Research)\Development\Consulting Projects\Gelber Utility Hedging\application";  nodemon

const express = require('express');
//const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const csrf = require('csurf');
const cors  = require('cors');
const chalk = require('chalk');
const recursive = require('recursive-readdir');   // this is being used in the create partials application
const fs = require('fs');
const hbs = require('hbs');
const createError = require('http-errors');

const multer = require('multer');

const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');           // Simple session middleware for Express
const pgSession = require('connect-pg-simple')(session);
const MongoStore = require('connect-mongo')(session);


const credentials = require('./credentials');

const router = express.Router();
const app = express();

// view engine setup

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'files')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


console.log(chalk.bold.green("application started"));


// Set up the mongoose connection  //this was the old piece.  Not sure if it did anything or not
let connection;// = credentials.mongo.production.primary;
console.log(chalk.bold.blue("This is process.env.MongoServer: " + process.env.MongoServer));
let options;

switch(process.env.COMPUTERNAME) {
  case 'CRITERION-JCB':
    //connection = credentials.mongo.development;
    connection = credentials.mongo.production;
    break;
  case 'DESKTOP-H7C65O4':
    //connection = credentials.mongo.development;
    connection = credentials.mongo.production;
    break;
  default:
    connection = credentials.mongo.production;
}

//switch(app.get('env')){
switch(process.env.NODE_ENV){
  case 'production':
    mongoose.connect(connection.connectionString, connection.options);
    app.use(session({
      store: new MongoStore({
        mongooseConnection: mongoose.connection
        , ttl: 14 * 24 * 60 * 60 // = 14 days. Default
      })
      , secret : credentials.session.secretKey
      , resave : true
      , saveUninitialized : false
    }));
    break;
  default:
    //console.log("This is the computer name: " + process.env.COMPUTERNAME);

    mongoose.connect(connection.connectionString, connection.options);
    app.use(session({
      store: new MongoStore({
        mongooseConnection: mongoose.connection
        , ttl: 14 * 24 * 60 * 60 // = 14 days. Default
      })
      , secret : credentials.session.secretKey
      , resave : true
      , saveUninitialized : false
    }));
    break;
}
console.log(chalk.bold.yellow("Verify Mongoose connection is successful: " + mongoose.connection.readyState));




// Postgres Initialization
/*
var pg = require('pg');

//console.log(chalk.bold.blue("process.env.NODE_ENV: " + process.env.NODE_ENV));
switch (process.env.NODE_ENV){
  case "development":
    //global.pgPool = new pg.Pool(credentials.postgres.development);
    global.pgPool = new pg.Pool(credentials.postgres.production);
    global.pgCriterion = new pg.Pool(credentials.postgres.criterion);
    break;
  default:
    //global.pgPool = new pg.Pool(credentials.postgres.development);
    global.pgPool = new pg.Pool(credentials.postgres.production);
    global.pgCriterion = new pg.Pool(credentials.postgres.criterion);
    break;
}

// session software
app.use(session({
  store: new pgSession({
    pool : global.pgPool,
    tableName : "session"
    , ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  }),
  secret: credentials.session.secretKey,
  resave: false,
  saveUninitialized: true,
}));
*/


// Config file for passport
//require('./admin/controllers/passport')(passport);

// initialize the passport (login) information
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // passport uses flash, so easiest to leave in there

var csrfProtection = csrf({cookie : true});  // must set this to true, otherwise it fails the upload

app.use(router);

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// disable response headers
app.disable('x-powered-by');

/*
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
*/

// load cors module
app.use(cors());

require ('./routes.js')(app, passport, csrfProtection);


app.use(multer({
  dest: './uploads/'
  , rename: function (fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase(); //+ Date.now()
  }
  , onError: function (error, next) {
    next(error)
  }
}).any());


// register all the partials
var recitem;
function createPartials(dir, group) {
  recursive(dir, function (err, files) {
    // Files is an array of filename
    files.forEach(function (item) {
      recitem = item;
      recitem = recitem.replace(/\\/g, "/");
      var name = recitem.substring(recitem.lastIndexOf("/") + 1, recitem.length);
      var template = fs.readFileSync(recitem, 'utf8');
      name = name.replace(".hbs", "");
      if (group.length>0){
        name = group + '.' + name;
      }
      hbs.registerPartial(name, template);
      //console.log(chalk.bold.green(name + ' partial registered!!!'));
    });
  });
}

createPartials('./views/marketing/partials', 'marketing');
createPartials('./views/customers/partials', 'customers');
createPartials('./views/admin/partials', 'admin');

// This is where all the handlebars helpers are registered
require('./hbs_helpers.js')(hbs);

const cfa = require('./assets/common_functions');



// this registers all our models so we don't have an issue with them not being found by mongoose
function registerAllModels(dir){
  recursive(dir, function (err, files) {
    files.forEach(function (model) {
      let modelName = "./" + model.replace(/\\/g, "/").replace(".js", "");
      let friendlyName = model.replace(/\\/g, "-").replace(".js", "");
      let target = {};
      target[friendlyName] = require(modelName);
      //console.log(chalk.bold.yellow("Model was registered: " + modelName));
    });
  });
}

// add new directories here if we need them
registerAllModels('./models');
registerAllModels('./admin/models');


/*
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  var error;
  console.log(chalk.bold.red("inside here err: " + JSON.stringify(err)));
  //res.send(err)
  //cfa.renderPage(req, res, err, "error","Error","Error");
    res.render('error', err)

  //next(createError(404));
});
*/

// error handler
app.use(function(err, req, res, next) {
  switch(req.headers.host) {
    case 'localhost:3000':throw err;
    case 'localhost:3001':  throw err;
    default:
      console.log("this is the app.use err: " + JSON.stringify(err));
      cfa.renderPage(req, res, err, "error","Error","Error");
  }

});

module.exports = app;

//app.listen('3000');
//console.log('working on 3000');