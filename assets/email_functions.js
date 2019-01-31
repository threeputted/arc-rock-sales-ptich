var ObjectId = require('mongoose').Types.ObjectId;
var credentials = require('../credentials');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(credentials.mandrill.apiKey);
var request = require('request').defaults({ encoding: null });
var assert = require('assert');

var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var chalk = require('chalk');


module.exports = {

    sendEmail : function(options, callback){
        if (options.emails != null || options.to != null){
            console.log(chalk.bold.green("start sendEmail"));
            let mandrillMessage = {};

            let to = [];
            if (options.emails){
                options.emails.map(function (email) {
                    let context = {
                        "email": email.email
                        , "type": "to"
                        , user_id : email.user_id
                    };
                    if (email.first_name) context.name = email.first_name + " " + email.last_name;
                    to.push(context);
                });
            }

            if (options.to){
                to.push(options.to);
            }
            mandrillMessage.to = to;

/*
            let recipient_metadata = [];
            options.emails.map(function(m){
                recipient_metadata.push({
                    "rcpt" : m.email
                    , "values" : {
                        "name": m.name
                        , user_id : m.user_id
                        , reportId : options.reportId
                    }
                })
            });
            mandrillMessage.recipient_metadata = recipient_metadata;
*/
            //console.log("This si the recipent_metadata : " + JSON.stringify(recipient_metadata));

            for (let prop in options){
                if (["to","emails","recipient_metadata","sendHtml","sendTemplate", "template"].indexOf(prop) === -1){
                    mandrillMessage[prop] = options[prop];
                }
            }
            console.log(chalk.bold.white("This is the mandrillMessage: " + JSON.stringify(mandrillMessage)));

            if (options.sendTemplate === true){
                let mandrillTemplate = options.template;
                    mandrillTemplate.message = mandrillMessage;

                mandrill_client.messages.sendTemplate(mandrillTemplate, function (result) {
                    console.log(chalk.bold.blue("This is the sendTemplate result: " + JSON.stringify(result)));
                    callback(null, result);
                }, function (err) {
                    console.log('A mandrill error occurred: ' + err.name + ' - ' + err.message);
                    callback(err, null);
                });
            } else {
                mandrill_client.messages.send({message : mandrillMessage}, function (result) {
                    //console.log(chalk.bold.green("This is the mandrillClientResults: " + JSON.stringify(result)));
                    callback(null, result);
                }, function (err) {
                    console.log(chalk.bold.red('A mandrill error occurred: ' + err.name + ' - ' + err.message));
                    callback(err, null);
                });
            }
        } else {
            callback({error : "no emails selected"}, null);
        }
    }



};

function sampleMessage(options){
    return {
        message: {
            "subject": options.subject,
            "from_email": options.fromEmail,
            "from_name": options.fromName,
            "to": options.to,
            "headers": {
                    "Reply-To": options.fromEmail
            },
            "important": false,
            "track_opens": true,
            "track_clicks": true
            , "metadata" : {
                "reportId" : options.reportId
            }
            , "recipient_metadata": options.recipient_metadata
            , "tags" : options.tags
        }
    }
}