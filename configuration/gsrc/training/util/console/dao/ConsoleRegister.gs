package training.util.console.dao

uses org.apache.log4j.Logger
uses training.util.console.util.WebRequestUtil
uses training.util.console.constants.Constants

/**
 * autor : Aravind
 * date : 29 Sept 2022
 * <p>
 * Class to handle the Console request
 * All Data update requests will be stored in DB.
 * For all non data updates, the flag in constants class must be turned off | By default its on
 */
class ConsoleRegister {

  private static final var _logger = Logger.getLogger(ConsoleRegister)

  /**
   * Function to register new SQL request
   *
   * @param content
   * @param dataManipulated
   */
  function registerForSQL(content : String, dataManipulated : boolean, error : Exception, rowsAffected:int =0) {
    var keepHistoryForSQLDataManipulationsAlone = Constants.TrackOnlySQLDataUpdates
    if (keepHistoryForSQLDataManipulationsAlone and !dataManipulated) {
      _logger.debug("Ignoring new registry for SQL data console request - No DataUpdate")
      return
    }
    _logger.debug("Adding new registry for SQL data console request")
    var currentUser = User.util.CurrentUser
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var register = bundle.add(new DevConsoleHistory())
      register.ClientIP = WebRequestUtil.ClientIP
      register.ExecutedTime = Date.Now
      register.Content = new Blob(content.Bytes)
      register.IsSQLQuery = true
      register.RowsAffected = rowsAffected
      register.UserExecuted = currentUser
      register.DataManipulated = dataManipulated
      register.ErrorMessage = error?.Message
      register.ExecutionFailed = (error != null)
    }, Constants.DBUser)
    _logger.debug("Added new sql request")
  }

  /**
   * Function to register new GOSU request
   *
   * @param content
   * @param dataManipulated
   */
  function registerForGosu(content : String, dataManipulated : boolean, error : Exception) {
    var keepHistoryForGOSUDataManipulationsAlone = Constants.TrackOnlyGosuDataUpdates
    if (keepHistoryForGOSUDataManipulationsAlone and !dataManipulated) {
      _logger.debug("Ignoring new registry for GOSU data console request - No DataUpdate")
      return
    }
    _logger.debug("Adding new registry for GOSU data console request")
    var currentUser = User.util.CurrentUser
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var register = bundle.add(new DevConsoleHistory())
      register.ClientIP = WebRequestUtil.ClientIP
      register.ExecutedTime = Date.Now
      register.Content = new Blob(content.Bytes)
      register.IsSQLQuery = false
      register.UserExecuted = currentUser
      register.DataManipulated = dataManipulated
      register.ErrorMessage = error?.Message == null ? error?.StackTraceAsString?.substring(0, 200) : error?.Message
      register.ExecutionFailed = (error != null)
    }, Constants.DBUser)
    _logger.debug("Added new gosu request")
  }


}