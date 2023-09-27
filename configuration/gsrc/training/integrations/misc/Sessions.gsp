
var request = com.guidewire.integration.IntegrationUtil.getScopingRequest()

request.Session.setAttribute("key","value")

var value = request.Session.getAttribute("key")