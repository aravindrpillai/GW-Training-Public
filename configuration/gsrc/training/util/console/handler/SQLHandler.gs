package training.util.console.handler

uses java.sql.ResultSet
uses java.sql.Connection
uses org.apache.log4j.Logger
uses gw.api.util.DisplayableException
uses training.util.console.dto.DataDTO
uses training.util.console.dao.ConsoleRegister
uses training.util.console.constants.Constants
uses training.util.console.util.GWDatabaseUtil
uses training.util.console.util.ConsolePermissionUtil

/**
 * author : Aravind
 * date : 15 Sept 2022
 * desc : JDBC connection class
 */
public class SQLHandler {

  static final var _logger = Logger.getLogger(SQLHandler)

  /**
   * Function to execute the SQL Query
   * @param query
   * @return
   */
  function executeQuery(query: String) : DataDTO {
    _logger.info("Starting SQL Query execution")
    if(query == null or query == ""){
      throw new DisplayableException("Console is empty.")
    }
    _logger.debug("Query : "+query)
    if(query.containsIgnoreCase("devconsolehistory") and Constants.DisableOperationsOnMasterTable){
      throw new DisplayableException("Access to master table is denied. To view the content you can use the history tab")
    }
    var dataDTO : DataDTO
    var isUpdateQuery = false
    var error : Exception = null
    var rowsAffected = 0
    var dbInstance = new GWDatabaseUtil()
    var conn : Connection

    //Select Query
    try {
      conn = dbInstance.createConnection()
      var rs = conn.createStatement().executeQuery(query)
      dataDTO = handleSelectQueryResponse(rs)
    } catch (err : Exception) {
      if(err.Message.containsIgnoreCase("Method is only allowed for a query")){
        _logger.info("This is an update statement")
        isUpdateQuery = true
      }else{
        _logger.error("Select Query Failed - " + err.StackTraceAsString)
        error = err
      }
    }finally{
      if(conn != null){
        conn.close()
      }
    }

    //Update Query
    if(isUpdateQuery){
      if(ConsolePermissionUtil.Instance.DoesUserHaveFullPermission) {
        _logger.info("Executing Update")
        error = null
        try {
          conn = dbInstance.createConnection()
          rowsAffected = conn.createStatement().executeUpdate(query)
          dataDTO = handleUpdateQueryResponse(rowsAffected)
        } catch (err : Exception) {
          error = err
          _logger.error("Update Query Failed - " + err.StackTraceAsString)
        } finally {
          if (conn != null) {
            conn.close()
          }
        }
      }else{
        _logger.info("User doesnt have update permission")
        error = new Exception("Update/Delete operations are denied for this user.")
      }
    }

    //Create history
    new ConsoleRegister().registerForSQL(query, isUpdateQuery, error, rowsAffected)
    if(error != null){
      throw new DisplayableException(error.Message)
    }

    _logger.info("Query execution ended.")
    return dataDTO
  }


  /**
   * Function to handle the Select Query response
   * @param rs
   * @return
   */
  private function handleSelectQueryResponse(rs :  ResultSet) :  DataDTO {
    var columns = new LinkedList<String>()
    foreach (i in 1..rs.MetaData.ColumnCount){
      columns.add(rs.MetaData.getColumnName(i))
    }

    //Building Data
    var rows = new LinkedList<LinkedList<String>>()
    var eachRowData : LinkedList<String>
    while (rs.next()) {
      eachRowData = new LinkedList<String>()
      foreach(i in 1..rs.MetaData.ColumnCount){
        eachRowData.add(rs.getString(rs.MetaData.getColumnName(i)))
      }
      rows.add(eachRowData)
    }

    //Building DTO for response
    var dataDTO = new DataDTO()
    dataDTO.Fields = columns
    dataDTO.Values = rows
    return dataDTO
  }

  /**
   * Function to handle Data update response
   * @param affectedCount
   * @return
   */
  private function handleUpdateQueryResponse(affectedCount: int) : DataDTO {
    var dataDTO = new DataDTO()
    dataDTO.RowsAffectedCount = affectedCount
    dataDTO.IsDataUpdate = true
    return dataDTO
  }


}
