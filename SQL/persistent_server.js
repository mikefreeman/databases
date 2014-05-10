var mysql = require('mysql');
var http = require("http");
var httpHelpers = require('../server/http-helpers');
var url = require('url');

/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/

var database = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

database.connect();

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

/* Every server needs to listen on a port with a unique number. The
 * standard port for HTTP servers is port 80, but that port is
 * normally already claimed by another server and/or not accessible
 * so we'll use a higher port number that is not likely to be taken: */
var port = 3000;

/* For now, since you're running this server on your local machine,
 * we'll have it listen on the IP address 127.0.0.1, which is a
 * special address that always refers to localhost. */
var ip = "127.0.0.1";


var messageHandler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  request.content = "";
  var statusCode = 200;
  var urlArr = request.url.split("/");
  var roomname = urlArr[2];
  var responseData;

  // Check to make sure this is a valid url
  if (request.method.toUpperCase() === "OPTIONS") {
    response.writeHead(204, headers);
    return response.end();
  } else if (urlArr[1] !== "classes") {
    statusCode = 404;
  } else if (request.method === "GET") {
    statusCode = 200;

    database.query('SELECT * FROM messages where room_name="' + roomname + '"', function(err, rows, fields) {
      response.writeHead(statusCode, headers);
      responseData = JSON.stringify({results: rows});
      response.end(responseData);
    });
  } else if (request.method === "POST") {

    request.addListener("data", function(chunk) {
      request.content += chunk;
    });

    request.addListener("end", function() {
      var messageContent = JSON.parse(request.content);
      var roomname = urlArr[2];
      messageContent.room_name  = messageContent.room_name || roomname;
      messageContent.time = new Date();
      database.query('INSERT INTO messages SET ?', messageContent, function(error, rows, fields) {
        response.writeHead(201, headers);
        return response.end('\n');
      });
    });

    if (statusCode === 404) {
      response.writeHead(404, headers);
      response.end('\n');
    }
  }
  // console.log("response data", responseData);
  // response.writeHead(statusCode, headers);

  // responseData ? response.end(responseData) : response.end();

};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "Content-Type": "text/plain" // Seconds.
};

var server = http.createServer(messageHandler);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);




// var routes = {
//   '/classes/messages': messageHandler.handler,
//   '/classes/users': messageHandler.handler // userHandler.handler
// };

// var router = function(request, response) {
//   console.log("Serving request type " + request.method + " for url " + request.url);

//   var parsedUri = url.parse(request.url);

//   var route = routes[parsedUri.pathname];
//   if( route ){
//     route(request, response);
//   } else {
//     httpHelpers.sendResponse(response, null, 404);
//   }
// };
