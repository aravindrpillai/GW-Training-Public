package training.util.console.dto

/**
 * author : aravind
 * date : 15 Sept 2022
 * DTO for the response
 */
class HistoryDTO {

  /**
   * Parameterless initilization disabled
   */
  private construct(){}

  /**
   * @param record
   * constructor to map DevConsole history data
   */
  construct(record : DevConsoleHistory) {
    ExecutedTime = record.ExecutedTime
    Content = record.Content
    IsSQLQuery = record.IsSQLQuery
    ClientIP = record.ClientIP
    UserExecuted = record.UserExecuted
    DataManipulated = record.DataManipulated
    RowsAffected = record.RowsAffected
    ExecutionFailed = record.ExecutionFailed
    ErrorMessage = record.ErrorMessage
    IsPurgedData = false
  }

  /**
   * Constructor to map purged data
   * @param record
   */
  construct(record : DevConsoleHistoryPurged) {
    ExecutedTime = record.ExecutedTime
    Content = record.Content
    IsSQLQuery = record.IsSQLQuery
    ClientIP = record.ClientIP
    UserExecuted = record.UserExecuted
    DataManipulated = record.DataManipulated
    RowsAffected = record.RowsAffected
    ExecutionFailed = record.ExecutionFailed
    ErrorMessage = record.ErrorMessage
    IsPurgedData = true
  }

  var _executedTime : Date as ExecutedTime
  var _content : Blob as Content
  var _isSQLQuery : boolean as IsSQLQuery
  var _clientIP : String as ClientIP
  var _userExecuted : User as UserExecuted
  var _dataManipulated : boolean as DataManipulated
  var _rowsAffected : Integer as RowsAffected = 0
  var _executionFailed : boolean as ExecutionFailed
  var _errorMessage : String as ErrorMessage
  var _isPurgedData : boolean as IsPurgedData

}