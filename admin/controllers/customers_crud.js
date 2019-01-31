const cfa = require('../../assets/common_functions');
const chalk = require('chalk');
const _ = require('lodash');
const async = require('async');
const ObjectId = require('mongoose').Types.ObjectId;

const customers = require('../models/admin_customers');


module.exports = {

    renderAdminCustomers : function(req, res, path){
        console.log(chalk.bold.green("start renderAdminCustomers"));

        // create new provider
        if (req.query.create === "true") {
            let results = {};
            if (req.query.debug === "true") results.debug = true;

            cfa.renderBlankPage(req, res, results, path.page, path.title, path.description);
        } else {
        // update existing provider/ render existing customers
            //TODO this needs to be fixed because this isn't working right now
            let query = {}; //{"qc.record_status" : {$nin : ["5ba1225859f9f74690a76112","5ba1225b59f9f74690a76113"]}};
            if (req.query.customer_id) query._id = req.query.customer_id;

            customers.find(query)
                .populate([
                    {path: "status_id", select : "status"},
                    {path: "role_id", select : "role"},
                    {path: "addresses.state_id", select : "state_name"},
                    {path: "addresses.country_id", select : "country_name"},
                ])
                .then((results)=>{
                    //console.log(chalk.bold.green("these are teh results: " + JSON.stringify(results)));
                    if (query._id != null) results._id = query._id;
                    if (_.size(query) > 0) results = results[0];
                    //console.log(chalk.bold.yellow("This is the req.query.provider_id: " + JSON.stringify(req.query.provider_id)));
                    if (req.query.debug === "true") results.debug = true;

                    if (req.query.provider_id){
                        cfa.renderBlankPage(req, res, results, path.page, path.title, path.description);
                    } else {
                        cfa.renderAdminPage(req, res, results, path.page, path.title, path.description);
                    }
                }).catch((err)=>{
                cfa.renderErrorPage(req, res, err, "error", "Error", "Error");
            })
        }
    }


    , createUpdateCustomers : function(req, res){
        console.log(chalk.bold.white("start createUpdateCollection"));

        const id = (req.body._id == null || req.body._id === "" || typeof req.body._id === 'undefined')? ObjectId() : req.body._id;
        const type = (req.body._id === "" || req.body._id == null || req.body._id === "null")?'created' : 'updated';

        console.log(chalk.bold.blue("This the req.body: " + JSON.stringify(req.body)));

        async.auto({
            getPreviousCollection : function(callback){
                (type === "updated")? customers.findById(id).exec(callback) : callback(null, null);
            }
            , createUpdate : ['getPreviousCollection', function(results, callback){
                if (req.body){
                    let context = {};
                    let b = {};
                    for (let prop in req.body){
                        //console.log(chalk.bold.yellow("prop: " + prop));
                        //console.log(chalk.bold.yellow("req.body[prop]: " + req.body[prop]));
                        if (req.body[prop] !== "") b[prop] = req.body[prop];
                    }
                    // Get the non-array-items:
                    context.name = b.name;
                    context.status_id = b.status_id;
                    context.notes = b.notes;

                    let addresses = [];
                    addresses.push({
                        address_desc : b.address_desc
                        , address_1 : b.address_1
                        , address_2 : b.address_2
                        , city : b.city
                        , state_id : b.state_id
                        , zip_code : b.zip_code
                        , country_id : b.country_id
                    });
                    if (addresses.length > 0) context.addresses = addresses;

                    //console.log(chalk.bold.green(JSON.stringify(req.body)));

/*
                    if (req.body.logoIds){
                        let images = JSON.parse(req.body.logoIds);
                        //console.log(chalk.bold.yellow("This is the images: " + JSON.stringify(images)));
                        if (Array.isArray(images)){
                            context.logo = {image_id : images[0]}
                        } else {
                            context.logo = {image_id : images}
                        }
                    }

                    if (req.body.defaultImage){
                        let defaultImage = JSON.parse(req.body.defaultImage);
                        //console.log(chalk.bold.yellow("This is the images: " + JSON.stringify(images)));
                        context.provider_image = {image_id : defaultImage}
                    }

                    if (req.body.files){
                        let files = JSON.parse(req.body.files);
                        //console.log(chalk.bold.yellow("This is the files: " + JSON.stringify(files)));
                        context.files = {file_ids : files}
                    }
*/

                    if (type === 'updated'){
                        //todo need to build in diffs here
                    } else {
                        context.record_status = req.body.status_id || "5c3b26f81c9d440000b1f28e";
                        context.creation_date = new Date();
                        //TODO need to put this back in when the customers are created
                        //context.user_id = req.user._id;
                    }

                    //console.log(chalk.bold.yellow("context: " + JSON.stringify(context)));
                    customers.findOneAndUpdate({_id : id}, context, {upsert : true}, callback)

                } else {
                    callback({err : "nothing in body"},null)
                }
            }]
        },function(err, results){
            if (err){
                console.log(chalk.bold.red("this is the err for the createUpdateCollection: " + err));
                res.json({status : "error", message : JSON.stringify(err)});
            } else {
                res.json({status : "OK", message : req.body.name + " was " + type + "!", id : id });
            }
        })
    }

};
