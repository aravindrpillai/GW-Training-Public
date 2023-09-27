package training.util.properties.framework

uses gw.api.util.ConfigAccess
uses org.apache.log4j.Logger

uses java.io.File

/**
 * author : Aravind R Pillai
 * date   : 16 Nov 2022
 * desc   : Properties Utility class
 */
class PropertiesUtil {

  static var _logger = Logger.getLogger(PropertiesUtil)
  /**
   * To validate whether the file read is a property file or not
   *
   * @param propertyName
   * @return value of the property
   */
  static function isPropertyFile(fileName : String) : boolean {
    if (fileName == null or !fileName.contains(".")) {
      return false
    }
    var splitFileName = fileName.split("\\.")
    var length = splitFileName.Count
    return (length < 1) ? false : ((((splitFileName[length - 1]).toLowerCase()) == PropertyConstants.PROP_FILE_EXTENSION) ? true : false)
  }

  /**
   * function to get the property location
   * @return
   */
  static property get PropertyLocation() : String {
    var env = Environment
    var envCheck = PropertyConstants.ENVIRONMENTS.valueOf(env)
    if (envCheck == null) {
      _logger.error("Failed to load Properties - Invalid Environement ${env}")
      throw new RuntimeException("Failed to load Properties - Invalid Environement ${env}")
    }
    return PropertyConstants.PROP_FOLDER_PATH + env
  }

  /**
   * function to return the files inside the folder
   * @param folderPath
   * @param raiseExceptionIfNoFilesFound
   * @return
   */
  static function readFilesFromLocation(folderPath : String, raiseExceptionIfNoFilesFound : boolean = true) : File[] {
    _logger.info("Looking for property files under : " + folderPath)
    var propertyFiles = ConfigAccess.getConfigFile(folderPath).listFiles()
    _logger.info("Files found : " + propertyFiles.toList().toString())
    var propFilesCount = propertyFiles.Count
    _logger.info("Found ${propFilesCount} property files")
    if (propFilesCount <= 0 and raiseExceptionIfNoFilesFound) {
      _logger.error("No Property file(s) found in path : " + PropertyConstants.PROP_FOLDER_PATH)
      throw new Exception("No Property file(s) found in path : " + PropertyConstants.PROP_FOLDER_PATH)
    }else{
      return propFilesCount>0 ? propertyFiles : null
    }
  }

  /**
   * function to get the ENvironment
   * @return
   */
  static property get Environment() : String{
    var env = System.getProperty("gw.pc.env")
    if (env == null or env == "") {
      env = PropertyConstants.ENVIRONMENTS.LOCAL.Code.toLowerCase().trim()
    }
    return env?.toUpperCase()
  }


}