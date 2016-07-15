/*
	App configuration
*/

define([
	"libs/webix-mvc-core/core",
	"libs/webix-mvc-core/plugins/menu"
], function(
	core, menu
){

	//configuration
	var app = core.create({
		id:			"hsd", //change this line!
		name:		"My online shop",
		version:	"0.1.0",
		debug:		true,
		start:		"/top/products"
	});

	app.use(menu);



	return app;
});