define([
    "models/records"
],function(records){
    var clicks =0;

    var table = {
            view: "datatable", id: "datatable1",
            columns: [
                {id:"index",   header:"",           sort:"int"},
                {id: "CODE", header: ["Code", {content: "textFilter"}], width: 220, sort:"string"},
                {id: "NAME", header: ["Name", {content: "textFilter"}], width: 220, sort:"string"},
                {id: "CATEGORY", header: ["Category", {content: "textFilter"}], width: 220, sort:"string"},
                {id: "PRICE", header: "Price", width: 220, sort:"string"},
                {id: "QUANTITY", header: "Quantity", width: 220, sort:"string"},
                {id: "STATUS", header: "Status", width: 200, sort:"string"},
                {id: "IMAGE", header: "Image", width: 200, template:"<img src='temp/#CODE#.png'/>"},
                {id: "DELETE", header: "", width: 50,  template:"<span class='webix_icon fa-trash-o'></span>"}
            ],
            editable: true,
            autowidth: true,
            on: {
                "onItemClick": function (id, e, trg) {
                    clicks++;

                    setTimeout(function(){

                        if(clicks == 2){
                            //doubleClickEdit();
                            alert("doubleClickEdit");

                        }
                        if(clicks == 1){
                            singleClickEdit(id);
                        }

                        clicks = 0;
                    },400);


                },
                "data->onStoreUpdated":function(){
                    this.data.each(function(obj, i){
                        obj.index = i+1;
                    })
                }
            },
            select: true
    };

    var toolbar = { view:"toolbar", id:"tools", height:40, elements:[

        { view:"icon", icon:"user", click: userInfo},
        { view:"icon", icon:"mail", click: addProduct}

    ]};

    var ui = {
        rows: [
            toolbar,
            table
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
    debugger;
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
function userInfo(){
    if(!userInfoWin.isVisible()){
        userInfoWin.show();
    }
    else {
        userInfoWin.hide();
    }
}
function saveUserInfo() {
    var formValues = $$("form2").getValues();

    $$("tools").addView({
        view:"label",
        label: formValues.name,
        width: 100
    });
    $$("tools").addView({
        view:"label",
        label: formValues.surname,
        width: 100

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

    var formValues = $$("form3").getValues();
    $$('files').send(function(response){
        if(response) {
            $$("datatable1").add(formValues);
            $$('addProduct').close();
        }
        else {
            webix.message("Error")
        }
    },
        formValues
    );
}

function singleClickEdit(id){
    if (id.column == "DELETE") {
        var code = $$('datatable1').getItem(id).CODE;
        webix.ajax().del("http://localhost:8080/products?" + code, null, function (text, xml, xhr) {
            if(text) {
                webix.message("Delete row: " + id);
                $$("datatable1").remove(id);
            }
            else {
                webix.error("Error");
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
                                id:"files", name:"files",
                                value:"Add image",
                                link:"doclist",
                                accept: "image/png, image/gif, image/jpg",
                                autosend:false

                            },
                            {
                                view:"list", scroll:false, id:"doclist",
                                type:"uploader", autoheight:true, borderless:true
                            }
                        ]
                    }

                ]
            },


            {view: "button", value: "Cancel", click: '$$("addProduct").hide()'},
            {view: "button", value: "Save", click: saveProduct}
        ]
    }

});
var userInfoWin = webix.ui({
    view: "window",
    id: "userInfo",
    head: "Account settings",
    position: "center",

    body: {
        view: "form", id: "form2", scroll: false,
        elements: [
            {view: "text", name: "name", label: "Name"},
            {view: "text", name: "surname", label: "Surname"},
            {view: "text", name: "phone", label: "Phone"},
            {view: "text", name: "email", label: "Email"},
            {view: "button", value: "Cancel", click: '$$("userInfo").hide()'},
            {view: "button", value: "Save", click: saveUserInfo}
        ]
    }
});