define([],function(order){
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
        view: "datatable", id: "orders",  select: true, editable:true, pager:"pagerA", autowidth:true,navigation:true,
        columns: [
            {id:"id",   header:"",           sort:"int"},
            {id: "salesperson", header: ["Salesperson", {content: "serverFilter"}], width: 220, sort:"server"},
            {id: "customer", header: ["Customer", {content: "serverFilter"}], width: 220, sort:"server"},
            {id: "status", header: "Status of order", width: 220, sort:"server"},
            {id: "fee", header: "Fee", width: 220, sort:"server"},
            {id: "shipping", header: "Date of order", width: 220, sort:"server"},
            {id: "date", header: "Date of order", width: 220, sort:"server"},
            {id: "image", header: "Image", width: 220, template:"<img src='temp/#image#.png'/>"},
            {id: "delete", header: "", width: 50, template:"<span class='webix_icon fa-trash-o'></span>"}

        ],
        url:"http://localhost:8080/orders",
        datafetch:10,
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
            "data->onStoreUpdated":function(id,obj,operation){
                //this.data.each(function(obj, i){
                //    obj.index = i+1;
                //})
            }
        }
    };
    var pager = {
        id:"pagerA", view:"pager",
        template:"{common.prev()} {common.pages()} {common.next()}",
        size:5,
        group:5
    };
    var ui = {
        rows: [
            tools,
            grid,
            pager
        ]
    };
    return {
        $ui: ui,
        $oninit:function(view){
            $$("editOrder").bind("orders");
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