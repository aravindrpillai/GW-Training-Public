package training.integrations.documents.upload

uses gw.util.Pair
uses org.apache.commons.io.IOUtils
uses training.integrations.documents.Constants_Ext
uses training.util.logging.LoggerCategories_Ext
uses training.util.logging.Logger_Ext
uses training.util.properties.conventional.PropertyReader_Ext
uses training.util.resthandler.core.RestServiceConsumerBase_Ext

uses java.io.InputStream

/**
 * Author : Aravind R Pillai
 * Date   : 06 May, 2022
 * Desc   : Service layer for document upload
 */
class DocumentUploadService_Ext extends RestServiceConsumerBase_Ext {

  private var _content : InputStream = null
  private var _document : Document = null
  private var _logger : Logger_Ext
  private var _loggerCategory = LoggerCategories_Ext.DOCUMENTS

  construct(content : InputStream, document : Document) {
    _content = content
    _document = document
    _logger = new Logger_Ext(DocumentUploadService_Ext, _loggerCategory)
  }

  /**
   * Function to define the logger category
   * All associated logs will be written in that log file
   *
   * @return Category of Log
   */
  override function setLoggerCategory() : LoggerCategories_Ext {
    return _loggerCategory
  }

  /**
   * Function to define the service URL
   * @return URL as String
   */
  override function setServiceURL() : String {
    var systemID = _document.PublicID
    var baseURL = PropertyReader_Ext.getProperty("integration.documents.base.url")
    var fullURL = baseURL.concat("/items/").concat(systemID).concat("/uploadBase64")
    return fullURL
  }

  /**
   * Function to define the headers for the service (if any)
   * In case of NO specific headers - Do not extend this function
   * @return Headers as Map<String, String>
   */
  override function setServiceHeaders() : Map<String, String> {
    var headers = super.setServiceHeaders()
    var serviceBackendKeyValue = PropertyReader_Ext.getProperty("integration.documents.upload.servicebackendkey")
    headers.put(Constants_Ext.SERVICE_HEADER_BACKEND_KEY, serviceBackendKeyValue)
    headers.put("Content-Type", "multipart/form-data")
    return headers
  }

  /**
   * Function to define the credentials of the service
   * In case of NO credentials - return NULL
   * @return Credentials as Pair<String, String>
   */
  override function setServiceCredentials() : Pair<String, String> {
    var username = PropertyReader_Ext.getProperty("integration.documents.upload.username")
    var password = PropertyReader_Ext.getProperty("integration.documents.upload.password")
    return new Pair<String, String>(username, password)
  }

  /**
   * Function to define the payload.
   * for empty payload - return NULL.
   * Base class returns '{}' by default
   * @return Payload as String
   */
  override function setServicePayload() : String {
    var doc64 = Base64.Encoder.encodeToString(IOUtils.toByteArray(_content))
    print("BASE64 OP : " + doc64.toString())
    return '{"AccountNumber": "5355146603"}'
  }

  /**
   * Function to make the service call.
   * doPost() / doGet() specifies the protype of the call.
   * these functions will return the response (in string format)
   */
  function execute() {
    _logger.trace("Starting to make service call")
    var response = super.doPost()
    _logger.debug("Response : " + response)
    _logger.debug("Response Code : " + super.ResponseCode)
    _logger.debug("Error (if any) : " + super.Error)
    _logger.trace("Service call done.")
  }
}