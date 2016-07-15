define([],function(){

    var collection = new webix.DataCollection({
        url:"rest->http://localhost:8080/detalization"
        //save:"rest->http://localhost:8080/data"
    });
    return {
        data: collection
    };
});
