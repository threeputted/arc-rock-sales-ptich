const cfa = require('../../assets/common_functions');
const chalk = require('chalk');

var options = [
    {slug : "/app/", page : "customers/main/customer-landing", title : "Your BlackLake Account", description : "", render: "customer"}
    , {slug : "/app/my-account/", page : "customers/settings/my-account", title : "My Account", description : "", render: "customer"}

    //testing//
    //, {slug : "/app/demo-landing/", page : "customers/testing/demo-landing", title : "Sample Template", description : "", render: "blank"}
];


var pages = {


    generalPage : function(req, res){
        const slug = req.url;
        let path = options.find( paths => paths.slug === slug);

        //console.log(chalk.bold.yellow("This is the slug: " + JSON.stringify(req.url)));
        //console.log(chalk.bold.yellow(JSON.stringify(path)));

        if (typeof path !== 'undefined'){
            switch (path.render){
                case "customer":
                    if (path.function != null){
                        eval(path.function + "(req, res, path)");
                    } else {
                        cfa.renderCustomersPage(req, res, null, path.page, path.title, path.description);
                    }
                    break;
                case "public":
                    cfa.renderPage(req, res, null,path.page, path.title, path.description);
                    break;
                case "blank":
                    cfa.renderBlankPage(req, res, null,path.page, path.title, path.description);
                    break;
                default:
                    cfa.renderErrorPage(req, res, '404 - Page Not Found', "marketing/error", "Error", "Error");
                    break;
            }
        } else {
            res.render(slug);
        }
    }


};



module.exports = pages;

