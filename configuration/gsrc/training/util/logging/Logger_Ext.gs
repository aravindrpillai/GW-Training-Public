package training.util.logging

uses gw.plugin.util.CurrentUserUtil
uses org.slf4j.LoggerFactory

/**
 * Created by Aravind R Pillai
 * Date : 06 May, 2022
 * Logger framework
 */
class Logger_Ext extends gw.pl.logging.LoggerCategory {

  var _transactionID : String as TransactionID = null
  var _className : String as ClassName = null
  var logger : org.slf4j.Logger as Logger = null

  construct(className : Class, cat : LoggerCategories_Ext, transactionID : String = null) {
    _transactionID = transactionID == null ? UUID.randomUUID().toString() : transactionID
    _className = className.getSimpleName()
    logger = LoggerFactory.getLogger(cat.Code)
  }

  /**
   * @param message
   * @param functionName
   */
  function info(message : String, functionName : String = null) {
    var log = formatText(functionName, message)
    print(log)
    logger.info(log)
  }

  /**
   * @param message
   * @param functionName
   */
  function debug(message : String, functionName : String = null) {
    print(formatText(functionName, message))
    if (logger.DebugEnabled) {
      var log = formatText(functionName, message)
      logger.debug(log)
    }
  }

  /**
   * @param message
   * @param functionName
   */
  function warn(message : String, functionName : String = null) {
    var log = formatText(functionName, message)
    print(log)
    logger.warn(log)
  }

  /**
   * @param message
   * @param functionName
   */
  function error(message : String, functionName : String = null) {
    var log = formatText(functionName, message)
    print(log)
    logger.error(log)
  }

  /**
   * @param message
   * @param functionName
   */
  function trace(message : String, functionName : String = null) {
    var log = formatText(functionName, message)
    print(log)
    logger.trace(log)
  }

  /**
   * @param functionName
   * @param message
   * @return
   */
  private function formatText(functionName : String, message : String) : String {
    var ret = new StringBuilder()
    var user = CurrentUserUtil.CurrentUser.User
    var username = (user == null) ? "Unknown User" : user.DisplayName + "(" + user.Credential.UserName + ")"
    ret.append(username + " : " + _className)
    if (functionName != null) {
      ret.append(" : " + functionName)
    }
    if (_transactionID != null) {
      ret.append(" : " + _transactionID)
    }
    ret.append(" : " + message)
    return ret.toString()
  }

}