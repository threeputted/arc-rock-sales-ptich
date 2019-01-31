const async = require('async');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
var diff = require('deep-diff').diff;


module.exports = {

    createUpdateCollection : function(req, res){
        // http://localhost:3000
        console.log(chalk.bold.white("start createUpdateCollection"));
        console.log(chalk.bold.yellow("This is the req.body: " + JSON.stringify(req.body)));
        console.log(chalk.bold.yellow("This is the req.params.schema: " + req.params.schema));

        const target = (req.params.schema != null)? require('../' + req.params.schema + '/models/' + req.params.collection + '.js') : require('../models/' + req.params.collection + '.js');
        const collection = req.params.collection;

        const id = (req.body._id == null || req.body._id === "" || typeof req.body._id === 'undefined')? ObjectId() : req.body._id;
        console.log(chalk.bold.magenta("This is the id: " + id));

        const type = (req.body._id === "" || req.body._id == null || req.body._id === "null")?'created' : 'updated';
        let temp = {};
        let qc = {};

        async.auto({
            ifUpdated : function(callback){
                if (type === 'updated' && req.query.qc === 'update'){
                    target.findOne({_id : id})
                        .exec(function(err, results){
                            results = results.toObject();
                            if (err) console.log(chalk.bold.red("this is the err: " + err));
                            delete results.UPDATES;
                            callback(err, results)
                        })
                } else {
                    callback(null, null)
                }
            }
            , getBody : ['ifUpdated', function(results, callback){
                // Cycle through everything else
                let props = [];
                let newProps = [];
                let temp = {};
                //console.log(chalk.bold.white("this is the: " + JSON.stringify(c)));
                for (let item in target.schema.paths){
                    if (['_id', '__v','QC.CREATION_DATE','QC.USER_ID','QC.RELEASE_DATE','QC.REVIEW_STATUS_ID', 'qc.record_status'
                            ,'UPDATES.UPDATE_DATE','UPDATES.USER_ID','UPDATES.PREVIOUS_CONTENT','UPDATES','marketing'
                            , 'photos', 'videos', 'files','qc','updates', 'record_status', 'qc.creation_date', 'qc.user_id', 'qc.record_status'
                        ].indexOf(item) === -1){
                        // TODO we need to adjust this for the type of prop so that we can compare objectids to the items.
                        // look in the alerts UPDATES to see how they are different
                        //console.log(chalk.bold.green(item) + " -- " + chalk.white.bold(JSON.stringify(target.schema.paths[item])));
                        let tempItem = {};
                        if ('caster' in target.schema.paths[item]){
                            tempItem = {
                                path : target.schema.paths[item].path
                                , instance : target.schema.paths[item].instance
                                , casterInstance : target.schema.paths[item].caster.instance
                            };
                        } else {
                            tempItem = {
                                path : target.schema.paths[item].path
                                , instance : target.schema.paths[item].instance
                            };
                        }
                        //console.log(chalk.bold.green("tempItem : "  + JSON.stringify(tempItem)));
                        newProps.push(tempItem);
                    }
                }
                //console.log(chalk.bold.white("This is the newProps: " + JSON.stringify(newProps)));

                if (req.body.files){
                    let files = JSON.parse(req.body.files);
                    console.log(chalk.bold.yellow("This is the files: " + JSON.stringify(files)));
                    if (Array.isArray(files)){
                        temp.files = files
                    } else {
                        temp.files = files
                    }
                }


                //for (let i = 0; i <= props.length; i++){
                for (let i = 0; i <= newProps.length; i++){
                    //console.log(chalk.bold.green("this is the newProps[i]: " + JSON.stringify(newProps[i])));
                    if (newProps[i]){
                        // We will need to manually update for anything that we send as a JSON, so it will be parsed correctly
                        if (['GEO_JSON'].indexOf(newProps[i].path) != -1 ){
                            // We have to parse the json here so that we can have it uploaded as a json object
                            temp[props[i].path] = (req.body[newProps[i].path])? JSON.parse(req.body[newProps[i].path]) : null
                        } else {
                            try {
                                switch (newProps[i].instance){
                                    case "ObjectID":
                                        temp[newProps[i].path] = (req.body[newProps[i].path])? ObjectId(req.body[newProps[i].path]) : null;
                                        break;
                                    case "Array":
                                        if ('casterInstance' in newProps[i]){
                                            switch (newProps[i].casterInstance){
                                                case "ObjectID":
                                                    let objArray = [];
                                                    if (req.body[newProps[i].path] && req.body[newProps[i].path] != ""){
                                                        let targetItems = (typeof req.body[newProps[i].path] !== 'object')? req.body[newProps[i].path].split(','):req.body[newProps[i].path];
                                                        targetItems.forEach(function(f){
                                                            if (ObjectId.isValid(f)){
                                                                //console.log(chalk.bold.white("req.body[newProps[i].path]: " + req.body[newProps[i].path]));
                                                                objArray.push(ObjectId(f))
                                                            } else {
                                                                objArray.push(f)
                                                            }
                                                        });
                                                        temp[newProps[i].path] = objArray;
                                                    }
                                                    break;
                                                default:
                                                    if (req.body[newProps[i].path]){
                                                        temp[newProps[i].path] = (req.body[newProps[i]].path)? req.body[newProps[i].path].split(",") : null;
                                                    }
                                                    break;
                                            }
                                        } else {
                                            temp[newProps[i].path] = (req.body[newProps[i].path])? req.body[newProps[i].path].split(",") : null;
                                        }
                                        break;
                                    default:
                                        temp[newProps[i].path] = (req.body[newProps[i].path])? req.body[newProps[i].path] : null;
                                        break;
                                }
                                //temp[props[i]] = (req.body[props[i]])? req.body[props[i]] : null
                            } catch (tempErr){
                                console.log(chalk.bold.red("This is the tempErr: " + newProps[i].path + " -- " + tempErr));
                            }
                        }
                    }
                }
                //console.log(chalk.white.bold("This is the temp: " + JSON.stringify(temp)));
                callback(null, temp)
            }]
            , findDifferences : ['getBody', function(results, callback){
                console.log(chalk.bold.green("this is the type: " + type));
                if (type !== 'created' ){
                    if (results.ifUpdated){
                        let previous  = results.ifUpdated;
                        if ('qc' in previous) delete previous.qc;
                        if ('updates' in  previous) delete previous.updates;
                        delete previous._id;
                        delete previous.__v;

                        let updates = results.getBody;

                        let differences = diff(previous, updates);
                        console.log(chalk.bold.green("These are the diffs: " + JSON.stringify(differences)));
                        callback(null, differences);
                    } else {
                        callback(null, null)
                    }
                } else {
                    callback(null, null)
                }
            }]
            , updateRecord : ['findDifferences', function(results, callback){
                console.log(chalk.bold.white("These are the results.findDifferences: " + JSON.stringify(results.findDifferences)));
                let temp = results.getBody;
                switch (type){
                    case "created":
                        qc = {
                            status_id : req.body.status_id
                            , creation_date : new Date()
                            //, user_id: req.user._id
                        };
                        temp["qc"] = qc;
                        break;
                    case "updated":
                        if (req.body.record_status || results.findDifferences){
                            qc = {
                                updates : {
                                    update_date : new Date()
                                    //, user_id : req.user._id
                                    , changes : results.findDifferences || null
                                }
                            };
                            temp["$push"] = qc;
                            //temp.qc.record_status = req.body.qc.record_status;

                            if (typeof req.body.record_status != 'undefined') temp["qc.record_status"] = req.body.record_status;
                        }
                        break;
                }
                if (_.size(temp) > 0){
                    console.log(chalk.bold.green("This is the temp for the findOneAndUpdate" + JSON.stringify(temp)));
                    //callback(null, null)
                    target.findOneAndUpdate({_id : id}, temp, {upsert : true}, function(err){
                        if (err){
                            callback(err, {message : "Failure on the update"})
                        } else {
                            callback(null, {message: "UpdateRecord was a success"})
                        }
                    });
                } else {
                    callback({status : "error", message : "There is nothing in the req.body"}, null)
                }
            }]
        }, function(err, results){
            if (err){
                console.log(chalk.bold.red("this is the err for the createUpdateCollection: " + err));
                res.json({status : "error", message : err});
            } else {
                res.json({status : "OK", message : collection + " was " + type + "!", _id : id});
            }
        });
    }

    , deleteItemFromCollection : function (req, res){
        console.log(chalk.bold.white("start deleteItemFromCollection"));
        console.log(chalk.bold.yellow("This is the req.body: " + JSON.stringify(req.body)));

        const target = (req.params.schema != null)? require('../' + req.params.schema + '/models/' + req.params.collection + '.js') : require('../models/' + req.params.collection + '.js');
        const collection = req.params.collection;


        const _id = (req.body._id == null || req.body._id === "" || typeof req.body._id === 'undefined')? ObjectId() : req.body._id;
        console.log(chalk.bold.magenta("This is the id: " + _id));

        if (_id){
            target.findOneAndDelete({_id : _id}, function(err){
                if (err){
                    console.log(chalk.bold.red("this is the err for the deleteItemFromCollection: " + err));
                    res.json({status : "error", message : err});
                } else {
                    res.json({status : "OK", message : _id + " was deleted from " + collection + "!"});
                }
            });
        } else {
            console.log(chalk.bold.red("this is the err for the deleteItemFromCollection: No Item to Delete"));
            res.json({status : "error", message : "No Item to Delete"});
        }

    }

};