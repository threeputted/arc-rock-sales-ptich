const url = require('url');
const chalk = require('chalk');
const cfa = require('./assets/common_functions');
const definitions = require('./definitions');

const standardApi = require('./assets/standard_api');
const standardCrud = require('./assets/standard_crud');

const adminRoutes = require('./admin/controllers/admin_routes');
const customerRoutes = require('./customers/controllers/customer-routes');
const users_crud = require('./admin/controllers/users_crud');
const customers_crud = require('./admin/controllers/customers_crud');

const marketingGeneralRoutes = require('./marketing/controllers/marketing-routes');


module.exports = function (app, passport, csrfProtection) {

    //  create the redirect to secure
    switch(process.env.COMPUTERNAME) {
        case 'CRITERION-JCB':
            break;
        case 'DESKTOP-H7C65O4':
            break;
        case 'DESKTOP-C2SC9V8':
            break;
        case 'GIGIBIT131221':
            break;
        default:
            console.log("****** This is the default process.env.COMPUTERNAME: " + process.env.COMPUTERNAME +" *******");
            app.all('*', ensureSec);
    }

// ensure csrf protection is enabled
    app.all('*', csrfProtection);

// login to your account
    app.post('/login', function(req, res, next) {
        console.log(chalk.bold.yellow("user tried to login"));
        var urlParse = url.parse(req.headers['referer']);
        var redirectTo = (urlParse.path == '/login')? '/app/': req.headers['referer'];
        passport.authenticate('local-login', {
            successRedirect :   redirectTo // redirect to the secure profile section
            , failureRedirect : '/login' // redirect back to the signup page if there is an error
            , badRequestMessage : 'Missing username or password'
            , failureFlash : false // allow flash messages
        })(req, res, next);
    });

// logout of your account
    app.get('/logout', function(req, res) {
        console.log(chalk.red.bold("The user tried to logout"));
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });

// first-time landing page/signup
    // TODO need to get this fixed... it's legacy, but needs to be integrated
    //app.get('/first-time/:username/:email_token', mainRoutes.renderFirstTime);

// reset password
    app.get('/set-password/:email_token', users_crud.renderUpdatePassword);
    app.post('/set-password/:email_token', users_crud.postResetPassword);
    app.get('/reset-password', users_crud.renderPasswordResetRequest);
    app.get('/reset-password-response', users_crud.renderPasswordResetResponse);
    app.post('/reset-password', users_crud.sendPasswordReset);


// routing for the admin pages
    //TODO reinstate this here
    app.get('/admin/*',allowAdmin, adminRoutes.generalPage);
    //app.get('/admin/*', adminRoutes.generalPage);

// admin api
    //TODO need to secure this here
    //app.get('/api/admin/v1/:schema/:collection',allowAdmin, standardApi.adminApi);
    app.get('/api/admin/v1/:schema/:collection',allowAdmin, standardApi.adminApi);
    app.post('/admin/user-administration',allowAdmin, users_crud.adminCreateUpdateUser);
    app.post('/admin/customer-administration',allowAdmin, customers_crud.createUpdateCustomers);


// customer routes
    //TODO need to secure the customer routes here
    app.get('/app/*',allowCustomers, customerRoutes.generalPage);
    //app.get('/app/*', customerRoutes.generalPage);



// standard api
    //TODO need to secure this route
    app.get('/api/v1/:collection', allowCustomers, standardApi.queryTarget);
    //app.get('/api/v1/:collection', standardApi.queryTarget);

// General Collection Update
    //TODO secure all of these
    app.post('/updateCollection/:collection',allowAdmin, standardCrud.createUpdateCollection);
    app.post('/deleteItemFromCollection/:collection',allowAdmin, standardCrud.deleteItemFromCollection);
    app.post('/updateAdminCollection/:schema/:collection',allowAdmin, standardCrud.createUpdateCollection);

// general routes
    app.get('*', marketingGeneralRoutes.generalPage);

};



function ensureSec(req, res, next){
    //console.log("This is the ensureSec");
    //console.log(req.headers["x-forwarded-proto"]);
    if (req.headers["x-forwarded-proto"] === "https"){
        return next();
    } else {
        res.redirect("https://" + req.headers.host + req.url);
    }
}

function allowCustomers(req, res, next){
    let status = definitions.activeStatuses;
    let roles = definitions.customerRoles;

    if (!req.user){
        res.redirect('/')
    } else {
        if ( status.indexOf(req.user.status_id.toString()) === -1 && roles.indexOf(req.user.role_id.toString()) === -1){
            //console.log(chalk.bold.green("req.user.account_status.status " + status.indexOf(req.user.account_status.status.toString())))
            res.redirect('/account_inactive')
        } else if (!cfa.checkIfAdmin(req)){
            //console.log(chalk.bold.green("cfa.checkIfAdmin(req) " + cfa.checkIfAdmin(req)));
            res.redirect('/')
        } else {
            next();
        }
    }
}



function allowAdmin(req, res, next){
    let status = definitions.activeStatuses;
    let adminRoles = definitions.adminRoles;

    if (!req.user){
        res.redirect('/')
    } else {
        if ( status.indexOf(req.user.status_id.toString()) === -1 && adminRoles.indexOf(req.user.role_id.toString()) === -1){
            //console.log(chalk.bold.green("req.user.account_status.status " + status.indexOf(req.user.account_status.status.toString())))
            res.redirect('/account_inactive')
        } else if (!cfa.checkIfAdmin(req)){
            //console.log(chalk.bold.green("cfa.checkIfAdmin(req) " + cfa.checkIfAdmin(req)));
            res.redirect('/')
        } else {
            next();
        }
    }
}

