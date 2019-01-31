const async = require('async');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');
const definitions = require('./../definitions');

const aws = require('aws-sdk');
const creds = require('../credentials.js');
const fs = require('fs');
const path = require('path');

//TODO need to modify the common functions so that the members/providers/admins only have acces to certain features
//TODO we need to have the level determined by the user_id


module.exports = {

    renderPage : function(req, res, results, page, title, description) {
        let context = {
            layout:  'marketing/partials/layout'
            , title : title
            , description : description
            , page:{"title" : title
                , "description" : description
            }
            , results : results
        };
        if (results != null ) context.results = results;
        if (req.csrfToken() != null) context._csrf = req.csrfToken();

        if (req.user != null) {
            _.extend(context, userInfo(req.user));
            if (checkIfAdmin(definitions.adminRoles, req.user.role_id)) context.adminSection = true;
        }

        res.render(page, context)
    }

    , renderCustomersPage : function(req, res, results, page, title, description) {
        let context = {
            layout:  'customers/partials/customer_layout'
            , title : title
            , description : description
            , page:{"title" : title
                , "description" : description
            }
        };
        if (results != null ) context.results = results;
        if (req.csrfToken() != null) context._csrf = req.csrfToken();
        if (req.user != null) {
            _.extend(context, userInfo(req.user));
            if (checkIfAdmin(definitions.adminRoles, req.user.role_id)) context.adminSection = true;
        }

        res.render(page, context)
    }


    , renderBlankPage : function(req, res, results, page, title, description) {
        let context = {
            title : title
            , description : description
            , page:{"title" : title
                , "description" : description
            }
        };
        if (results != null ) context.results = results;
        if (req.csrfToken() != null) context._csrf = req.csrfToken();
        if (req.user != null) {
            _.extend(context, userInfo(req.user));
            if (checkIfAdmin(definitions.adminRoles, req.user.role_id)) context.adminSection = true;
        }

        res.render(page, context)
    }

    , renderAdminPage : function(req, res, results, page, title, description) {
        let context = {
            layout:  'admin/partials/admin_layout'
            , title : title
            , description : description
            , page:{"title" : title
                , "description" : description
            }
        };
        if (results != null ) context.results = results;
        if (req.csrfToken() != null) context._csrf = req.csrfToken();
        if (req.user != null) {
            _.extend(context, userInfo(req.user));
            if (checkIfAdmin(definitions.adminRoles, req.user.role_id)) context.adminSection = true;
        }

        res.render(page, context)
    }

    , renderErrorPage : function(req, res, err, page) {
        console.log(chalk.bold.red("this is the err: " + JSON.stringify(err)));
        let context = {
            layout:  'marketing/partials/layout'
            , title : "Error"
            , error : err.error
            , message : err.message
            , stack : err.stack
        };
        if (req.csrfToken() != null) context._csrf = req.csrfToken();
        if (req.user != null) {
            _.extend(context, userInfo(req.user));
            if (checkIfAdmin(definitions.adminRoles, req.user.role_id)) context.adminSection = true;
        }

        res.render('error', context);
    }

    , checkIfAdmin : function(req, res){
        return checkIfAdmin(req.user.role_id, definitions.adminRoles)
    }

    , uploadFile : function(fileName, uploadFileLocation, awsBucket, mimeType, callback){
        aws.config.update({
            accessKeyId: creds.aws.s3.reports.accessKeyId
            , secretAccessKey: creds.aws.s3.reports.secretAccessKey
            , region: creds.aws.s3.reports.region
        });
        let s3 = new aws.S3({
            computeChecksums: true
        });

        console.log("Start uploadFile");
        let fileBuffer = fs.readFileSync(uploadFileLocation);
        //let loc = creds.aws.s3.reports.bucketName   + '/img/' + entityId;

        try {
            s3.putObject({
                Bucket: awsBucket
                , Key: fileName
                , Body: fileBuffer
                , ContentType: mimeType
                , ACL : "public-read"
            }, function(err, res){
                if (err) {
                    console.log (chalk.bold.red("this is the S3 put error: " + err));
                    callback(err, null)
                    //return (err)
                } else {
                    console.log(fileName + " successfully uploaded!" + JSON.stringify(res));
                    //return({message: "success"});
                    callback(null, res);
                }
            });
        } catch (err){
            console.log(chalk.bold.red("s3 error: " +  err));
            callback(err, null)
        }
    }

};

function userInfo(user){
    let context = {};
    if (user.first_name || user.last_name) context.friendlyName = user.first_name + " " + user.last_name;
    context.email = user.email;
    context.loggedIn = true;
    //console.log(chalk.bold.magenta("this is the context(: " + JSON.stringify(context)));
    return context;
}

function checkIfAdmin(roles, user){
    //console.log(chalk.bold.green("user: " + JSON.stringify(user)));
    let check = false;
    user.forEach(function(role){
        if (roles.indexOf(role.toString()) !== -1) check = true;
    });
    return check;
}


