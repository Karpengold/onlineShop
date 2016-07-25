define([
    "app"
],function(app){

    var header = {
        type:"header", template:app.config.name
    };

    var menu = {
        view:"menu", id:"top:menu",
        width:180, layout:"y", select:true,
        template:"<span class='webix_icon fa-#icon#'></span> #value# ",
        data:[
            { value:"Products", 		id:"products",		href:"#!/top/products", 		icon:"briefcase" },
            { value:"Orders", 			id:"orders",		href:"#!/top/orders", 		icon:"briefcase" },
            { value:"Detalization", 	id:"deta",		href:"#!/top/deta", 		icon:"briefcase" }
        ]
    };

    var ui = {
        type:"line", cols:[
            { type:"clean", css:"app-left-panel",
                padding:10, margin:20, borderless:true, rows: [ header, menu ]},
            { rows:[ { height:10},

                { view:"button", id:"user", type:"icon", icon:"user", label:"User", width:80, click:userInfo },
                { type:"clean", css:"app-right-panel", padding:4, rows:[
                    { $subview:true }
                ]}
            ]}

        ]
    };

    return {
        $ui: ui,
        $menu: "top:menu"
    };
});
function userInfo(){
    if(!userInfoWin.isVisible()){
        userInfoWin.show();
    }
    else {
        userInfoWin.hide();
    }
}
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
function saveUserInfo() {
    var formValues = $$("form2").getValues();
    $$("user").define("label", formValues.name + " " + formValues.surname);
    $$("user").refresh();
    $$("userInfo").hide();
}