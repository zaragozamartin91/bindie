//Example POST method invocation 
var Client = require('node-rest-client').Client;

var client = new Client();

// set content-type header and data as json in args parameter 
var args = {
    data: {
        name: "Mateo",
        email: "mateo@zaragoza.com",
        password: "mateo000",
        bands: []
    },
    headers: {
        "Content-Type": "application/json"
    }
};

// registering remote methods 
client.registerMethod("postMethod", "http://localhost:3000/api/users/register/", "POST");

client.methods.postMethod(args, function(data, response) {
    // parsed response body as js object 
    console.log(data);
    // raw response 
    console.log(response);
});