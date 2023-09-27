package training.util.console.constants

/**
 * author :  Aravind#
 * date :  15 Sept 2022
 * Class to handle the constants
 */
class Constants {

  public static var _debugMode : boolean as DEBUG_MODE = true


  //Script Param Flags
  public static var _flag1 : boolean as DisableOperationsOnMasterTable = true

  public static var _systemEnv : String as SystemEnvironmentKey = "gw.cc.env"
  public static var _nameKey : String as NameKey = "name"
  public static var _typeKey : String as TypeKey = "type"
  public static var _environmentKey : String as EnvironmentKey = "environment"
  public static var _urlKey : String as UrlKey = "url"
  public static var _driverKey : String as DriverKey = "driver"

  public static var _dbUser : String as DBUser = "su"
  public static var _readOnlyRoleName : String as ReadOnlyRoleName = "Developer Console Read Role"
  public static var _readAndWriteRoleName : String as ReadAndWriteRoleName = "Developer Console Read And Write Role"

  public static var _h2driver : String as H2Driver = "org.h2.Driver"
  public static var _oracleDriver : String as OracleDriver = "oracle.jdbc.driver.OracleDriver"
  public static var _sqlDriver : String as SQLDriver = "com.microsoft.sqlserver.jdbc.SQLServerDriver"

  public static property get TrackOnlySQLDataUpdates() : boolean {
    return DEBUG_MODE ? true : (ScriptParameters.getParameterValue("DevConsole_TrackOnlySQLDataUpdates") as boolean)
  }

  public static property get TrackOnlyGosuDataUpdates() : boolean {
    return DEBUG_MODE ? true : (ScriptParameters.getParameterValue("DevConsole_TrackOnlyGOSUDataUpdates") as boolean)
  }

}