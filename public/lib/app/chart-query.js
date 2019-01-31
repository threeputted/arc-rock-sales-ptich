/** This handles the charts data **/

function yAxisUnits(baseUnit){
    switch (baseUnit){
        case  "Mmcf/d": return "Bcf/d";
        default : return baseUnit;
    }
}

function conversion(baseUnit, targetUnit){
    switch(baseUnit){
        case "Bcf/d":
            switch (targetUnit){
                case "Mmcf/d": return 1000;
                default: return 1;
            }
            break;
        case "Mmcf/d":
            switch (targetUnit){
                case "Bcf/d": return 1000;
                default: return 1;
            }
            break;
        default: return 1;
    }
}

function defaultOptions(title, subTitle, yAxisLegend, dataLabels){
    return {
        lineDefault: {
            chart: {
                type: 'line'
            }
            , lang: {
                decimalPoint: '.',
                thousandsSep: ','
            }
            , xAxis: {type: 'datetime'
                ,dateTimeLabelFormats: {
                    month: '%b %y'
                    ,year:'%Y'
                }
            }
            , plotOptions: {
                line: {
                    dataLabels: {
                        enabled: dataLabels
                        //, format : "{point.y:,.2f} " + yAxisLegend
                        //, format : "The point value at {point.name} is {point.y}"
                        , formatter: function (e) {
                            return this.point.name;
                        }
                    }
                    , enableMouseTracking: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: "(in " + yAxisUnits(yAxisLegend) + ")"
                },
                labels : {
                    formatter: function() {
                        //let result = Math.floor(this.value / conversion(yAxisLegend, yAxisUnits(yAxisLegend)));
                        let result = this.value;
                        //if (this.value > 1000) { result = Math.floor(this.value / 1000)}
                        return result.toFixed(2);
                    }
                }
            },
            tooltip : {
                pointFormat : "{point.y:,.0f} " + yAxisLegend
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://gelbercorp.com"
            },
            legend: {
                enabled: true
                , verticalAlign : "bottom"
            }
        }
        , columnDefault: {
            chart: {type: 'column'}
            , xAxis: {type: 'datetime'
                ,dateTimeLabelFormats: {
                    // don't display the dummy year
                    month: '%e. %b'
                    ,year:'%b'
                }
                , title: {text: 'Date'}
            }
            , plotOptions: {
                column: {
                    pointPadding: 1,
                    borderWidth: 1,
                    groupPadding: 1,
                    shadow: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: yAxisLegend
                }
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://www.gelbercorp.com/"
            }

        }
        , columnCategories: {
            chart: {type: 'column'}
            , xAxis: {
                type: 'category'
                , labels : {
                    autoRotation : [-90]
                }
            }
            , plotOptions: {
                column: {
                    pointPadding: 1,
                    borderWidth: 1,
                    groupPadding: 1,
                    shadow: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: yAxisLegend
                }
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://www.gelbercorp.com/"
            }

        }
        , areaDefault: {
            chart: {type: 'area'}
            , xAxis: {
                type: 'datetime'
                , autoRotation : 90
            },
            yAxis: {
                visible: true
                , title : {
                    text: yAxisLegend
                },
                labels : {
                    formatter: function() {
                        result = this.value;
                        if (this.value > 1000) { result = Math.floor(this.value / 1000)}
                        return result.toFixed(1);
                    }
                }
            },
            tooltip:{
                enabled: true
                , valueSuffix: " MMcf/d"
                /*
                 , formatter: function() {
                 result = this.y;
                 if (this.y > 1000) { result = Math.floor(this.y / 1000)}
                 return result.toFixed(1) + " " + data.units;
                 }
                 , dateTimeLabelFormats : {
                 month:"%B %Y"
                 }
                 , headerFormat : 'New Capacity - '
                 */
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,legend: {
                enabled: false
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://gelbercorp.com"
            }

        }
        , zoomTypeX: {
            chart: {
                zoomType: 'x'
            }
            , xAxis: {type: 'datetime'
                ,dateTimeLabelFormats: {
                    month: '%b %y'
                    ,year:'%Y'
                }
            }
            , plotOptions: {
                line: {
                    dataLabels: {
                        enabled: dataLabels
                        //, format : "{point.y:,.2f} " + yAxisLegend
                        //, format : "The point value at {point.name} is {point.y}"
                        , formatter: function (e) {
                            return this.point.name;
                        }
                    }
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: "(in " + yAxisUnits(yAxisLegend) + ")"
                },
                labels : {
                    formatter: function() {
                        //let result = Math.floor(this.value / conversion(yAxisLegend, yAxisUnits(yAxisLegend)));
                        let result = this.value;
                        //if (this.value > 1000) { result = Math.floor(this.value / 1000)}
                        return result.toFixed(2);
                    }
                }
            },
            tooltip : {
                pointFormat : "{point.y:,.2f} " + yAxisLegend
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://gelbercorp.com"
            },
            legend: {
                enabled: true
                , verticalAlign : "bottom"
            }
        }
    }
}


function defaultOptions(title, subTitle, yAxisLegend, dataLabels){
    return {
        lineDefault: {
            chart: {type: 'line'}
            , xAxis: {type: 'datetime'
                ,dateTimeLabelFormats: {
                    month: '%b %y'
                    ,year:'%Y'
                }
            }
            , plotOptions: {
                line: {
                    dataLabels: {
                        enabled: dataLabels
                        //, format : "{point.y:,.2f} " + yAxisLegend
                        //, format : "The point value at {point.name} is {point.y}"
                        , formatter: function (e) {
                            return this.point.name;
                        }
                    }
                    , enableMouseTracking: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: "(in " + yAxisUnits(yAxisLegend) + ")"
                },
                labels : {
                    formatter: function() {
                        //let result = Math.floor(this.value / conversion(yAxisLegend, yAxisUnits(yAxisLegend)));
                        let result = this.value;
                        //if (this.value > 1000) { result = Math.floor(this.value / 1000)}
                        return result.toFixed(2);
                    }
                }
            },
            tooltip : {
                pointFormat : "{point.y:,.2f} " + yAxisLegend
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://gelbercorp.com"
            },
            legend: {
                enabled: true
                , verticalAlign : "bottom"
            }
        }
        , columnDefault: {
            chart: {type: 'column'}
            , xAxis: {type: 'datetime'
                ,dateTimeLabelFormats: {
                    // don't display the dummy year
                    month: '%e. %b'
                    ,year:'%b'
                }
                , title: {text: 'Date'}
            }
            , plotOptions: {
                column: {
                    pointPadding: 1,
                    borderWidth: 1,
                    groupPadding: 1,
                    shadow: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: yAxisLegend
                }
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://www.gelbercorp.com/"
            }

        }
        , columnCategories: {
            chart: {type: 'column'}
            , xAxis: {
                type: 'category'
                , labels : {
                    autoRotation : [-90]
                }
            }
            , plotOptions: {
                column: {
                    pointPadding: 1,
                    borderWidth: 1,
                    groupPadding: 1,
                    shadow: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: yAxisLegend
                }
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://www.gelbercorp.com/"
            }

        }
        , areaDefault: {
            chart: {type: 'area'}
            , xAxis: {
                type: 'datetime'
                , autoRotation : 90
            },
            yAxis: {
                visible: true
                , title : {
                    text: yAxisLegend
                },
                labels : {
                    formatter: function() {
                        result = this.value;
                        if (this.value > 1000) { result = Math.floor(this.value / 1000)}
                        return result.toFixed(1);
                    }
                }
            },
            tooltip:{
                enabled: true
                , valueSuffix: " MMcf/d"
                /*
                 , formatter: function() {
                 result = this.y;
                 if (this.y > 1000) { result = Math.floor(this.y / 1000)}
                 return result.toFixed(1) + " " + data.units;
                 }
                 , dateTimeLabelFormats : {
                 month:"%B %Y"
                 }
                 , headerFormat : 'New Capacity - '
                 */
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,legend: {
                enabled: false
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://gelbercorp.com"
            }

        }
    }
}



function companyChartOptions(title, subTitle, yAxisLegend){
    return {
        lineDefault: {
            chart: {type: 'line'}
            , xAxis: {type: 'datetime'
                ,dateTimeLabelFormats: {
                    month: '%b %y'
                    ,year:'%Y'
                }
            }
            , plotOptions: {
                line: {
                    dataLabels: {enabled: false}
                    , enableMouseTracking: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
                , style : {"font-size": "16px"}
            }
            ,
            yAxis: {
                title: {
                    text: "(in " + yAxisLegend + ")"
                },
                labels : {
                    formatter: function() {
                        result = Math.floor(this.value);
                        return result.toFixed(1);
                    }
                }
            },
            tooltip : {
                pointFormat : "{point.y:,.0f} " + yAxisLegend
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://www.gelbercorp.com/"
            },
            legend: {
                enabled: true
                , verticalAlign : "bottom"
            }
        }
        , columnDefault: {
            chart: {type: 'column'}
            , xAxis: {type: 'datetime'
                ,dateTimeLabelFormats: {
                    // don't display the dummy year
                    month: '%e. %b'
                    ,year:'%b'
                }
                , title: {text: 'Date'}
            }
            , plotOptions: {
                column: {
                    pointPadding: 1,
                    borderWidth: 1,
                    groupPadding: 1,
                    shadow: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: yAxisLegend
                }
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://www.gelbercorp.com/"
            }

        }
        , columnCategories: {
            chart: {type: 'column'}
            , xAxis: {
                type: 'category'
                , labels : {
                    autoRotation : [-90]
                }
            }
            , plotOptions: {
                column: {
                    pointPadding: 1,
                    borderWidth: 1,
                    groupPadding: 1,
                    shadow: true
                }
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,
            yAxis: {
                title: {
                    text: yAxisLegend
                }
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://www.gelbercorp.com/"
            }

        }
        , areaDefault: {
            chart: {type: 'area'}
            , xAxis: {
                type: 'datetime'
                , autoRotation : 90
            },
            yAxis: {
                visible: true
                , title : {
                    text: yAxisLegend
                },
                labels : {
                    formatter: function() {
                        result = this.value;
                        if (this.value > 1000) { result = Math.floor(this.value / 1000)}
                        return result.toFixed(1);
                    }
                }
            },
            tooltip:{
                enabled: true
                , valueSuffix: " MMcf/d"
                /*
                 , formatter: function() {
                 result = this.y;
                 if (this.y > 1000) { result = Math.floor(this.y / 1000)}
                 return result.toFixed(1) + " " + data.units;
                 }
                 , dateTimeLabelFormats : {
                 month:"%B %Y"
                 }
                 , headerFormat : 'New Capacity - '
                 */
            }
            , title: {
                text: title
            }
            ,
            subtitle: {
                text: subTitle
            }
            ,legend: {
                enabled: false
            },
            credits : {
                text : "Source: Gelber & Associates"
                , position: {
                    align : 'left'
                    , verticalAlign: 'bottom'
                    , x: 10
                    , y: -5
                }
                , href: "https://www.gelbercorp.com/"
            }

        }
    }
}

function BasicChartUrl(url, loc, title, subTitle, chartType, options, done){
    $.getJSON(url, function (data) {
        let results = [];
        let units;
        data.forEach((dat) => {
            let seriesData = [];
            dat.data.forEach((d) => {
                let testDate = d.date.split("/");
                let testNumber =  changeNumbers(parseFloat(d.value), options);
                seriesData.push([Date.UTC(testDate[2],testDate[0]-1, testDate[1]), testNumber]);
            });

            let context = {};
            let name = [dat.metadata_desc, dat.series_desc, dat.region_name, dat.state_name];
            context.name = createName(name);
            context.data = seriesData;
            if (dat.period_desc) context.period = dat.period_desc;
            units = (dat.unit_desc)? context.units = dat.unit_desc : "";

            results.push(context);
        });

        let chartOptions = defaultOptions(title, subTitle, units)[chartType];
        chartOptions.title = {text: title};
        chartOptions.subTitle = {text: subTitle};
        chartOptions.series = results;

        $(loc).highcharts(chartOptions);

        if (options.stopSpinner = true){
            $(".spinner").remove();
        }

    });
}

function changeNumbers(data, options){
    if (options){
        if (options.abs != null) data = Math.abs(data);
        if (options.mathFunction != null) data  = eval( data +  options.mathFunction);
        return data;
    } else {
        return data;
    }
}


function createName(options){
    let title = "";
    for (var i = 0; i < options.length; i++){
        if (options[i] != null){
            if (i > 0) title += " - ";
            title += options[i]
        }
    }
    return title.trim();
}


function HighChartSingleSeries(uuid, loc, title, subTitle, chartType, forecastDate){
    //console.log(mainReports.naturalGas);
    var query = "";
    if (forecastDate != null){
        query = '/api/v2/consol/data_series.financial_json?metadata_uuid=' + uuid + '&forecast_date=' + forecastDate +'&max_version'
    } else {
        query = '/api/v2/consol/data_series.financial_json?metadata_uuid=' + uuid + '&max_version'
    }
    //alert("This should be the query: " + query);
    $.getJSON(query, function (data) {

        var results = [];
        var seriesData = [];

        $.each(data, function (key, val) {
            var series = [];
            $.each(val.data, function (key1, val1) {
                var testDate = val1.date.split("/");
                seriesData.push([Date.UTC(testDate[2],testDate[0]-1, testDate[1]), parseFloat(val1.value)]);
            });
            results.push({title: val.metadata_desc, period: val.period_desc, units: val.unit_desc, data: seriesData});
        });
        //alert("This should be the results[0]: " + JSON.stringify(results[0]));

        //TODO Need to handle multiple data sets here.  THis is defaulting to a single one and needs to be updated.
        var options = defaultOptions(title, subTitle, results[0].units);

        switch (chartType){
            case "lineDefault":
                options = options.lineDefault;
                break;
            case "columnDefault":
                options = options.columnDefault;
                break;
            case "areaDefault":
                options = options.areaDefault;
                break;
        }

        // TODO: This meeds to be created at the $.each level for each data series
        options.series = [{
            name: results[0].title,
            data: results[0].data
        }] ;

        //alert("this should be the options: " + JSON.stringify(options));
        $(loc).highcharts(options);
    });
}

function HighChartMaxForecastDate(uuid, periodId, loc, title, subTitle, chartType){
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    //console.log(mainReports.naturalGas);
    var query = "";
    if (periodId != ''){
        query = "/api/v2/consol/data_series.data_max_forecast_version_period('" + uuid + "','" + periodId + "')";
        //alert("This should be the query: " + query);
    } else {
        query = "../api/v2/consol/data_series.data_max_forecast_version('" + uuid + "')";

    }

    $.getJSON(query, function (data) {

        var results = [];
        var seriesData = [];

        $.each(data, function (key, val) {
            var series = [];
            $.each(val.data, function (key1, val1) {
                var testDate = val1.date.split("/");
                seriesData.push([Date.UTC(testDate[2],testDate[0]-1, testDate[1]), parseFloat(val1.value)]);
            });
            results.push({title: val.metadata_desc, period: val.period_desc, units: val.unit_desc, data: seriesData});
        });
        //alert("This should be the results[0]: " + JSON.stringify(results[0]));

        //TODO Need to handle multiple data sets here.  THis is defaulting to a single one and needs to be updated.
        var options = defaultOptions(title, subTitle, results[0].units);

        switch (chartType){
            case "lineDefault":
                options = options.lineDefault;
                break;
            case "columnDefault":
                options = options.columnDefault;
                break;
            case "areaDefault":
                options = options.areaDefault;
                break;
        }

        // TODO: This meeds to be created at the $.each level for each data series
        options.series = [{
            name: results[0].title,
            data: results[0].data
        }] ;

        //alert("this should be the options: " + JSON.stringify(options));
        $(loc).highcharts(options);
    });
}

function HighChartMaxPostDateMaxVersion(uuid, loc, title, subTitle, chartType, minDate){
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
            , downloadCSV: 'Download CSV'
            , downloadJPEG: 'Download JPEG Image'
            , downloadXLS: 'Download XLS'
        }
    });
    var query = "/api/v2/maxPostDateMaxVersion?metadata_uuid=" + uuid ;
    var startDate = (typeof minDate !== 'undefined' && minDate != null && minDate != "")? minDate : Date.UTC(1970,0,1);

    $.getJSON(query, function (data) {
        var baseUnits = data[0].unit_desc;
        var results = [];
        var seriesData = [];
        $.each(data, function (key, val) {
            var series = [];
            var targetUnits = val.unit_desc;
            $.each(val.data, function (key1, val1) {
                var testDate = val1.date.split("/");
                testDate = Date.UTC(testDate[2],testDate[0]-1, testDate[1]);
                var testVal = parseFloat(val1.value) * conversion(baseUnits, targetUnits);
                if (testDate >= minDate){
                    seriesData.push([testDate, testVal]);
                }
            });
            seriesData.sort(function(a,b) {
                return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);
            });
            results.push({title: val.metadata_desc, period: val.period_desc, units: val.unit_desc, data: seriesData});
        });
        //console.log("This should be the results[0]: " + JSON.stringify(results[0]));

        var options = defaultOptions(title, subTitle, results[0].units);
        options = options[chartType];
        //console.log("This is the data: " + JSON.stringify(results[0].data));

        options.series = [{
            name: results[0].title,
            data: results[0].data
        }] ;

        options.exporting = {
            csv: {
                dateFormat: '%m/%d/%Y'
            }
            , xls : {
                dateFormat: '%m/%d/%Y'
            }
        };

        $(loc).highcharts(options);
    });
}


function SingleJsonQuery(url, table, target, id, loc, title, subTitle, chartType, minDate){
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    var query = url + "?table=" + table + "&" + target + "=" + "&id=" + id;
    var startDate = (typeof minDate !== 'undefined' && minDate != null && minDate != "")? minDate : Date.UTC(1970,0,1);

    $.getJSON(query, function (data) {
        //var baseUnits = data[0].unit_desc;
        var results = [];
        var seriesData = [];
        $.each(data, function (key, val) {
            var series = [];
            var targetUnits = val.unit_desc;
            $.each(val.data, function (err, val1) {
                if (err) console.log("this is the SingleJsonQuery err: " + err);
                //var testDate = val1.date.split("/");
                var testDate = new Date(val1.date);
                //testDate = Date.UTC(testDate[2],testDate[0]-1, testDate[1]);
                //var testVal = parseFloat(val1.value) * conversion(baseUnits, targetUnits);
                var testVal = val1.value;
                if (testDate >= minDate){
                    seriesData.push([testDate, testVal]);
                }

            });
            seriesData.sort(function(a,b) {
                return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);
            });
            results.push({title: val.metadata_desc, period: val.period_desc, units: val.unit_desc, data: seriesData});
        });
        console.log("This should be the results[0]: " + JSON.stringify(results[0]));

        var options = defaultOptions(title, subTitle, results[0].units);
        options = options[chartType];
        //console.log("This is the data: " + JSON.stringify(results[0].data));

        options.series = [{
            name: results[0].title,
            data: results[0].data
        }] ;

        console.log("This is optoins: " + JSON.stringify(options));
        $(loc).highcharts(options);
    });
}




function HighChartMaxPostDateMaxVersionMulti(uuid, loc, title, subTitle, chartType, minDate){
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    var query = "/api/v2/maxPostDateMaxVersionMulti?metadata_uuid=" + uuid ;
    var startDate = (typeof minDate !== 'undefined' && minDate != null && minDate != "")? minDate : Date.UTC(1970,0,1);

    $.getJSON(query, function (data) {
        var options = defaultOptions(title, subTitle, data[0].unit_desc);
        options = options[chartType];
        var baseUnits = data[0].unit_desc;

        var results = [];
        $.each(data, function (key, val) {
            var seriesData = [];
            var targetUnits = val.unit_desc;
            $.each(val.data, function (key1, val1) {
                var testDate = val1.date.split("/");
                testDate = Date.UTC(testDate[2],testDate[0]-1, 1);
                var testVal = parseFloat(val1.value) * conversion(baseUnits, targetUnits);
                if (testDate >= minDate){
                    seriesData.push([testDate, testVal]);
                }
            });
            seriesData.sort(function(a,b) {
                return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);
            });
            results.push({title: val.metadata_desc, period: val.period_desc, units: val.unit_desc, data: seriesData});
        });

        var series = [];
        for (var i = 0; i < results.length; i++){
            series.push({
                name: results[i].title,
                data: results[i].data
            })
        }
        //console.log("This is the series: " + JSON.stringify(series));
        options.series = series ;

        $(loc).highcharts(options);
    });
}

function HighChartsPgGeneral(query, targetColumn, loc, title, subTitle, chartType, minDate){
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    $.getJSON(query, function (data) {
        var newResults = [];
        var options;
        if (data.getPgResults.length > 0) {
            data = data.getPgResults;
            options = companyChartOptions(title, subTitle, data[0].unit);
            options = options[chartType];
            var targets =[];
            data.forEach(function(r){
                if (targets.indexOf(r[targetColumn]) == -1){
                    targets.push(r[targetColumn]);
                    newResults.push({name : r[targetColumn], data : []});
                }
            });

            data.forEach(function(d){
                targets.forEach(function(t){
                    if (d[targetColumn] == t){
                        var item = $.grep(newResults, function(e){ return e.name == t; });
                        item[0].data.push(
                            [new Date(d.date).getTime(), d.value]
                        );
                    }
                });
            });

            newResults.forEach(function(o) {                        // for each object o in the array
                var hash = {};                                      // the hash object, to store the indexes of times in the new array
                o.data = o.data.reduce(function(newArr, e) {        // reduce the data array of the object o
                    var index = hash[e[0]];                         // get the index from the hash object of this time (e[0])
                    if(index == undefined) {                        // if index is undefined (this time is not hashed yet), then add e to the array and hash its index so it'll be used for duplicates
                        hash[e[0]] = newArr.push(e) - 1;            // push returns the new length so the index is the length - 1
                    } else {                                        // otherwise (the time is already hashed)
                        newArr[index][1] += e[1];                   // then add the value of this element (e[1]) to the value of the already hashed element at index index
                    }
                    return newArr;
                }, []);
            });
            console.log("These are the newResults: " + JSON.stringify(newResults));
            options.series = newResults ;
            $(loc).highcharts(options);
        } else {
            $(loc).html('<div style="text-align:center;padding: 50px; color: red; font-weight: 400;">Sorry, there are no results to display.</div>')
        }
    });
}


function HighChartsPgFlexible(query, targetColumn, dateColumn, valueColumn, loc, title, subTitle, chartType, minDate){
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    $.getJSON(query, function (data) {
        var newResults = [];
        var options = {};
        if (data.getPgResults.length > 0) {
            data = data.getPgResults;
            //options = companyChartOptions(title, subTitle, '');  //data[0].unit
            //options = options[chartType];
            var targets =[];
            data.forEach(function(r){
                if (targets.indexOf(r[targetColumn]) == -1){
                    targets.push(r[targetColumn]);
                    newResults.push({name : r[targetColumn], data : []});
                }
            });
            data.forEach(function(d){
                targets.forEach(function(t){
                    if (d[targetColumn] == t){
                        var item = $.grep(newResults, function(e){ return e.name == t; });
                        item[0].data.push(
                            [new Date(d[dateColumn]).getTime(), d[valueColumn]]
                        );
                    }
                });
            });

            newResults.forEach(function(o) {                        // for each object o in the array
                var hash = {};                                      // the hash object, to store the indexes of times in the new array
                o.data = o.data.reduce(function(newArr, e) {        // reduce the data array of the object o
                    var index = hash[e[0]];                         // get the index from the hash object of this time (e[0])
                    if(index == undefined) {                        // if index is undefined (this time is not hashed yet), then add e to the array and hash its index so it'll be used for duplicates
                        hash[e[0]] = newArr.push(e) - 1;            // push returns the new length so the index is the length - 1
                    } else {                                        // otherwise (the time is already hashed)
                        newArr[index][1] += e[1];                   // then add the value of this element (e[1]) to the value of the already hashed element at index index
                    }
                    return newArr;
                }, []);
            });
            //console.log("These are the newResults: " + JSON.stringify(newResults));
            options.series = newResults;
            //console.log("This is the options: " + JSON.stringify(options));
            $(loc).highcharts(options);
        } else {
            $(loc).html('<div style="text-align:center;padding: 50px; color: red; font-weight: 400;">Sorry, there are no results to display.</div>')
        }
    });
}



function HighChartMaxPostDateMaxVersionKeyValue(uuid, loc, title, subTitle, chartType){
    //console.log(mainReports.naturalGas);
    var query = "/api/v2/maxPostDateMaxVersion?metadata_uuid=" + uuid ;
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    $.getJSON(query, function (data) {
        var results = [];
        var seriesData = [];
        $.each(data, function (key, val) {
            var series = [];
            $.each(val.data, function (key1, val1) {
                //console.log("This is the val1: " + JSON.stringify(val1));
                seriesData.push([val1.key || val1.date, parseFloat(val1.value)]);
            });
            seriesData.sort(function(a,b) {
                return (a[1] < b[1]) ? 1 : ((b[1] < a[1]) ? -1 : 0);
            });

            results.push({title: val.metadata_desc, date: val.post_date, period: val.period_desc, units: val.unit_desc, data: seriesData});
        });
        //console.log("These are the results: " + JSON.stringify(results));

        var options = defaultOptions(title, subTitle, results[0].units);
        switch (chartType){
            case "lineDefault":
                options = options.lineDefault;
                break;
            case "columnDefault":
                options = options.columnDefault;
                break;
            case "areaDefault":
                options = options.areaDefault;
                break;
            case "columnCategory":
                options = options.columnCategories;
                break;
        }

        options.series = [{
            name: results[0].title,
            data: results[0].data
        }] ;

        try {
            $(loc).highcharts({
                    series: [{
                        name: moment(results[0].date).format("M/D/YYYY")
                        , type: 'column'
                        , data : results[0].data
                    }],
                    xAxis: {
                        type: 'category'
                        , labels : {
                            autoRotation : [-90]
                        }
                    },
                    yAxis: {
                        visible: true
                        , title : {
                            text : results[0].units
                        }
                    },
                    tooltip:{
                        enabled: true
                        , valueSuffix: " " + results[0].units
                    },
                    title: {
                        text: title
                    },
                    subtitle: {
                        text: subTitle
                    },
                    legend: {
                        enabled: false
                    },
                    credits : {
                        text : "Source: Gelber & Associates"
                        , position: {
                            align : 'left'
                            , verticalAlign: 'bottom'
                            , x: 10
                            , y: -5
                        }
                        , href: "https://www.gelbercorp.com/"
                    }
                }
            );
        } catch(err){
            console.log(err)
        }
    });
}


function HighChartMaxPostDateMaxVersionForecastDate(uuid, forecast_date, loc, title, subTitle, chartType){
    //console.log(mainReports.naturalGas);
    var query = "/api/v2/maxPostDateMaxVersionForecast?metadata_uuid=" + uuid + "&forecast_date="+ forecast_date;

    $.getJSON(query, function (data) {
        var results = [];
        var seriesData = [];
        $.each(data, function (key, val) {
            var series = [];
            $.each(val.data, function (key1, val1) {
                var testDate = val1.date.split("/");
                seriesData.push([Date.UTC(testDate[2],testDate[0]-1, testDate[1]), parseFloat(val1.value)]);
            });
            results.push({title: val.metadata_desc, period: val.period_desc, units: val.unit_desc, data: seriesData});
        });
        //alert("This should be the results[0]: " + JSON.stringify(results[0]));

        //TODO Need to handle multiple data sets here.  THis is defaulting to a single one and needs to be updated.
        var options = defaultOptions(title, subTitle, results[0].units);

        switch (chartType){
            case "lineDefault":
                options = options.lineDefault;
                break;
            case "columnDefault":
                options = options.columnDefault;
                break;
            case "areaDefault":
                options = options.areaDefault;
                break;
        }

        // TODO: This meeds to be created at the $.each level for each data series
        options.series = [{
            name: results[0].title,
            data: results[0].data
        }] ;

        //alert("this should be the options: " + JSON.stringify(options));
        $(loc).highcharts(options);
    });
}




function keyValueTable(uuid,loc){
    var query = "/api/v2/maxPostDateMaxVersion?metadata_uuid=" + uuid ;
    $.getJSON(query, function (results) {
        $(loc).dataTable({
            "destroy": true
            , "data": results[0].data
            , "ordering": false
            , "processing": false
            , "dom": '<"top"><"bottom"><"clear">'
            , "order": [[ 0, "asc" ]]
            , "columns": [
                { "data": "key" }
                , { "data": "value" }
            ]
        });
    });
}

function ducsTable(uuid,loc){
    var query = "/api/v2/maxPostDateMaxVersion?metadata_uuid=" + uuid + "&sort=value&sortDir=desc";
    $.getJSON(query, function (results) {
        $(loc).dataTable({
            "destroy": true
            , "data": results[0].data
            , "ordering": false
            , "processing": false
            , "pageLength": 100
            , "dom": '<"top"><"bottom"><"clear">'
            , "order": [[ 1, "asc" ]]
            /*
            , "footerCallback":
                function ( row, data, start, end, display ) {
                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Total over all pages
                total = api
                    .column( 1 )
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );

                // Total over this page
                pageTotal = api
                    .column( 1, { page: 'current'} )
                    .data()
                    .reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0 );

                // Update footer
                $( api.column( 1 ).footer() ).html(
                    '$'+pageTotal +' ( $'+ total +' total)'
                );
            }
*/
            , "columns": [
                { "data": "key" }
                , { "data": "value" }
            ]
        });
    });
}

function eiaUnitData(table, target, ids, minDate){
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });
    var query = "/api/v2/eia/" + table + "?target=" + target + "&ids=" + ids;
    var startDate = (typeof minDate !== 'undefined' && minDate != null && minDate != "")? minDate : Date.UTC(1970,0,1);

    $.getJSON(query, function (data) {
        //var baseUnits = data[0].unit_desc;
        console.log('This is the data: ' + JSON.stringify(data));

        var results = [];
        var seriesData = [];
        $.each(data, function (key, val) {
            var series = [];
            var targetUnits = val.unit_desc;
            $.each(val.data, function (key1, val1) {
                var testDate = val1.date.split("/");
                testDate = Date.UTC(testDate[2],testDate[0]-1, testDate[1]);
                var testVal = parseFloat(val1.value) * conversion(baseUnits, targetUnits);
                if (testDate >= minDate){
                    seriesData.push([testDate, testVal]);
                }
            });
            seriesData.sort(function(a,b) {
                return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);
            });
            results.push({title: val.metadata_desc, period: val.period_desc, units: val.unit_desc, data: seriesData});
        });
        //console.log("This should be the results[0]: " + JSON.stringify(results[0]));

        var options = defaultOptions(title, subTitle, results[0].units);
        options = options[chartType];
        //console.log("This is the data: " + JSON.stringify(results[0].data));

        options.series = [{
            name: results[0].title,
            data: results[0].data
        }] ;

        $(loc).highcharts(options);
    });
}



function portfolioDataTables (loc, id){
    $(loc).dataTable( {
        "processing": false
        , "ordering": false
        , "pageLength": 10
        , "lengthMenu": [ 10, 20, 50, 100]
        , "ajax": "/c/s/pu?items=200" + (id ? ('&id=' + id) : '')
        //, "dom": '<"top"><"bottom"><"clear">'
        , "order": [[ 0, "desc" ]]
        , "columns": [
            { "data": "post_date" }
            , { "data": "cat_class" }
            , { "data": "sub_cat_class" }
            , { "data": "title" }
        ]
    } );
}

