

define([],function(){

	var collection = new webix.DataCollection({
		url:"rest->http://localhost:8080/products"
	});


	return {
		data: collection,
		save: saveHandler,
		doubleClickEdit:doubleClickEdit,
		popupEdit: popupEdit,
		refreshTable:refreshTable,
		addProductWithFile:addProductWithFile,
		addProductWithColor:addProductWithColor
	};
});

var saveHandler = function() {
	var formValues = $$('form1').getValues();
	webix.ajax().headers({
		"Content-type":"application/json"
	}).put("http://localhost:8080/products",JSON.stringify(formValues),{
		success:function(){
			$$("form1").save();
			$$("editWin").hide();
		},
		error:function(){
			webix.message("Error");
		}
	});
};

function doubleClickEdit(id){
	var table = $$('datatable1');
	if (id.column == "DELETE") {
		var code = table.getItem(id).CODE;
		webix.ajax().del("http://localhost:8080/products?" + code, null, function (text, xml, xhr) {
			if(text) {
				webix.message("Delete row: " + id);
				table.remove(id);
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
function popupEdit(state,editor) {
	if (state.value != state.old) {
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

function refreshTable(){
	var table = $$("datatable1");
	table.clearAll();
	table.load("http://localhost:8080/products");
}

function  addProductWithFile(formValues) {
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

function  addProductWithColor(formValues){
	webix.ajax().post(
		"http://localhost:8080/products", //saving form
		formValues,
		function(text){
			if(text) {
				grid = $$("datatable1");
				formValues.IMAGE = "<span  style='background-color:" + formValues.COLOR + "; border-radius:4px; padding-right:10px;'>&nbsp&nbsp&nbsp</span>";
				grid.add(formValues);

				$$("form3").clear();
				$$('addProduct').hide();
			}
			else {
				webix.message("Server side error");
			}
		}
	);
}