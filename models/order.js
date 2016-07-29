define([],function() {
    return {

        saveOrder:saveOrder,
        deleteOrder:deleteOrder


    };
});

function saveOrder() {
    var formValues = $$('editOrder').getValues();
    webix.ajax().headers({
        "Content-type":"application/json"
    }).put("http://localhost:8080/orders",JSON.stringify(formValues), function(response){
        if(response.server) {
            $$("editOrder").save();
            $$("orderWin").hide();
        }
        else
            webix.alert("Error");
    });
}

function deleteOrder(id){
    if (id.column == "delete") {
        var salesperson = $$('orders').getItem(id).salesperson;
        webix.ajax().del("http://localhost:8080/orders?" + salesperson , null, function (text, xml, xhr) {
            if(text) {
                webix.message("Delete row: " + id);
                $$("orders").remove(id);
                console.log(text);
            }
            else {
                webix.error("Error");
            }
        });
        return false;
    }
}