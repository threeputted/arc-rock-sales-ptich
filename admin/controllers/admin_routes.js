const cfa = require('../../assets/common_functions');
const chalk = require('chalk');
const generalApi = require('../../assets/standard_api');

const users_crud = require('./users_crud');
const customers_crud = require('./customers_crud');


// handlebars testing
let fs = require('fs');
let path = require('path');
let hbs = require('hbs');

const options = [
    {slug : "/admin/", page : "admin/main/admin-landing", title : "Admin Landing Page", description : "", render : "admin"},

    // Update Customers
    {slug : "/admin/customer-administration/", page : "admin/users/customer-administration", title : "Customers", description : "", render : "admin", function : "customers_crud.renderAdminCustomers"},

    // Update users
    {slug : "/admin/user-administration/", page : "admin/users/user-administration", title : "Users", description : "", render : "admin", function : "users_crud.renderCreateUpdateUsersPage"},


];


const pages = {

    generalPage : function(req, res){
        const slug = (req.url.indexOf("?") > -1)? req.url.substring(0, req.url.indexOf("?")) : req.url;
        //console.log(chalk.bold.blue("This is the admin slug: " + slug));

        let path = options.find( paths => paths.slug === slug);
        if (path == null) options.find( paths => paths.slug === '/app/');

        console.log(chalk.bold.blue("This ish the path: " + path));
        if (typeof path !== 'undefined'){
            switch (path.render){
                case "admin":
                    if (path.function != null){
                        eval(path.function + "(req, res, path)");
                    } else {
                        cfa.renderAdminPage(req, res, null, path.page, path.title, path.description);
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

