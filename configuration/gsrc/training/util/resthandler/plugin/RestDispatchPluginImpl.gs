package training.util.resthandler.plugin

uses gw.api.rest.RequestContext
uses gw.api.rest.Response
uses gw.api.exception.ErrorInfo
uses training.util.logging.LoggerCategories_Ext
uses training.util.logging.Logger_Ext

/**
 * author : Aravind R Pillai
 * date   : 06 May 2022
 * desription : Class to handle RESTful services before and after processing
 */
class RestDispatchPluginImpl implements gw.api.rest.IRestDispatchPlugin {

  private var _logger : Logger_Ext

  construct(){
    _logger = new Logger_Ext(RestDispatchPluginImpl, LoggerCategories_Ext.REST_WEBSERVICES)
  }

  /**
   * Function where the control hits first
   * @param requestContext
   */
  override function handleReceiveRequest(requestContext : RequestContext) {
    _logger.trace("REST Request: " + requestContext.getOperation())
  }

  /**
   * Function where the control comes post executing "handleReceiveRequest
   * @param requestContext
   * @param user
   */
  override function handlePreExecute(requestContext : RequestContext, user : entity.User) {
  }

  /**
   * Function will be executed once the custom service class is executed, control comes here
   * @param requestContext
   * @param response
   * @return
   */
  override function rewriteResponse(requestContext : RequestContext, response : Response) : Response {
    return response
  }

  /**
   * In case of Error, it comes directly here.
   * Here we can modify the error content if needed
   * @param requestContext
   * @param errorInfo
   * @return
   */
  override function rewriteErrorInfo(requestContext : RequestContext, errorInfo : ErrorInfo) : ErrorInfo {
    switch ((errorInfo.getErrorCode() == null) ? "" : errorInfo.getErrorCode()) {
      case "gw.api.rest.exceptions.NotAuthorizedException":
        errorInfo.withDisplayKey("Java.REST.Runtime.Error.NotAuthorizedUserMessage")
        errorInfo.withHttpStatus(403)
        break
      case "gw.api.rest.exceptions.RestAuthenticationException":
        errorInfo.withDisplayKey("Java.Login.CommonMessage")
        errorInfo.withHttpStatus(401)
        break
    }
    return errorInfo
  }

  /**
   * Post executing the "rewriteErrorInfo", control comes here to format the response (in case of error)
   * @param requestContext
   * @param response
   * @return
   */
  override function rewriteErrorResponse(requestContext : RequestContext, response : Response) : Response {
    return response
  }

  /**
   * At the very end, control comes to this function
   * @param request
   * @param elapsedMs
   * @param response
   * @param operationError
   * @param serializedResponse
   * @param serializationError
   * @param writeException
   */
  override function handleRequestProcessed(request : RequestContext, elapsedMs : long, response : Response,
                                           operationError : ErrorInfo, serializedResponse : Response,
                                           serializationError : ErrorInfo, writeException : Throwable) {
    if (writeException != null) {
      _logger.error("Write Exception occured - " + writeException.Message)
    } else if (serializationError != null) {
      _logger.error("Serialiazation Exception occured - " + serializationError.Message)
    } else if (operationError == null) {
      _logger.error("Operation Exception occured - " + operationError.Message)
    } else if (operationError.getHttpStatus() >= 400 && operationError.getHttpStatus() < 500) {
      _logger.error("Non 200 Exception occured - Code: " + operationError.getHttpStatus())
    } else {
      _logger.trace("Processed successfully in " + elapsedMs + " ms.")
    }
  }

}