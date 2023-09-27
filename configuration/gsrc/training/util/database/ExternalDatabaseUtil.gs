package training.util.database

uses training.util.logging.LoggerCategories_Ext
uses training.util.properties.conventional.PropertyReader_Ext
uses gw.util.concurrent.LockingLazyVar
uses training.util.logging.Logger_Ext
uses java.sql.PreparedStatement
uses java.sql.DriverManager
uses java.sql.Connection
uses java.lang.*

/**
 * author : Aravind R Pillai
 * date : 25 April 2022
 * Class to connect to External Database
 */
class ExternalDatabaseUtil {

  final private var _DRIVER = PropertyReader_Ext.getProperty("integration.database.driver")
  final private var _URL = PropertyReader_Ext.getProperty("integration.database.url")
  final private var _USERNAME = PropertyReader_Ext.getProperty("integration.database.username")
  final private var _PASSWORD = PropertyReader_Ext.getProperty("integration.database.password")
  private var _logger : Logger_Ext
  private static var _lazyClassInstance = LockingLazyVar.make(\-> new ExternalDatabaseUtil())
  public var dbConnection : Connection as DBConnection = null

  /**
   * Private constructor to avoid creation of instances.
   * Creates singleton instance by using LockingLazyVar
   */
  private construct() {
    _logger = new Logger_Ext(ExternalDatabaseUtil, LoggerCategories_Ext.GENERAL)
  }

  /**
   * Function to return the class instance
   *
   * @return : this class instance
   */
  static property get Instance() : ExternalDatabaseUtil {
    var inst = _lazyClassInstance.get()
    return inst
  }


  /**
   * Private function to establish the connection
   */
  private function connect() {
    try {
      Class.forName(_DRIVER)
      DBConnection = DriverManager.getConnection(_URL, _USERNAME, _PASSWORD)
    } catch (e : Exception) {
      _logger.error(e.StackTraceAsString)
      throw e
    }
  }


  /**
   * Functio to read from database
   *
   * @param statement
   * @return
   */
  function read(statement : PreparedStatement, keepConnectionOpen : boolean = false) : java.sql.ResultSet {
    try {
      if (DBConnection == null) {
        connect()
      }
      var data = statement.executeQuery()
      if(keepConnectionOpen){
        closeConnection()
      }
      return data
    } catch (ex : Exception) {
      _logger.error(ex.StackTraceAsString)
      if(keepConnectionOpen){
        closeConnection()
      }
      throw ex
    }

  }


  /**
   * Function to write to database
   *
   * @param query
   */
  function write(query : String, keepConnectionOpen : boolean = false) : void {
    try {
      if (DBConnection == null) {
        connect()
      }
      DBConnection.createStatement().executeUpdate(query)
      if(not keepConnectionOpen){
        closeConnection()
      }
    } catch (e : Exception) {
      _logger.error(e.StackTraceAsString)
      if(not keepConnectionOpen){
        closeConnection()
      }
      throw e
    }
  }

  /**
   * Function to close the connection
   */
  function closeConnection() {
    try {
      if (DBConnection != null) {
        DBConnection.close()
        DBConnection = null
      }
    } catch (e : Exception) {
      _logger.error(e.StackTraceAsString)
    }
  }


  /**
   * Sample test function to read and write to database
   */
  function test() {
    try {
      var dbInstance = ExternalDatabaseUtil.Instance

      //For writing
      var sqlInsertQuery1 = "INSERT INTO person (name, age) VALUES ('Aravind', 27)"
      var sqlInsertQuery2 = "INSERT INTO person (name, age) VALUES ('Hari', 24)"
      var sqlInsertQuery3 = "INSERT INTO person (name, age) VALUES ('Onkar', 23)"
      var sqlInsertQuery4 = "INSERT INTO person (name, age) VALUES ('Shiva', 20)"
      dbInstance.write(sqlInsertQuery1, true)
      dbInstance.write(sqlInsertQuery2, true)
      dbInstance.write(sqlInsertQuery3, true)
      dbInstance.write(sqlInsertQuery4, true)
      dbInstance.closeConnection()

      //For Reading
      var sql = "SELECT photo FROM person WHERE name='?' AND age=?"
      var statement = dbInstance.DBConnection.prepareStatement(sql)
      statement.setString(1, "Aravind")
      statement.setInt(2, 27)
      var result = dbInstance.read(statement, false)
      print("Name  : " + result.getString("name"))
      print("Age : " + result.getInt("age"))

    } catch (e : Exception) {
      _logger.error(e.StackTraceAsString)
    }
  }


}