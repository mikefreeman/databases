/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var url = require("url");
//
var dataStore = {};



exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  //console.log(url.parse(request.url));
  //console.log(request.data);
  console.log("Serving request type " + request.method + " for url " + request.url);
  var database = exports.dbConnection;
  request.content = "";

  var statusCode = 200;

  var urlArr = request.url.split("/");

  var responseData;

  //urlArr[0] !== "classes"
  console.log(urlArr);
  // Check to make sure this is a valid url
  if (request.method.toUpperCase() === "OPTIONS") {
    console.log('options');
    response.writeHead(
      "204",
      "No Content",
      defaultCorsHeaders
      );
    return response.end();
  } else if (urlArr[1] !== "classes") {
    statusCode = 404;
  } else if (request.method === "GET") {
    console.log("here", database);
    statusCode = 200;
    var roomname = urlArr[2];
    database.query('SELECT * FROM messages where room_name="' + roomname + '"', function(err, results, fields) {
      responseData = {results: results};

    });
    // if (!dataStore[roomname]) {
    //   responseData = JSON.stringify({results:[]});
    // } else {
    //   responseData = JSON.stringify({results:dataStore[roomname]});
    // }

  } else if (request.method === "POST") {
    // get object they're sending in the post request
    // query the data store against the room name which would be the
    // second element in the url array
    // if it doesn't exist, make the room and put it in
    // otherwise add it to our results array and then return the entire array
    // back to the user

    statusCode = 201;
    var timestamp = Date.now();
    request.addListener("data", function(chunk) {
      request.content += chunk;
    });
    request.addListener("end", function() {
      var roomname = urlArr[2];
      var messageContent = JSON.parse(request.content);
      console.log(request.content);
      messageContent.time = timestamp;
      database.query('INSERT INTO messages SET ?', messageContent, function(err, results, fields) {

      });
      database.query('SELECT * FROM messages where room_name="' + roomname + '"', function(err, results, fields) {
        responseData = {results: results};

      });
      // if (dataStore[roomname]) {
      //   dataStore[roomname].push(messageContent);
      // } else {
      //   dataStore[roomname] = [messageContent];
      // }
      // responseData = JSON.stringify({results:dataStore[roomname]});
      // console.log(responseData);
    });

  }




  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);
  //response.write(responseData);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  //response.end("Hello, World!");
  responseData ? response.end(responseData) : response.end();
  //put jsonstringified of that object
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};




// if (req.method === 'OPTIONS') {
//       console.log('!OPTIONS');
//       var headers = {};
//       // IE8 does not allow domains to be specified, just the *
//       // headers["Access-Control-Allow-Origin"] = req.headers.origin;
//       headers["Access-Control-Allow-Origin"] = "*";
//       headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
//       headers["Access-Control-Allow-Credentials"] = false;
//       headers["Access-Control-Max-Age"] = '86400'; // 24 hours
//       headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
//       res.writeHead(200, headers);
//       res.end();
// } else {
// //...other requests
// }
