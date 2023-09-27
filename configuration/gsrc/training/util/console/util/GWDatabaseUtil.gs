package training.util.console.util

uses java.sql.Connection
uses java.sql.SQLException
uses java.sql.DriverManager
uses org.apache.log4j.Logger
uses training.util.console.constants.Constants

/**
 * author : Aravind
 * date : 11 Sept 2022
 *
 * Class for DB Operations
 */
class GWDatabaseUtil {

  private static final var jdbcDriver = GWDBConfigReaderUtil.getProperty(Constants.DriverKey)
  private static final var jdbcURL = GWDBConfigReaderUtil.getProperty(Constants.UrlKey)
  static final var _logger = Logger.getLogger(GWDatabaseUtil)


  static property get Instance() : GWDatabaseUtil {
    return new GWDatabaseUtil()
  }

  /**
   * Private function to create the DB connection
   * @return
   */
  function createConnection() : Connection {
    _logger.info("Starting JDBC Connection")
    var databaseConnection : Connection = null
    try {
      Class.forName(jdbcDriver).newInstance()
      databaseConnection = DriverManager.getConnection(jdbcURL)
    } catch (ie : InstantiationException) {
      _logger.error("Error loading JDBC driver : " + ie.StackTraceAsString)
      throw ie
    } catch (ie : IllegalAccessException) {
      _logger.error("Error loading JDBC driver : " + ie.StackTraceAsString)
      throw ie
    } catch (sqlE : SQLException) {
      _logger.error("Error initialising JDBC Connection : " + sqlE.StackTraceAsString)
      throw sqlE
    }catch(e : Exception) {
      _logger.error("Error In getting connection : " + e.StackTraceAsString)
      throw e
    }
    _logger.info("DB Connection Established")
    return databaseConnection
  }
}