var LocalStrategy = require('passport-local').Strategy;
var bcrypt   = require('bcryptjs');

const admin_users = require('../models/admin_users');
const companies = require('../models/admin_customers');
const UserLogins = require('../models/logs_user_logins');

const cfa = require('../../assets/common_functions.js');
const crypto = require('crypto');
const async = require('async');
const chalk = require('chalk');


// generating a hash
function generateHash (password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
function validPassword (password, user_pw){
    return bcrypt.compareSync(password, user_pw);
}

// generate password token
function passwordToken (){
    crypto.randomBytes(20, function(err, buf) {
        var token =  buf.toString('hex');
        return token;
    });
}

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id, user.role_id, user.status_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        admin_users.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            console.log(chalk.red.magenta("The user has tried to login!!!!!!"));
            if (email) email = email.toLowerCase().trim(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            function logAttempt(isSuccess) {
                var loginAttempt = new UserLogins({
                    email : email
                    , login_successful : isSuccess
                    , remote_ip : req.headers['x-forwarded-for'] || req.connection.remoteAddress
                    , remote_agent : req.get('User-Agent')
                    , login_timestamp : new Date()
                });
                // fire and forget, it will keep working and not impede the load of the request
                loginAttempt.save(function(err) {
                    if (err) {
                        console.log('Failed to log the login attempt');
                    }
                });
            }

            // asynchronous
            process.nextTick(function() {
                //console.log("this should be the username: " + username);
                admin_users.findOne({ 'email' :  email})
                    .exec(function(err, user) {
                            //console.log('This is the user: ' + user);
                            var errorMessage = "No email/password combination was found.  Please try again or contact Criterion Customer Support";
                            if (err){
                                console.log('This is the first error section : ' + err);
                                logAttempt(false);
                                return done(err);
                            } else if (!user) {
                                console.log(chalk.red.bold('no user found'));
                                logAttempt(false);
                                return done(null, false, req.flash('message',{message : 'Sorry, we couldn\'t find that username/password combination.  Please try again or contact customer support.'}));
                            } else if (user.status_id.toString() !== '5c3b26f81c9d440000b1f28e') {
                                console.log("This is hte user.status_id: " + user.status_id);
                                console.log("This is an inactive user");
                                logAttempt(false);
                                //return done(null, false, req.flash(req.flash('message',{message : 'Sorry, your account is not active.  Please contact customer support to reactivate your account'})))
                                return done(null, false, req.flash('message',{message : 'Sorry, your account is not active.  Please contact customer support to reactivate your account'}))
                            } else if (!validPassword(password, user.password)) {
                                console.log('if !user.validPassword');
                                logAttempt(false);
                                var failedAttempts = user.login_failure_count;  //admin_users.findOne({_id : user._id}, 'USER_LOGIN_FAILURES', function(err,items){
                                var i = failedAttempts + 1;
                                console.log('This should be the login failures ' + i);
                                if(i < 5){
                                    console.log(chalk.green.bold(user._id));
                                    admin_users.findOneAndUpdate({_id : user._id}, {'login_failure_count' : i}, function(err){
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(chalk.red.bold('invalid login attempt recorded'));
                                            return done(null, false, req.flash('message',{message : 'Sorry, we couldn\'t find that username/password combination.  Please try again or contact customer support.'}));
                                        }
                                    });
                                } else {
                                    // lock account due to bad password attempts
                                    admin_users.findOneAndUpdate({_id : user._id}, {'account_status.status' : "5c3d0801a52d495f48eba935"}, function(err){
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(chalk.red.bold('User account was locked'));
                                            return done(null, false, req.flash('message',{message : 'Sorry, your account has been locked.  Please contact customer support for additional assistance.'}));
                                        }
                                    });
                                }
                            } else {
                                logAttempt(true);
                                admin_users.findOneAndUpdate({_id : user._id}, {'login_failure_count' : 0}, function(err){
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(chalk.green.bold("The user successfully logged in!"));
                                        return done(null, user);
                                    }
                                });
                            }
                        }
                    );
            });
        }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, username, password, done) {
            //console.log('starting username password function, username : '+ username + ' req.user : ' + req.user);
            // Use lower-case e-mails to avoid case-sensitive e-mail matching
            if (username) username = username.toLowerCase();

            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:
                   try {
                    async.waterfall([
                        function(done) {
                            crypto.randomBytes(20, function(err, buf) {
                                var token = buf.toString('hex');
                                done(err, token);
                            });
                        },
                        function (token, done){
                            admin_users.findOne({ 'USER_NAME' :  username }, function(err, user) {
                                // if there are any errors, return the error
                                if (err) return done(err);
                                // check to see if there is already a user with that username
                                if (user) {
                                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                                } else {
                                    console.log('Start the create new user');
                                    // create the user
                                    var newUser = new users({
                                        USER_NAME : req.body.USER_NAME.toLowerCase()
                                        , USER_PASSWORD : generateHash(password)
                                        , USER_STATUS_ID : req.body.NEW_USER_STATUS_ID
                                        , USER_STATUS_DESC : req.body.NEW_USER_STATUS_DESC
                                        , USER_EMAIL : req.body.NEW_USER_EMAIL
                                        , USER_FIRST_NAME : req.body.NEW_USER_FIRST_NAME
                                        , USER_LAST_NAME : req.body.NEW_USER_LAST_NAME
                                        , USER_PHONE : cf.emptyItems(req.body.NEW_USER_PHONE)
                                        , USER_MOBILE : cf.emptyItems(req.body.NEW_USER_MOBILE)
                                        , USER_ROLE_ID : req.body.NEW_USER_ROLE_ID
                                        , USER_ROLE_DESC : req.body.NEW_USER_ROLE_DESC
                                        , USER_ACCOUNT_LOCKED : false
                                        , USER_LOGIN_FAILURES : 0
                                        , CHANGE_PASSWORD_ON_NEXT_LOGIN : true
                                        , RESET_PASSWORD_TOKEN : token
                                        , RESET_PASSWORD_EXPIRES : Date.now() + (3600000 * 24 * 7 )  // 7 days
                                        , TRIAL_START_DATE : cf.emptyItems(req.body.NEW_TRIAL_START_DATE)
                                        , TRIAL_END_DATE : cf.emptyItems(req.body.NEW_TRIAL_END_DATE)
                                        , NOTES : cf.emptyItems(req.body.NEW_NOTES)
                                        , CUSTOMER_ID : cf.emptyItems(req.body.NEW_CUSTOMER_ID)
                                        , CUSTOMER_NAME : cf.emptyItems(req.body.NEW_CUSTOMER_NAME)
                                        , COVERAGE_ID : cf.emptyItems(req.body.NEW_COVERAGE_ID)
                                        , PORTFOLIO_ID : cf.emptyItems(req.body.NEW_PORTFOLIO_ID)
                                    });
                                    console.log(newUser);
                                    try {
                                        newUser.save(function(err) {
                                            console.log('reached after newUser.save');
                                            if (err) {
                                                console.log(err);
                                                return done(err);
                                            } else {
                                                //res.send('User Created Successfully');
                                                return done(null, newUser);
                                            }
                                        });
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }
                            });
                        },
                        function(token, user, done) {
                            var mailOptions = {
                                to: req.body.NEW_USER_EMAIL,
                                from: 'support@criterionrsch.com',
                                subject: 'Welcome to Criterion Research',
                                text: 'Thank you for signing up with Criterion Research.  To complete the sign up process you will need to set a password.\n\n' +
                                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                    'https://' + req.headers.host + '/reset/' + token.RESET_PASSWORD_TOKEN + '\n\n' +
                                    'If you did not request this, please ignore this email.\n'
                            };
                            cf.emailSupport(mailOptions, function(err) {
                                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                                done(err, 'done');
                                return done;
                            });
                        }
                    ], function(err) {
                        if (err) return next(err);
                        //res.redirect('/forgot');
                    });
                } catch (err) {
                    console.log(err);
                    return err;
                }
            });
        })
    );
};
