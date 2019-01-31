const _ = require('lodash');
const chalk = require('chalk');
const ObjectId = require('mongoose').Types.ObjectId;
const async = require('async');
const moment = require('moment');

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
var passport = require('passport');
require('../../admin/controllers/passport')(passport);  // Config file for passport

const companies = require('../models/admin_customers');
const admin_users = require('../models/admin_users');

const emailFunctions = require('../../assets/email_functions');
const cfa = require('../../assets/common_functions');


module.exports = {

    renderCreateUpdateUsersPage : function (req, res, path) {
        console.log(chalk.bold.white("start renderCreateUpdateUsersPage "));
        // http://localhost:3000/admin/users/create-update-user
        let query = {}, type, populate = [];
        if (req.query.user_id){
            query = {_id : req.query.user_id};
            type = "updated";
            populate = [
                {path : "customer_id", select : "name"},
                {path: "status_id", select : "status"},
                {path: "role_id", select : "role"},
                //{path: "addresses.state_id", select : "state_name"},
                //{path: "addresses.country_id", select : "country_name"},
            ]
        }

        admin_users.find(query)
            .populate([
                {path : "customer_id", select : "name"},
                {path: "status_id", select : "status"},
                {path: "role_id", select : "role"},
                {path: "addresses.state_id", select : "state_name"},
                {path: "addresses.country_id", select : "country_name"},
            ])
            .then((results)=>{
                console.log(chalk.bold.green("these are teh results: " + JSON.stringify(results)));
                if (query._id != null) results._id = query._id;
                if (_.size(query) > 0) results = results[0];
                //console.log(chalk.bold.yellow("This is the req.query.provider_id: " + JSON.stringify(req.query.provider_id)));
                if (req.query.debug === "true") results.debug = true;
                cfa.renderAdminPage(req, res, results, path.page, path.title, path.description);
            }).catch((err)=>{
            cfa.renderErrorPage(req, res, err);
        });
  }

    , adminCreateUpdateUser : function(req, res){
        console.log("start adminCreateUpdateUser");

        if (req.body.email === "" || req.body.customer_id === "" || req.body.first_name === ""  || req.body.last_name === ""){
            console.log(chalk.bold.red("Error: please input customer, email, first name, or last name"));
            res.json({error : "error", message : "please input customer, email, first name, or last name"})
        } else {
            let _id, type, context = {};

            context.customer_id = req.body.customer_id;
            context.email = req.body.email;
            context.username = req.body.username || req.body.email;
            context.first_name = req.body.first_name;
            context.last_name = req.body.last_name;
            context.role_id = req.body.role_id || "5c3b273a1c9d440000b1f293";
            context.status_id = req.body.status_id || "5c3b26f81c9d440000b1f28e";

            let addresses = [];
            let tempAddress = {};

            addToObj(tempAddress,req.body.address_desc);
            addToObj(tempAddress,req.body.address_1);
            addToObj(tempAddress,req.body.address_2);
            addToObj(tempAddress,req.body.city);
            addToObj(tempAddress,req.body.state_id);
            addToObj(tempAddress,req.body.zip_code);
            addToObj(tempAddress,req.body.country_id);
            addresses.push(tempAddress);
            if (tempAddress !== {}) context.addresses = addresses;

            let phoneNums = {};
            addToObj(phoneNums,req.body.mobile);
            addToObj(phoneNums,req.body.office);
            addToObj(phoneNums,req.body.other);
            if (phoneNums !== {}) context.phone = phoneNums;

            if (!req.body._id || !req.body._id == null || !req.body._id === ""){
                _id = ObjectId();
                type = "created";
                context.creation_date = new Date();
                //TODO need to uncomment this
                //context.user_id = req.user._id;
                context.login_failure_count = 0;

            } else {
                _id = req.body._id;
                type = "updated";
            }

            let emailToken;
            if (type === "created" || req.body.resend_credentials === "true") {
                CreateToken((token) => {
                    emailToken = token;
                });
                context.email_token_ttl = moment(new Date()).add(7, 'days');
            }

            admin_users.findOneAndUpdate({_id : _id}, context, {upsert : true}).then((doc)=> {
                if (type === "created" || req.body.resend_credentials === "true"){
                    let options = {
                        from_email: "support@criterionrsch.com",
                        from_name: "Support",
                        subject : "Your BlackLake Security Credentials",
                        headers: {
                            "Reply-To": "support@criterionrsch.com"
                        },
                        important: false,
                        track_opens: true,
                        track_clicks: true
                    };
                    options.to = {
                        email: req.body.email
                        , type: "to"
                        , user_id : _id
                    };

                    let href;
                    if (req.headers.host === 'localhost:3000'){
                        href = 'http://localhost:3000/set-password/' + emailToken;
                    } else {
                        href = 'https://' + req.headers.host + '/set-password/'  + emailToken;
                    }

                    options.html = '<div>Welcome to BlackLake Security Customer Site</div><br>' +
                        '<div>Please click on this link to activate your account</div><br>' +
                        '<a href="' + href + '">Click to set up your password</a><br>';

                    emailFunctions.sendEmail(options, function(err, emailResult){
                        emailResult[0].sent_at = new Date();
                        admin_users.findOneAndUpdate({email : req.body.email}, {$push : {"email_response" : emailResult }}).exec();
                        admin_users.findOneAndUpdate({email : req.body.email}, {$set : {email_token : emailToken}}).exec();
                        //console.log(chalk.bold.yellow("This is the emailFunctions.sendEmail results: " + JSON.stringify(emailResult)));
                    });
                }
            }).then(()=> {
                res.json({status : "OK", message : req.body.first_name + " " + req.body.last_name + " was " + type + "!", id : _id });
/*
                admin_users.findOneAndUpdate({_id : _id}, {$set : {email_token : emailToken}}).then(()=>{
                });
*/
            } ).catch((err) => {
                if(err) console.log(chalk.bold.red("this is the err: " + JSON.stringify(err)));
                res.json({error: err, message : err})
            });
        }
    }

    , postManageUsers : function(req, res){
        console.log("start postManageUsers");
        // update the current user
        let _id, type, context = {};
        
        if (!req.body._id || req.body._id == null || req.body._id === ""){
            _id = ObjectId();
            type = "created";
        } else {
            _id = req.body._id;
            type = "updated";
        }

        for (let prop in req.body){
            let skippedItems = ["_id","_csrf"];
            //context[prop] = req.body[prop];
            if (req.body[prop] !== "") {
                context[prop] = req.body[prop];
            } else {
                context[prop] = null;
            }
        }

        console.log(chalk.bold.yellow("context: " + JSON.stringify(context)));
        console.log(chalk.blue.bold("req.user:" + JSON.stringify(req.user)));

        admin_users.findOneAndUpdate({_id : _id}, context, {upsert : true}) .then((doc) => {
            console.log(chalk.bold.green("doc " + JSON.stringify(doc)));
        }).then(() => {
            console.log();
        }).catch((err) => {
            if(err) console.log(chalk.bold.red("this is the err: " + JSON.stringify(err)));
            res.json({error: "User already exists", message : "The user name already exists"})
        });
        res.json({status : "OK", message : req.body.email + " was " + type})
    }

    , sendPasswordReset : function(req, res){
        console.log(chalk.bold.blue("start sendPasswordReset"));
        if (typeof req.body.email === 'undefined' || req.body.email === null ||  req.body.email == ""){
            res.redirect('/reset-password-response');
        } else {
            let email = req.body.email;
            let emailToken;
            let context = {};
            let path = {slug : "/reset-password-response", page : "marketing/logins/reset-password-response", title : "Password Reset Request", description : "", render : "marketing"};

            CreateToken((token) => {
                context.reset_password = {token : token};
                emailToken = token;
            });


            admin_users.findOne({email : email}).then((doc)=>{
                if (doc != null){
                    context.email_token_ttl = moment(new Date()).add(7, 'days');
                    context.email_token = emailToken;

                    admin_users.findOneAndUpdate({email : email}, context).then((doc)=>{
                        let url;
                        if (req.headers.host === 'localhost:3000'){
                            url = 'http://localhost:3000/set-password/' + emailToken;
                        } else {
                            url = 'https://' + req.headers.host + '/set-password/'  + emailToken;
                        }
                        url = '<a href="' + url + '" class="btn btn-primary">Reset Your Password</a>';
                        emailUser(doc, email, url, "Reset your BlackLake Password", function(err, results){
                        }).catch((err)=>{
                            console.log(chalk.bold.red("This ishte err: " + JSON.stringify(err)));
                            cfa.renderPage(req, res, err, path.page, path.title, path.description);
                        }).finally(()=>{
                            //admin_users.findOneAndUpdate({email : email}, {$set : {email_token : emailToken}}).exec();
                            res.redirect('/reset-password-response');
                        })
                    }).catch((err)=>{
                        console.log(chalk.bold.red("This ishte err: " + JSON.stringify(err)));
                        res.redirect('/reset-password-response');
                    }).finally(()=>{
                        res.redirect('/reset-password-response');
                    })
                } else {
                    console.log(chalk.bold.red("This ishte err: " + JSON.stringify(err)));
                    res.redirect('/reset-password-response');
                }
            })
        }
    }

    , renderPasswordResetRequest : function(req, res){
        let path = {slug : "/reset-password", page : "marketing/logins/reset-password", title : "Reset Your Password", description : ""};
        cfa.renderPage(req, res, null, path.page, path.title, path.description);
    }

    , renderPasswordResetResponse : function(req, res){
        let path = {slug : "/reset-password-response", page : "marketing/logins/reset-password-response", title : "Thank You", description : ""};
        cfa.renderPage(req, res, null, path.page, path.title, path.description);
    }


    , renderUpdatePassword : function(req, res){
        let path = {slug : "/set-password/", page : "marketing/logins/set-password", title : "Set Your Password", description : ""};
        console.log("start renderUpdatePassword");

        let token = req.params.email_token;
        console.log("This is hte token: " + req.params.email_token);

        admin_users.findOne({"email_token" : token}).then((results)=>{
            console.log(chalk.bold.green("these are teh results: " + JSON.stringify(results)));
            cfa.renderPage(req, res, results, path.page, path.title, path.description);
        }).catch((err)=>{
            res.json(err)
        });
    }

    , postResetPassword : function(req, res){
        console.log(chalk.bold.green("start resetPassword"));
        let token = req.params.email_token;
        //let path = {slug : "/", page : "marketing/logins/reset-password", title : "Reset Your Password", description : "Your source for information", render : "marketing"};
        if (token != null){
            //update User account
            let context = {
                password : generateHash(req.body.password)
                , login_failure_count : 0
            };
            admin_users.findOneAndUpdate({"email_token" : token}, context).then((doc)=>{
                //console.log(chalk.bold.yellow("this is the doc: " + JSON.stringify(doc)));
                passport.authenticate('local-login', {
                    badRequestMessage : 'Missing username or password'
                    , failureFlash : false // allow flash messages
                })(req, res, function(){
                    res.redirect('/app/');
                    //cfa.renderCustomersPage(req, res, doc, path.page, path.title, path.description)
                });
            }).catch((err)=>{
               console.log(chalk.bold.red(err));
               res.json(err)
            });
        } else {
            cfa.renderCustomersPage(req, res, null, path.page, path.title, path.description);
        }
    }

};



function CreateToken(callback){
    crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        callback(token);
    });
}


function emailUser(doc, email, url, subject, callback){
    let options = {
        from_email: "support@criterionrsch.com",
        from_name: "Support",
        subject : subject,
        headers: {
            "Reply-To": "support@criterionrsch.com"
        },
        important: false,
        track_opens: true,
        track_clicks: true
    };
    options.to = {
        email: doc.email
        , type: "to"
        , user_id : doc._id
    };


    options.sendTemplate = true;
    options.template ={
        template_name : "archidoodles-welcome"
        , template_content: [
            {
                "name": "url",
                "content": url
            }
        ]
        , "track_opens": true
        , "track_clicks": true
    };

    console.log(chalk.bold.magenta("These are the options: " + JSON.stringify(options)));

    emailFunctions.sendEmail(options, function(err, emailResult){
        emailResult[0].sent_at = new Date();
        admin_users.findOneAndUpdate({email : doc.email}, {$push : {"email_response" : emailResult }}).then((doc)=>{
            console.log(chalk.bold.yellow("This is the emailFunctions.sendEmail results: " + JSON.stringify(emailResult)));
            callback(null, emailResult)
        }).catch((err)=>{
            callback(err, null)
        });
    })
}


function generateHash (password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}


function addToObj(obj, item){
    var prop;
    for (prop in item) {
        if (item.hasOwnProperty(prop)) {
            if (item) obj[prop] = item;
        }
    }
}
