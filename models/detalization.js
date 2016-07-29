define([],function(){

    var collection = new webix.DataCollection({
        url:"rest->http://localhost:8080/detalization"
        //save:"rest->http://localhost:8080/data"
    });
    return {
        data: collection,
        getOrder: getOrder,
        orderByCategory: orderByCategory,
        saveOrderInfo: saveOrderInfo
    };
});
function getOrder(id, e, trg){


    var number = $$('ors').getItem(id).number;
    webix.ajax().get("http://localhost:8080/getorder?" + number, null, function (text, xml, xhr) {
        $$('orderDetalization').clearAll();
        if(text!=null)
            $$('orderDetalization').parse(text);
        else {
            webix.alert("Error on server side");
        }
    });
}

function  orderByCategory(id){
    var cat = $$('categories').getItem(id).category;
    webix.ajax().get("http://localhost:8080/orderdetal?" + cat, null, function (text, xml, xhr) {
        $$('ors').clearAll();
        $$('ors').parse(text);
    });
}
function saveOrderInfo(){
    var formValues = $$('formEditOrder').getValues();
    webix.ajax().put("http://localhost:8080/orderdetal",formValues,{
        success:function(){
            $$("formEditOrder").save();
            $$("editWin").hide();
        },
        error:function(){
            webix.message("Error");
        }
    });
}