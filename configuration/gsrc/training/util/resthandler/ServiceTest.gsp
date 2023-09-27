/**
 * Author : Aravind R Pillai
 * Date   : 06 May, 2022
 * Desc   : RESTFul WS configuration tutorial code
 * Note   : Put the correct url / payload / credentials
 * Trigger: new TestServiceClass().makeServiceCall()
 */
class TestServiceClass extends training.util.resthandler.core.RestServiceConsumerBase_Ext {

  /**
   * Function to define the logger category
   * All associated logs will be written in that log file
   * @return
   */
  override function setLoggerCategory() : training.util.logging.LoggerCategories_Ext {
    return training.util.logging.LoggerCategories_Ext.GENERAL
  }

  /**
   * Function to define the service URL
   * @return
   */
  override function setServiceURL() : String {
    return "http://localhost:8180/pc/rest/Account/Search"
  }

  /**
   * Function to define the headers for the service (if any)
   * In case of NO specific headers - Do not extend this function
   * @return
   */
  override function setServiceHeaders() : Map<String, String> {
    var defaultHeaders = super.setServiceHeaders()
    defaultHeaders.put("Content-Type", "application/json")
    return defaultHeaders
  }

  /**
   * Function to define the credentials of the service
   * In case of NO credentials - return NULL
   * @return
   */
  override function setServiceCredentials() : gw.util.Pair<String, String> {
    return new gw.util.Pair("su", "gw")
  }

  /**
   * Function to define the payload.
   * for empty payload - return NULL.
   * Base class returns '{}' by default
   * @return
   */
  override function setServicePayload():String{
    var payload = '{"AccountNumber": "5355146603"}'
    return payload
  }

  /**
   * Function to make the service call.
   * doPost() / doGet() specifies the protype of the call.
   * these functions will return the response (in string format)
   */
  function makeServiceCall(){
    print("Starting to make service call")
    var response = super.doPost()
    print("Response : " + response)
    print("Response Code : " + ResponseCode)
    print("Error (if any) : " + Error)
  }
}