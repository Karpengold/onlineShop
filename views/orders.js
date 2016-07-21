define(["models/order"],function(order){
    var tools = {

        view: "form",
        css: "toolbar",

        cols:[
        {
            view: "label", label: "Export"
        },
        {
            view: "button", label: "All Fields", width: 95, click:function(){
            webix.toExcel($$("orders"));
        }
        }
    ]

    };
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
            {id: "image", header: "Image", width: 220, sort:"string"},
            {id: "delete", header: "", width: 50, template:"<span class='webix_icon fa-trash-o'></span>"}

        ],
        on: {
            "onItemClick": function(id, e, trg) {
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
            },
            "onItemDblClick": function () {
                if (!editOrderWin.isVisible())
                    editOrderWin.show();
                else {
                    editOrderWin.hide();
                }

            },
            "data->onStoreUpdated":function(){
                this.data.each(function(obj, i){
                    obj.index = i+1;
                })
            }
        }
    };

    var ui = {
        rows: [
            tools,
            grid
        ]
    };
    return {
        $ui: ui,
        $oninit:function(view){
            $$('orders').parse(order.data);
        }
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
            webix.error("Error");
    });
}
var editOrderWin = webix.ui({
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
            {view: "button", value: "Cancel", click: '$$("orderWin").hide()'},
            {view: "button", value: "Save", click: saveOrder}
        ]
    }
});