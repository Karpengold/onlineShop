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
