

function UniversalSelect(loc, target, url, preselect, select2flag){
    try {
        if (preselect == null){preselect=[]}
        if (typeof preselect !== 'object'){
            if (typeof preselect !=='undefined' ){
                if ( preselect.length > 0){
                    preselect = preselect.split(",");
                } else {

                }
            }
        } else {
            var selectArr = [];
            if (typeof preselect.length === 'undefined'){
                selectArr.push(preselect._id);
                preselect = selectArr;
            } else {
                for (var i = 0; i < preselect.length; i++){
                    console.log("This is the preselect: " + preselect[i]);
                    if (preselect[i]._id){
                        selectArr.push(preselect[i]._id);
                    } else {
                        selectArr.push(preselect[i]);
                    }
                }
                preselect = selectArr;
            }
        }

        $.getJSON(url, function(data){
            var $select = "<option></option>";
            $.each(data, function (key, val) {
                var text = "";
                if (target.indexOf(".") > -1){
                    var populate = target.split(".");
                    text = val[populate[0]][populate[1]];
                } else {
                    text = val[target];
                }

                if ($.inArray(val._id, preselect) !== -1) {
                    $select = $select + '<option selected id="' + val._id + '" value="' + val._id + '">' + text + '</option>';
                } else {
                    $select = $select + '<option id="' + val._id + '" value="' + val._id + '">' + text + '</option>';
                }
            });
            if (select2flag === 1){
                $(loc).html($select).select2()
            } else{
                $(loc).html($select)
            }
        });
    } catch (err){
        console.log(err);
    }
}


function UniversalSelect2(loc, target, url, preselect){
    console.log("This is the UniversalSelect2 + preselect: " + JSON.stringify(preselect));
    if (preselect != null && preselect != {}){
        if (typeof preselect != 'object'){
            preselect = preselect.split(",")
        } else if (!Array.isArray(preselect)){
            preselect = [preselect];
        }
        var selected =[];
        for (var i = 0; i < preselect.length; i++){
            selected.push(preselect[i]._id)
        }
        $(loc).val(selected);
    }

    try {
        $(loc).select2({
            minimumInputLength: 1
            , multiple: true
/*
            , initSelection : function(element, callback) {
                var selectArr = [];
                for (var i = 0; i < preselect.length; i++){
                    selectArr.push({'id': preselect[i]._id, 'text': preselect[i][target]});
                }
                preselect = selectArr;
                callback(selectArr);
            }
*/
            , ajax: {
                url: url
                , dataType: 'json'
                , quietMillis: 250
                , data: function (term, page) {
                    return JSON.parse('{"' + target +'":"' + '~' + term + '"}');
                }
                , results: function (data, page) {
                    console.log("this is the data: " + JSON.stringify(data));
                    return {
                        results: data.map(function(item) {
                                return {
                                    id: item._id,
                                    text: item[target]
                                };
                            }
                        )
                    };
                }
                , cache: true
            }

        });
    }catch (err){
        alert (err)
    }
}
