const async = require('async');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');


// create the queryString
function buildQuery(reqQuery){
    let context = {};
    let filters = {};
    let query= [{"QC.REVIEW_STATUS_ID" : {$nin : ['55afc1624f01462415e279c3','55afc1994f01462415e279c4','55afc1a04f01462415e279c5']}}];
    let sort = {};
    let limit = 500;
    let select = {};
    let skip, distinct, reQuery, reElement;
    let render;
    let dateItems, dateDate, dateProp;
    let dateArray = [];
    let eachDate ={};
    for (let element in reqQuery){
        switch (element){
            case "test": break;  //ignore the test flag
            case "_id":
                if (reqQuery._id !== ""){
                    let ids = reqQuery._id.split(",");
                    query.push({_id : {$in : ids}});
                }
                break;
            case "text":
                if (reqQuery[element] !==""){
                    query.push({$text : {$search : reqQuery[element].trim()}});
                }
                break;
            case "select":
                if (reqQuery[element] !==""){
                    console.log(chalk.bold.green("This is the reqQuery[element] " + JSON.stringify(reqQuery[element])));
                    let items = reqQuery[element].split(",");
                    items.forEach(function(i){
                        select[i] = 1;
                    });
                    filters.select = select;
                }
                break;
            case "date":
                dateArray = [];
                dateItems = [];
                dateItems = reqQuery[element].split(',');
                dateProp = dateItems[0];
                dateDate = new Date(dateItems[1]);

                let today = dateDate;
                let tomorrow = moment(today).add(1, 'day');
                eachDate[dateProp] = {$gte : today};
                dateArray.push(eachDate);
                eachDate[dateProp] = {$lt : tomorrow};
                dateArray.push(eachDate);
                query.push({$and : dateArray});
                break;
            case "startDate":
                // startDate=COMPLETION_DATE,1/1/2018
                eachDate = {};
                dateItems = reqQuery[element].split(',');
                eachDate[dateItems[0]] = {$gte : new Date(dateItems[1])};
                query.push(eachDate);
                break;
            case "endDate":
                // endDate=COMPLETION_DATE,7/1/2018
                eachDate = {};
                dateItems = reqQuery[element].split(',');
                eachDate[dateItems[0]] = {$lte : new Date(dateItems[1])};
                query.push(eachDate);
                break;
            case "limit":
                limit = Math.min(reqQuery[element], limit);
                console.log(chalk.bold.magenta("limit: " + limit));
                filters.limit = limit;
                break;
            case "skip":
                skip = reqQuery[element];
                filters.skip = skip;
                break;
            case "sort":
                if (reqQuery[element] !== ""){
                    sort[reqQuery[element]] = 1;
                }
                 filters.sort = sort;
                break;
            case "sortd":
                if (reqQuery[element] !== ""){
                    sort[reqQuery[element]] = -1;
                }
                filters.sort = sort;
                break;
            case "distinct":
                break;
            case "render":
                break;
            case "populate":
                // &populate=ENTITY_ID
                let populateElements = reqQuery[element].split(",");
                filters.populate = populateMappings(populateElements);
                break;
            default:
                if (reqQuery[element].indexOf('~') === 0){
                    console.log("This si hte regex: " + reqQuery[element]);
                    reQuery = reqQuery[element].substring(1);
                    reElement = element;
                    //console.log("This si the requery and element: " + reQuery + " - " + reElement);
                    break;
                } else {
                    if (reqQuery[element] !== ""){
                        let statuses = reqQuery[element].replace(/['"!]+/g, '').split(",");
                        let tempContent = {};
                        if (reqQuery[element].indexOf("!") == 0){
                            // PROJECT_STATUS_ID=!55b8fcd129522dc451b5688b
                            tempContent[element] = {$nin : statuses};
                        } else {
                            // PROJECT_STATUS_ID=55b8fcd129522dc451b5688b
                            tempContent[element] = {$in : statuses};
                        }
                        query.push(tempContent);
                    }
                    break;
                }
        }
    }

    if (!filters.limit) filters.limit = limit;
    if (!filters.sort) filters.sort = {};
    if (!filters.populate) filters.populate = [];
    if (!filters.select) filters.select = {"QC" : 0, "UPDATES" : 0, "__v" : 0};

    context.filters = filters;
    if (query != null && query.length > 0) {
        context.query = {$and : query};
    } else {
        context.query = {};
    }

    console.log(chalk.bold.green("This is the filters.sort: " + JSON.stringify(filters.sort)));
    //console.log(chalk.bold.green("This is the query: " + JSON.stringify(query)));
    //console.log(chalk.bold.yellow("This is the context: " + JSON.stringify(context)));
    //callback(null, context);
    return context;
}

module.exports = {

    queryTarget : function(req, res){
        //console.log(chalk.bold.green("start the queryTarget"));
        let collection = req.params.collection;
        let query = req.query;

        if (collection != null){
            let results = buildQuery(query);

            let queryString = results.query;
            let filters = results.filters;
            let target = require('../models/' + collection);

            target.find(queryString)
                .limit(filters.limit)
                .skip(filters.skip)
                .sort(filters.sort)
                .select(filters.select)
                .populate(filters.populate)
                .exec(function(err, targetResults){
                    res.json(targetResults)
                })
        } else {
            res.json({error : "No collection selected."})
        }
    }

    , adminApi : function(req, res){
        console.log(chalk.bold.green("start the adminApi"));
        let schema = req.params.schema;
        let collection = req.params.collection;
        let query = req.query;

        if (collection != null){
            let results = buildQuery(query);

            let queryString = results.query;
            let filters = results.filters;
            let target = require('../' + schema + '/models/' + collection);

            target.find(queryString)
                .limit(filters.limit)
                .skip(filters.skip)
                .sort(filters.sort)
                .select(filters.select)
                .populate(filters.populate)
                .exec(function(err, targetResults){
                    res.json(targetResults)
                })
        } else {
            res.json({error : "No collection selected."})
        }
    }

};




function populateMappings (items){
    var populateText;
    var elements = [];
    for (var i = 0; i < items.length; i++){
        switch (items[i]){
            case "status_id":
                elements.push({path: "status_id", select : "status"});
                break;
            case "role_id":
                elements.push({path: "role_id", select : "role"});
                break;
            default:
                break;
        }
    }
    //console.log("These are the elements: " + JSON.stringify(elements));
    return elements;
}
