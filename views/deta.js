define([
    "models/deta"
],function(deta){

    var categories = {
        view: "datatable", id:"categories",
        columns: [
            {id: "category", header: ["Category", {content: "textFilter"}], width: 400, sort:"string"}
        ],
        on: {
            "onItemClick": function(id, e, trg){
                var cat = $$('categories').getItem(id).category;
                webix.ajax().get("http://localhost:8080/orderdetal?" + cat, null, function (text, xml, xhr) {
                        $$('ors').clearAll();
                        $$('ors').parse(text);
                });
            }
        },
        autowidth: true,
        select:true
    };
    var information = {
            rows: [
                {
                    view: "datatable", id: "ors", select: true,
                    columns: [
                        {id: "number", header: "Number", width: 100},
                        {id: "date", header: "Date", width: 100},
                        {id: "status", header: "Status", width: 100}
                    ],
                    on: {
                        "onItemClick": function(id, e, trg){
                            debugger;

                            var number = $$('ors').getItem(id).number;
                            webix.ajax().get("http://localhost:8080/getorder?" + number, null, function (text, xml, xhr) {
                                $$('orderDetalization').clearAll();
                                if(text!=null)
                                    $$('orderDetalization').parse(text);
                            });
                        },
                        "onItemDblCLick": function(id, e, trg){
                            editOrder.show();
                        }

                    }

                },
                {
                    view: "datatable", id: "orderDetalization", select: true,
                    columns: [
                        {id:"number",   header:"Number",           sort:"int"},
                        {id: "salesperson", header: "Salesperson",  width: 100},
                        {id: "customer", header: "Customer",  width: 100},
                        {id: "status", header: "Status of order", width: 100 },
                        {id: "fee", header: "Fee", width: 100},
                        {id: "shipping", header: "Shipping", width: 100},
                        {id: "date", header: "Date of order", width: 100},
                        {id: "image", header: "Image", width: 100}
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
        }
    };

});

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
            {view: "button", value: "Save", click: saveOrderInfo}
        ]
    }
});

function saveOrderInfo(){
    var formValues = $$('formEditOrder').getValues();
    webix.ajax().headers({
        "Content-type":"application/json"
    }).put("http://localhost:8080/orderdetal",JSON.stringify(formValues),{
        success:function(){
            $$("formEditOrder").save();
            $$("editWin").hide();
        },
        error:function(){
            webix.message("Error");
        }
    });
}