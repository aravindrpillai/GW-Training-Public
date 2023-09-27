package training.util.console.util

uses javax.servlet.http.HttpServletRequest

/**
 * author : Aravind
 * date : 20 Sept 2022
 * Class to handle all utilities for Developer console
 */
class WebRequestUtil {

  /**
   * Private function to get Client IP address
   * @return
   */
  static property get ClientIP() : String {
    var request = WebRequest
    var xForwardedForHeader = request.getHeader("X-Forwarded-For")
    if (xForwardedForHeader == null) {
      return request.getRemoteAddr()
    } else {
      return new StringTokenizer(xForwardedForHeader, ",").nextToken().trim()
    }
  }

  /**
   * Function to get the HTTP Request
   * @return
   */
  static property get WebRequest() : HttpServletRequest {
    var request = com.guidewire.integration.IntegrationUtil.getScopingRequest()
    if (request == null) {
      throw new IllegalStateException("There is no current request or session.")
    }
    return request
  }

}