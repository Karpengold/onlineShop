define([
    "models/deta"
],function(records){

    var ui = {
        view:"datatable", autoConfig:false //сам
    };

    return {
        $ui: ui,
        $oninit:function(view){
            view.parse(records.data);
        }
    };

});
