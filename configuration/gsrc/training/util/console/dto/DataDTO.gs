package training.util.console.dto

/**
 * author : aravind
 * date : 15 Sept 2022
 * DTO for the response
 */
class DataDTO {

  var _isDataUpdate : boolean as IsDataUpdate = false

  //Below field is used during data update
  var _rowsAffectedCound : int as RowsAffectedCount = 0

  //_fields keep all the fields
  var _fields : LinkedList<String> as Fields

  //_values keep all the values as each array
  var _values : LinkedList<LinkedList<String>> as Values

}