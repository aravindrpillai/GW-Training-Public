package training.util.console.handler

uses gw.api.database.Query
uses gw.api.database.Relop
uses org.apache.log4j.Logger
uses training.util.console.dto.HistoryDTO

/**
 * author : Aravind
 * date : 28 Sept 2022
 * Class to perform the history search
 */
class ConsoleHistoryHandler implements java.io.Serializable {

  private var _executedTime : Date as ExecutedTime = Date.Now
  private var _codeType : String as CodeType = null
  private var _failedType : String as FailedType = null
  private var _queryType : String as QueryType = null
  private var _readFromPurgeTableAlso : boolean as ReadFromPurgeTableAlso = false
  private static final var _logger = Logger.getLogger(ConsoleHistoryHandler)

  /**
   * Funtion to perform the search
   * @return
   */
  function performSearch() : List<HistoryDTO> {

    var histories = Query.make(DevConsoleHistory)
    var historiesPurged : Query<DevConsoleHistoryPurged>

    var startDate = _executedTime.trimToMidnight()
    var endDate = _executedTime.addDays(1).trimToMidnight()
    histories.between(DevConsoleHistory#ExecutedTime, startDate, endDate)
    if(_readFromPurgeTableAlso){
      historiesPurged = Query.make(DevConsoleHistoryPurged)
      historiesPurged.between(DevConsoleHistory#ExecutedTime, startDate, endDate)
    }
    if (_codeType != null) {
      _logger.debug("Code type is : "+_codeType)
      var isSQL = _codeType == "SQL Only"
      histories.compare(DevConsoleHistory#IsSQLQuery, Relop.Equals, isSQL)
      if(_readFromPurgeTableAlso){
        historiesPurged.compare(DevConsoleHistory#IsSQLQuery, Relop.Equals, isSQL)
      }
    }

    if (_queryType != null) {
      _logger.debug("Query type is : "+_queryType)
      var isDataMaipulated = _queryType == "Data Manipulations Only"
      histories.compare(DevConsoleHistory#DataManipulated, Relop.Equals, isDataMaipulated)
      if(_readFromPurgeTableAlso){
        historiesPurged.compare(DevConsoleHistory#DataManipulated, Relop.Equals, isDataMaipulated)
      }
    }

    if (_failedType != null) {
      _logger.debug("Failed type is : "+_failedType)
      var failed = _failedType == "Failed"
      histories.compare(DevConsoleHistory#ExecutionFailed, Relop.Equals, failed)
      if(_readFromPurgeTableAlso){
        historiesPurged.compare(DevConsoleHistory#ExecutionFailed, Relop.Equals, failed)
      }
    }

    var resp = histories.select()
    var histList = new ArrayList<HistoryDTO>()
    foreach(r0 in resp){
      histList.add(new HistoryDTO(r0))
    }
    if(_readFromPurgeTableAlso){
      var respPurged = historiesPurged.select()
      foreach(r1 in respPurged){
        histList.add(new HistoryDTO(r1))
      }
    }
    _logger.debug("Found : " + histList.Count+" records")
    return histList
  }

}