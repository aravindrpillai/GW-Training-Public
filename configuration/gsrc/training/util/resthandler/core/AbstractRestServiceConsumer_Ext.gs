package training.util.resthandler.core

uses gw.api.rest.exceptions.ServiceUnavailableException
uses gw.util.Pair
uses org.apache.commons.lang.CharEncoding
uses org.apache.commons.loginService.shaded.httpclient.URIException
uses org.apache.commons.loginService.shaded.httpclient.auth.CredentialsNotAvailableException
uses org.apache.http.HttpException
uses org.apache.http.NoHttpResponseException
uses org.apache.http.ProtocolException
uses org.apache.http.auth.InvalidCredentialsException
uses org.apache.http.client.config.RequestConfig
uses org.apache.http.client.methods.HttpGet
uses org.apache.http.client.methods.HttpPost
uses org.apache.http.client.utils.URIBuilder
uses org.apache.http.conn.ConnectTimeoutException
uses org.apache.http.conn.ConnectionPoolTimeoutException
uses org.apache.http.entity.ByteArrayEntity
uses org.apache.http.impl.client.HttpClientBuilder
uses org.apache.http.util.EntityUtils
uses training.util.logging.LoggerCategories_Ext
uses training.util.logging.Logger_Ext

/**
 * author : Aravind R Pillai
 * date   : 06 May 2022
 * desription : Class to consume RESTful services
 */
abstract class AbstractRestServiceConsumer_Ext {

  private var _socketTimeout : Integer as SocketTimeout
  private var _connectTimeout : int as ConnectTimeout
  private var _connectionRequestTimeout : int as ConnectionRequestTimeout
  private var _responseCode : int as ResponseCode = 200
  public var _error : Exception as Error = null

  private enum SERVICE_PROTOTYPE {POST, GET}

  abstract function setLoggerCategory() : LoggerCategories_Ext
  abstract function setServiceURL() : String
  abstract function setServicePayload() : String
  abstract function setServiceHeaders() : Map<String, String>
  abstract function setServiceCredentials() : Pair<String, String>


  /**
   * Functiont to make the GET servicr call
   *
   * @return the get response
   */
  function doGet() : String {
    var restLogger = new Logger_Ext(AbstractRestServiceConsumer_Ext, setLoggerCategory())
    restLogger.info("Sending HTTP GET Request", "executeHttpGet")
    restLogger.debug("Timeouts | Socket: " + SocketTimeout + " | Connect: " + ConnectTimeout + " | ConnectionReq: " + ConnectionRequestTimeout)
    try {
      validate(GET)
      var client = HttpClientBuilder.create().build()
      var uri = new URIBuilder(setServiceURL())
      var headers = setServiceHeaders()
      if (headers != null) {
        headers.eachKeyAndValue(\key, value -> {
          uri.addParameter(key, value)
        })
      }
      var httpRequest = new HttpGet(uri.build())
      var credentials = setServiceCredentials()
      if (credentials != null) {
        var username = credentials.First
        var password = credentials.Second
        var encoding = Base64.getEncoder().encodeToString("${username}:${password}".getBytes(CharEncoding.UTF_8))
        httpRequest.addHeader("Authorization", "Basic " + encoding)
      }
      var httpResponse = client.execute(httpRequest)
      _responseCode = httpResponse.StatusLine.StatusCode
      restLogger.debug("Service Response Code: " + _responseCode)
      if (_responseCode < 200 or _responseCode > 299) {
        _error = new Exception(httpResponse?.StatusLine?.ReasonPhrase)
        restLogger.debug("Service Response Message: " + _error?.Message)
      }
      var httpentity = httpResponse.Entity
      var responseData = EntityUtils.toString(httpentity, CharEncoding.UTF_8)
      return responseData
    } catch (excep : URIException) {
      _error = excep
    } catch (excep : NoHttpResponseException) {
      _error = excep
    } catch (excep : ConnectionPoolTimeoutException) {
      _error = excep
    } catch (excep : ConnectTimeoutException) {
      _error = excep
    } catch (excep : InvalidCredentialsException) {
      _error = excep
    } catch (excep : ProtocolException) {
      _error = excep
    } catch (excep : CredentialsNotAvailableException) {
      _error = excep
    } catch (excep : HttpException) {
      _error = excep
    } catch (excep : ServiceUnavailableException) {
      _error = excep
    } catch (excep : Exception) {
      _error = excep
    }

    if (_error != null) {
      restLogger.error("Request failed : Reason - " + _error.Message)
    }
    return null
  }


  /**
   * Function used to consume Restful POST Services.
   *
   * @return : string payload
   */
  function doPost() : String {
    var restLogger = new Logger_Ext(AbstractRestServiceConsumer_Ext, setLoggerCategory())
    restLogger.info("Sending HTTP POST Request", "doPost")
    restLogger.debug("SocketTimeout: " + SocketTimeout + " | ConnectTimeout: " + ConnectTimeout + " | ConnectionRequestTimeout: " + ConnectionRequestTimeout)
    try {
      validate(POST)
      var httpRequest = new HttpPost(new URIBuilder(setServiceURL()).build())
      var requestConfig = RequestConfig.copy(RequestConfig.DEFAULT)
          .setSocketTimeout(_socketTimeout)
          .setConnectTimeout(_connectTimeout)
          .setConnectionRequestTimeout(_connectionRequestTimeout)
          .build()
      httpRequest.setConfig(requestConfig)
      var headers = setServiceHeaders()
      if (headers != null) {
        headers.eachKeyAndValue(\key, value -> {
          httpRequest.addHeader(key, value)
        })
      }
      var credentials = setServiceCredentials()
      if (credentials != null) {
        var username = credentials.First
        var password = credentials.Second
        var encoding = Base64.getEncoder().encodeToString("${username}:${password}".getBytes(CharEncoding.UTF_8))
        httpRequest.addHeader("Authorization", "Basic " + encoding)
      }
      httpRequest.setEntity(new ByteArrayEntity(setServicePayload().getBytes(CharEncoding.UTF_8)))
      var httpResponse = HttpClientBuilder.create().build().execute(httpRequest)
      _responseCode = httpResponse.StatusLine.StatusCode
      restLogger.debug("Service Response Code: " + _responseCode)
      if (_responseCode < 200 or _responseCode > 299) {
        _error = new Exception(httpResponse?.StatusLine?.ReasonPhrase)
        restLogger.debug("Service Response Message: " + _error?.Message)
      }
      var responseData = EntityUtils.toString(httpResponse.Entity, CharEncoding.UTF_8)
      return responseData
    } catch (excep : URIException) {
      _error = excep
    } catch (excep : NoHttpResponseException) {
      _error = excep
    } catch (excep : ConnectionPoolTimeoutException) {
      _error = excep
    } catch (excep : ConnectTimeoutException) {
      _error = excep
    } catch (excep : InvalidCredentialsException) {
      _error = excep
    } catch (excep : ProtocolException) {
      _error = excep
    } catch (excep : CredentialsNotAvailableException) {
      _error = excep
    } catch (excep : HttpException) {
      _error = excep
    } catch (excep : Exception) {
      _error = excep
    }
    if (_error != null) {
      restLogger.error("Request failed : Reason - " + _error.Message)
    }
    return null
  }

  /**
   * Function to validate the request
   *
   * @param prototype
   */
  private function validate(prototype : SERVICE_PROTOTYPE) {
    if (setServiceURL() == null) {
      throw new URIException("Invalid or No URL Defined")
    }
    var credentials = setServiceCredentials()
    if (credentials != null) {
      var username = credentials.First
      var password = credentials.Second
      if (username == null or password == null) {
        throw new CredentialsNotAvailableException("Invalid or No Credentials Defined")
      }
    }
  }

}
