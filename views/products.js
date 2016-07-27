define([
    "models/records"
],function(records){


    var table = {
            view: "datatable", id: "datatable1",
            columns: [
                {id:"index",   header:"",           sort:"int"},
                {id: "CODE", editor:"popup", header: ["Code", {content: "textFilter"}], width: 220, sort:"string"},
                {id: "NAME", editor:"popup",header: ["Name", {content: "textFilter"}], width: 220, sort:"string"},
                {id: "CATEGORY",editor:"popup", header: ["Category", {content:"selectFilter"}], width: 220, sort:"string"},
                {id: "PRICE", editor:"popup",header: "Price", width: 220, sort:"string"},
                {id: "QUANTITY", editor:"popup",header: "Quantity", width: 220, sort:"string"},
                {id: "STATUS",editor:"popup", header: "Status", width: 200, sort:"string"},
                {id: "IMAGE", editor:"color",header: "Image", width: 200},
                {id: "DELETE", header: "", width: 50,  template:"<span class='webix_icon fa-trash-o'></span>"}
            ],
            editable: true,

            editaction: "click",
            autowidth: true,
            pager:"pagerA",

            on: {
                "data->onStoreUpdated":function(){
                    this.data.each(function(obj, i){
                        obj.index = i+1;
                    })
                },
                "onItemDblClick":function(id, e, node){
                    doubleClickEdit(id);
                },
                "onAfterEditStop": function (state, editor, ignoreUpdate) {
                    debugger;
                    if(state.value != state.old) {
                        webix.ajax().headers({
                            "Content-type": "application/json"
                        }).put("http://localhost:8080/products", JSON.stringify($$('datatable1').getItem(editor.row)), {
                            success: function () {
                                webix.message("Ok")
                            },
                            error: function () {
                                webix.message("Error");
                            }
                        });
                    }
                }

            },
            select: true
    };


    var pager = {
        id:"pagerA", view:"pager",
        template:"{common.prev()} {common.pages()} {common.next()}",
        size: 10,
        count:2,
        group:5
    };
    var refreshButton = {
        view: "button",
        value: "Refresh data",
        width:100,
        click: refreshTable
    };

    var addButton = {
        view: "button",
        value: "Add item",
        width:100,
        click: addProduct
    };

    var ui = {
        rows: [
            {cols:[
                refreshButton,
                addButton
            ]},
            table,
            pager
        ]
    };

    return {
        $ui: ui,
        $oninit:function(view){
            $$('datatable1').parse(records.data);

        }
    };


});

function saveHandler() {

    var formValues = $$('form1').getValues();
    webix.ajax().headers({
        "Content-type":"application/json"
    }).put("http://localhost:8080/products",JSON.stringify(formValues),{
        success:function(){
            $$("form1").save();
            $$("editWin").close();
        },
        error:function(){
            webix.message("Error");
        }
    });
}


function addProduct() {
    if(!addProductWin.isVisible()){
        addProductWin.show();
    }
    else {
        addProductWin.hide();
    }
}
function saveProduct(){
    debugger;
    var formValues = $$("form3").getValues();

    if($$('doclist').count() != 0 ) {
        $$('files').send(function (response) {
                if (response) {
                    $$("datatable1").add(formValues);
                    $$('addProduct').close();
                }
                else {
                    webix.message("Error");
                }
            },
            formValues
        );
    }
    else {
        webix.ajax().post(
            "http://localhost:8080/products", //saving form
            formValues,
            function(text){  //responce
                debugger;
                if(text) {
                    grid = $$("datatable1");
                    formValues.IMAGE = "<span style='background-color:" + formValues.COLOR + "; border-radius:4px; padding-right:10px;'>&nbsp</span>";
                    grid.add(formValues);
                    //var record = grid.getItem();
                    //record["CODE"] = "<span style='background-color:"+color+"; border-radius:10px; padding-right:10px;'>&nbsp</span>";
                    //
                    //grid.updateItem(row_id, record);
                    $$("form3").clear();
                    $$('addProduct').hide();
                }
                else {
                    webix.message("Server side error");
                }
            }
        );
    }
}
function refreshTable(){
    var table = $$("datatable1");
    table.clearAll();
    table.load("http://localhost:8080/products");
}
function doubleClickEdit(id){
    if (id.column == "DELETE") {
        var code = $$('datatable1').getItem(id).CODE;
        webix.ajax().del("http://localhost:8080/products?" + code, null, function (text, xml, xhr) {
            if(text) {
                webix.message("Delete row: " + id);
                $$("datatable1").remove(id);
            }
            else {
                webix.message("Error");
            }
        });
        return false;
    }

    if(!editWin.isVisible()){
        $$("editWin").show();
    }

}
var editWin =  webix.ui({
    view: "window",
    id: "editWin",
    head: "Edit product",
    position: "center",

    on: {
        "onShow": function () {
            $$("form1").bind("datatable1");
        }
    },
    body: {
        view: "form", id: "form1", scroll: false,
        elements: [
            {view: "text", name: "CODE", label: "Code"},
            {view: "text", name: "NAME", label: "Name"},
            {view: "text", name: "PRICE", label: "Price"},
            {view: "text", name: "CATEGORY", label: "Category"},
            {view: "button", value: "Cancel", click: '$$("editWin").hide()'},
            {view: "button", value: "Save", click: saveHandler}
        ]
    }

});
var addProductWin = webix.ui({
    view: "window",
    id: "addProduct",
    head: "Add new product",
    position: "center",
    width:500,
    type:"space",
    body: {
        rows: [
            {
                cols: [
                    {
                        view: "form", id: "form3", scroll: false,
                        elements: [

                            {view: "text",      name:  "CODE",     label: "Code"},
                            {view: "text",      name:  "CATEGORY", label: "Category"},
                            {view: "text",      name:  "NAME",     label: "Name"},
                            {view: "text",      name:  "PRICE",    label: "Price"},
                            {view: "text",      name:  "QUANTITY", label: "Quantity"},
                            {view: "checkbox",  name:  "STATUS",   label: "Published", value:1},
                            {
                                view:"uploader", upload:"http://localhost:8080/products",
                                on:{
                                    "onAfterFileAdd": function() {
                                        $$('files').hide();
                                        $$('colorPicker').hide();
                                    }
                                },
                                id:"files", name:"files",
                                value:"Add image",
                                link:"doclist",
                                accept: "image/png, image/gif, image/jpg",
                                autosend:false

                            },
                            {
                                view:"list", scroll:false, id:"doclist",
                                type:"uploader", autoheight:true, borderless:true
                            },
                            { view:"colorpicker",id:"colorPicker", label:"Color", name:"COLOR", value:"#ffaadd" }
                        ]
                    }

                ]
            },


            {view: "button", value: "Cancel", click: '$$("addProduct").hide()'},
            {view: "button", value: "Save", click: saveProduct}
        ]
    }

});
