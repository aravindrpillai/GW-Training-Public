package training.integrations.rest.consume

class RestConsume_Ext extends training.util.resthandler.core.RestServiceConsumerBase_Ext {

  override function setLoggerCategory() : training.util.logging.LoggerCategories_Ext {
    return training.util.logging.LoggerCategories_Ext.GENERAL
  }

  override function setServiceURL() : String {
    return "http://localhost:8180/pc/rest/Account/Search"
  }

  override function setServiceHeaders() : Map<String, String> {
    var defaultHeaders = super.setServiceHeaders()
    defaultHeaders.put("Content-Type", "application/json")
    return defaultHeaders
  }

  override function setServiceCredentials() : gw.util.Pair<String, String> {
    return new gw.util.Pair("su", "gw")
  }

  override function setServicePayload():String{
    var payload = '{"AccountNumber": "5355146603"}'
    return payload
  }

  function makeServiceCall(){
    print("Starting to make service call")
    var response = doPost()
    print("Response : "+response)
    print("Response Code : "+ ResponseCode)
    print("Error (if any) : "+ Error)
  }
}