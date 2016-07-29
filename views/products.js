define([
    "models/records"
],function(records){


    var table = {
            view: "datatable", id: "datatable1",
            columns: [
                {id:"index",   header:"",           sort:"int"},
                {id: "CODE", editor:"popup", header: ["Code", {content: "textFilter"}], width: 250, sort:"string"},
                {id: "NAME", editor:"popup",header: ["Name", {content: "textFilter"}], width: 250, sort:"string"},
                {id: "CATEGORY",editor:"popup", header: ["Category", {content:"selectFilter"}], width: 250, sort:"string"},
                {id: "PRICE", editor:"popup",header: "Price", width: 250, sort:"string"},
                {id: "QUANTITY", editor:"popup",header: "Quantity", width: 250, sort:"string"},
                {id: "STATUS",editor:"popup", header: "Status", width: 200, sort:"string"},
                {id: "IMAGE",header: "", width: 50},
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
                    modelRecords.doubleClickEdit(id);
                },
                "onAfterEditStop": function (state, editor, ignoreUpdate) {
                    modelRecords.popupEdit(state,editor);
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
        value: "Refresh",
        width:100,
        click: function(){modelRecords.refreshTable()}
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
            var grid = $$('datatable1');
            grid.parse(records.data);
            $$("form1").bind(grid);
            modelRecords = records;
        }
    };


});
var modelRecords;

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
        modelRecords.addProductWithFile(formValues);
    }
    else {
        modelRecords.addProductWithColor(formValues);
    }
}


var editWin =  webix.ui({
    view: "window",
    id: "editWin",
    head: "Edit product",
    position: "center",


    body: {
        view: "form", id: "form1", scroll: false,
        elements: [
            {view: "text", name: "CODE", label: "Code"},
            {view: "text", name: "NAME", label: "Name"},
            {view: "text", name: "PRICE", label: "Price"},
            {view: "text", name: "CATEGORY", label: "Category"},
            {view: "button", value: "Cancel", click: '$$("editWin").hide()'},
            {view: "button", value: "Save", click:function(){ modelRecords.save()}}
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
