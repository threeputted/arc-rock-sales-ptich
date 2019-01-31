const cfa = require('../../assets/common_functions');
const chalk = require('chalk');

const users_crud = require('../../admin/controllers/users_crud');

var options = [
    {slug : "/", page : "static-site/index", title : "ARC Royalties", description : "", render:"blank"}
    , {slug : "/get-quote/", page : "marketing/other/get-quote", title : "Get a quote", description : "", render:"public"}

// Password related items
    , {slug : "/login", page : "marketing/logins/login", title : "Login To Your Account", description : "", render:"public"}
    , {slug : "/set-password/", page : "marketing/logins/set-password", title : "Set Your Password", description : "", function : "users_crud.renderUpdatePassword", render:"public"}
    , {slug : "/reset-password/", page : "marketing/logins/reset-password", title : "Reset Your Password", description : "", function : "users_crud.renderUpdatePassword", render:"public"}
    , {slug : "/reset-password-response/", page : "marketing/logins/reset-password-response", title : "Thank You", description : "", render:"public"}

    //, {slug : "/logout", page : "marketing/landing", title : "BlackLake Security", description : ""}
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

