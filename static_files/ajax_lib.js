(function (global) {

// Set up a namespace for our utility
var ajaxUtils = {};


// Returns an HTTP request object
function getRequestObject() {
  if (global.XMLHttpRequest) {
    return (new XMLHttpRequest());
  }
  else if (global.ActiveXObject) {
    // For very old IE browsers (optional)
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  }
  else {
    global.alert("Ajax is not supported!");
    return(null);
  }
}


// Makes an Ajax GET request to 'requestUrl'
ajaxUtils.sendGetRequest =
  function(requestUrl, responseHandler,data) {
    var request = getRequestObject();
    request.onreadystatechange =
      function() {
        handleResponse(request, responseHandler);
      };
    request.open("POST", requestUrl, true);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    dataString="";
    var counter = 0;
    for (key in data){
    if (counter!=0){
      dataString+="&";
    };
    dataString += key+"="+data[key];
    counter++;
    };
    console.log(dataString);
    request.send(dataString); // for POST only
  };


// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
function handleResponse(request,
                        responseHandler) {
  if ((request.readyState == 4) &&
     (request.status == 200)) {
    responseHandler(request);
  }
}


// Expose utility to the global object
global.$ajaxUtils = ajaxUtils;


})(window);