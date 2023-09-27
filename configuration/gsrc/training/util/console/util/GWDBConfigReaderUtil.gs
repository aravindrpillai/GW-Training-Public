package training.util.console.util

uses java.io.File
uses org.w3c.dom.Node
uses org.w3c.dom.Element
uses gw.api.util.ConfigAccess
uses gw.util.concurrent.LockingLazyVar
uses training.util.console.constants.Constants
uses javax.xml.parsers.DocumentBuilderFactory

/**
 * author : Aravind
 * date : 15 Sept 2022
 * desc : Class to read DB-Config file and keep it as properties
 */
class GWDBConfigReaderUtil {

  private static var _properties = LockingLazyVar.make(\-> GWDBConfigReaderUtil.loadProperties())
  private construct(){}

  /**
   * public function to get the property
   * @param key
   * @return
   */
  static function getProperty(key : String) : String{
    return _properties.get().getProperty(key)
  }

  /**
   * Function to load Properties
   */
  private static function loadProperties() : Properties {
    var dbConfigPath = ConfigAccess.getModuleRoot("configuration").Path+"/config/database-config.xml"
    var file = new File(dbConfigPath)
    var dbf = DocumentBuilderFactory.newInstance()
    var db = dbf.newDocumentBuilder()
    var document = db.parse(file)
    var databases = document.getElementsByTagName("database")
    var database : Node
    var connectionURlNode : Node
    var systemEnv = System.getProperty(Constants.SystemEnvironmentKey)
    var env : String
    var properties = new Properties()
    var foundConfig = false
    foreach(i in 0..|databases.Length){
      database = databases.item(i)
      env = (database as Element).getAttribute("env")
      if(not env.equalsIgnoreCase(systemEnv)){
        if(not ((env == null or env == "") and (systemEnv == null or systemEnv == ""))){
          continue
        }
      }
      connectionURlNode = (database as Element).getElementsByTagName("dbcp-connection-pool").item(0)
      properties.setProperty(Constants.NameKey, (database as Element).getAttribute("name"))
      properties.setProperty(Constants.TypeKey, (database as Element).getAttribute("dbtype"))
      properties.setProperty(Constants.EnvironmentKey, env)
      properties.setProperty(Constants.UrlKey, (connectionURlNode as Element).getAttribute("jdbc-url"))
      properties.setProperty(Constants.DriverKey, getDriver(properties.getProperty("type")))

      foundConfig = true
      break
    }

    if(not foundConfig){
      throw new Exception("No DB configuration found for env ( = ${systemEnv})")
    }
    return properties
  }

  /**
   * Function to get Driver
   * @param type
   * @return
   */
  private static function getDriver(type : String) : String {
    switch(type){
      case "h2" : return Constants.H2Driver
      case "oracle" : return Constants.OracleDriver
      case "sqlserver" : return Constants.SQLDriver
      default : throw new Exception("This database type (${type}) is not supported")
    }
  }

}