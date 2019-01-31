var moment = require('moment');

// need to use this for the date at the bottom
// add this into the footer pages to always have the most up to date, date {{yr}}

module.exports = function(hbs) {

    hbs.registerHelper({

        formatDate : function(date, fmt){
            if (typeof date !== 'undefined'){
                return moment(date).format(fmt)
            }
        }

        , addDaysFormat : function(date, days, fmt){
            if (typeof date !== 'undefined'){
                return moment(date).add('days', (days)? days: 1).format(fmt);
            }
        }

        , inc : function(value){
            return parseInt(value) + 1;
        }

        , parseText : function(txt, parseCond){
            if (typeof txt !== 'undefined'){
                var results = [];
                results = txt[0].split(parseCond);
                return results.filter(function(n){ return n !== ''}).join(", ");
            }
        }

        , parseJson : function(txt){
            if (typeof txt !== 'undefined'){
                return JSON.parse(txt);
            }
        }
        , stringifyJson : function(txt){
            if (typeof txt !== 'undefined'){
                return JSON.stringify(txt);
            } else {
                return '\'\'';
            }
        }

        , ifZero : function(value){
            if (typeof value !=='undefined' && value !== null){
                if (value != "0"){
                    function numberWithCommas(x) {
                        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    return numberWithCommas(value);
                } else {
                    return "0";
                }
            }
        }

        , truncate : function (str, len) {  //, len
            if (typeof str !== 'undefined'){
                if (str && str.length > len && str.length > 0) {
                    var new_str = str + " ";
                    new_str = str.substr (0, len);
                    new_str = str.substr (0, new_str.lastIndexOf(" "));
                    new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

                    return new hbs.SafeString ( new_str +'...' );
                }
                return str;
            }
        }

        , checkUndef : function(str){
            if (str !== "undefined"){
                return str;
            }
        }

        , preChecked : function(bool){
            if (bool == true) {
                return "checked";
            } else {
                return "";
            }
        }

        , radioChecked : function(item, bool){
            if (typeof bool !== 'undefined' && typeof item !== 'undefined'){
                if (bool == item){
                    return "checked"
                }
            }
        }

        , ifCond : function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }

        , checkNullItems : function( i1, i2, i3, i4, options){
            if (typeof i1 !== 'undefined' || typeof i2 !== 'undefined' || typeof i3 !== 'undefined' || typeof i4 !== 'undefined'){
                options.fn(this)
            } else {
                return options.inverse(this);
            }
        }

        , paginationActivePage : function(index,target){
            if(typeof index !== 'undefined' && typeof target !== 'undefined' ){
                return "active"
            }
        }

        , incDash: function(index){
            if (typeof index !== 'undefined' && Number.isInteger(index) ){
                try {
                    if (index > 0){
                        return "-";
                    }
                } catch (err){
                    //console.log("This is the incDash err: " + err)
                }
            } else {
                return "";
            }
        }

        , selectTrueFalse : function(bool){
            if (typeof bool !== 'undefined'){
                switch (bool){
                    case true :
                        return "selected";
                    case false:
                        return "selected";
                    default :
                        return "";
                }
            }
        }

        , selectTrueFalseNew : function(bool, item){
            if (typeof bool !== 'undefined' && typeof item !== 'undefined'){
                if (bool == item){
                    return "selected"
                }
            }
        }

        , numberWithCommas: function(x) {
            try{
                if (typeof x !== 'undefined' && x !== null){
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                    return x;
                }
            } catch(err){
                //console.log("this is the numberWithCommas err: " + err);
                return x;
            }
        }
        , replaceChars : function(str, rep){
            return str.split(" ").join(rep);
        }


    })
};

