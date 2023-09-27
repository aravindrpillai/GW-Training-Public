package training.util.resthandler.core

uses gw.util.Pair
uses training.util.logging.LoggerCategories_Ext

/**
 * author : Aravind R Pillai
 * date   : 06 May 2022
 * desription : Base class to consume restful webservce. (class contains default impls)
 */
abstract class RestServiceConsumerBase_Ext extends AbstractRestServiceConsumer_Ext {

  construct() {
    SocketTimeout = 20000
    ConnectTimeout = 20000
    ConnectionRequestTimeout = 20000
  }

  /**
   * Function to define the logger category
   * Default will be RestWS
   *
   * @return
   */
  override function setLoggerCategory() : training.util.logging.LoggerCategories_Ext {
    return LoggerCategories_Ext.REST_WEBSERVICES
  }

  /**
   * Function sets the default payload.
   * Override this function if a new payload need to be set
   * @return
   */
  function setServicePayload(): String{
    return "{}"
  }

  /**
   * Function to set the headers.
   * Default headers are set here.
   * NOTE - If the function is overwritten, make sure to modify on top of this data
   * @return
   */
  function setServiceHeaders(): Map<String, String>{
    return new HashMap<String, String>(){
        "accept" -> "*/*",
        "Connection" -> "keep-alive"
    }
  }

  /**
   * Function defines the OOTB credentials.
   * @return
   */
  function setServiceCredentials(): Pair<String, String> {
    return new Pair<String, String>("su","gw")
  }

}
