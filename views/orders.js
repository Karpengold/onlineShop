define(["models/order"],function(order){

    var grid = {
        view: "datatable", id: "orders",  select: true, editable:true,
        columns: [
            {id:"index",   header:"",           sort:"int"},
            {id: "salesperson", header: ["Salesperson", {content: "textFilter"}], width: 220, sort:"string"},
            {id: "customer", header: ["Customer", {content: "textFilter"}], width: 220, sort:"string"},
            {id: "status", header: ["Status of order", {content: "textFilter"}], width: 220, sort:"string"},
            {id: "fee", header: "Fee", width: 220, sort:"string"},
            {id: "shipping", header: "Date of order", width: 220, sort:"string"},
            {id: "date", header: "Date of order", width: 220, sort:"string"},
            {id: "image", header: "Image", width: 200, sort:"string"},
            {id: "delete", header: "Delete", width: 100,  src:"/deleteImage.png"}
        ],
        on: {
            "onItemClick": function(id, e, trg) {
                if (id.column == "delete") {
                    var salesperson = $$('orders').getItem(id).salesperson;
                    webix.ajax().del("http://localhost:8080/orders?" + salesperson , null, function (text, xml, xhr) {
                        webix.message("Delete row: " + id);
                        $$("orders").remove(id);
                        console.log(text);
                    });
                    return false;
                }
            },
            "onItemDblClick": function () {
                if ($$('orderWin') != null)
                    $$('orderWin').close();
                webix.ui({
                    view: "window",
                    id: "orderWin",
                    head: "Edit order",
                    position: "center",

                    on: {
                        "onShow": function () {
                            $$("editOrder").bind("orders");
                        }
                    },
                    body: {
                        view: "form", id: "editOrder", scroll: false,
                        elements: [
                            {view: "text", name: "salesperson", label: "Salesperson"},
                            {view: "text", name: "customer", label: "Customer"},
                            {view: "text", name: "status", label: "Status of order"},
                            {view: "text", name: "fee", label: "Fee"},
                            {view: "text", name: "date", label: "Date"},
                            {view: "text", name: "shipping", label: "Shipping"},
                            {view: "button", value: "Cancel", click: '$$("orderWin").close()'},
                            {view: "button", value: "Save", click: saveOrder}
                        ]
                    }
                }).show();
            }
        }
    };


    return {
        $ui: grid,
        $oninit:function(view){
            view.parse(order.data);
        }
    };

});

function saveOrder() {
    var formValues = $$('editOrder').getValues();
    webix.ajax().headers({
        "Content-type":"application/json"
    }).put("http://localhost:8080/orders",JSON.stringify(formValues), function(){
        $$("editOrder").save();
        $$("orderWin").close();
    });
}
