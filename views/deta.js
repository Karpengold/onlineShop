define([
    "models/detalization"
],function(deta){

    var categories = {
        view: "datatable", id:"categories",
        columns: [
            {id: "category", header: ["Category", {content: "textFilter"}], width: 400, sort:"string"}
        ],
        on: {
            "onItemClick": function(id, e, trg){
                deta.orderByCategory(id);
            }
        },
        autowidth: true,
        select:true
    };
    var information = {
            rows: [
                {
                    view: "datatable", id: "ors", select: true, autowidth:true,
                    columns: [
                        {id: "number", header: "Number", width: 100},
                        {id: "date", header: "Date", width: 100},
                        {id: "status", header: "Status", width: 100}
                    ],
                    on: {
                        "onItemClick": function(id, e, trg){
                            deta.getOrder(id,e,trg);
                        },
                        "onItemDblCLick": function(id, e, trg){
                            editOrder.show();
                        }

                    }

                },
                {
                    view: "datatable", id: "orderDetalization", select: true,autowidth:true,
                    columns: [
                        {id:"id",   header:"Number",           sort:"int"},
                        {id: "salesperson", header: "Saler",  width: 100},
                        {id: "customer", header: "Customer",  width: 100},
                        {id: "status", header: "Status", width: 100 },
                        {id: "fee", header: "Fee", width: 100},
                        {id: "shipping", header: "Shipping", width: 100},
                        {id: "date", header: "Date", width: 100}
                    ]
                }
            ]
    };

    var ui = {
        cols: [
            categories,
            information
        ]
    };
    return {
        $ui: ui,
        $oninit:function(view){
            $$('categories').parse(deta.data);
            $$('formEditOrder').bind($$('ors'));
            modelDetalization = deta;
        }
    };

});
var modelDetalization;
var editOrder = webix.ui({
    view: "window",
    id: "orderInfo",
    head: "Edit Order Info",
    position: "center",

    body: {
        view: "form", id: "formEditOrder", scroll: false,
        elements: [
            {view: "text", name: "number", label: "Number"},
            {view: "text", name: "date", label: "Date"},
            {view: "text", name: "status", label: "Status"},

            {view: "button", value: "Cancel", click: '$$("orderInfo").hide()'},
            {view: "button", value: "Save", click: function(){modelDetalization.saveOrderInfo()}}
        ]
    }
});

