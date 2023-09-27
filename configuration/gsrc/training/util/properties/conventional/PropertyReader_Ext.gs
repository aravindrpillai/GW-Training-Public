package training.util.properties.conventional

uses training.util.logging.LoggerCategories_Ext
uses training.util.logging.Logger_Ext
uses gw.api.util.ConfigAccess
uses org.apache.commons.lang3.EnumUtils
uses gw.util.concurrent.LockingLazyVar
uses java.io.FileNotFoundException
uses java.io.FileInputStream
uses java.io.IOException
uses java.io.File

/**
 * Utility class to read properties from properties file
 * author : Aravind R Pillai
 * date : 05 May 2022
 */
class PropertyReader_Ext {

  static var _logger = new Logger_Ext(PropertyReader_Ext, LoggerCategories_Ext.GENERAL)
  private static var separator = File.separator
  private static var PROP_FOLDER_PATH = separator + "gsrc" + separator + "training" + separator + "properties" + separator
  private static final var PROP_FILE_EXTENSION = "properties"
  private static var _properties = LockingLazyVar.make(\-> PropertyReader_Ext.loadProperties())

  private enum ENVIRONMENTS {LOCAL, DEV, TEST, PROD}

  private construct() {
  }

  /**
   * Load and returns properties instance for a given properties file.
   *
   * @param propertiesFilePath String
   * @return properties
   * @throws RuntimeException 1. If properties file not found
   *                          2. If error while reading properties file
   *                          3. If any unknown error occurs while reading properties file
   */
  private static function loadProperties() : Properties {
    _logger.trace("Entered PropertiesReader.loadProperties")
    var env = System.getProperty("gw.pc.env")
    _logger.info("Loading Properties for Environment : " + env)
    if (env == null or env == "") {
      env = ENVIRONMENTS.LOCAL.Code.toLowerCase().trim()
    }
    var envList = EnumUtils.getEnumMap(ENVIRONMENTS).keySet().toList()
    if (not envList.contains(env.toUpperCase())) {
      _logger.error("Failed to load Properties - Invalid Environement ${env}")
      throw new RuntimeException("Failed to load Properties - Invalid Environement ${env}")
    }

    var propLoc = PROP_FOLDER_PATH + env
    _logger.info("Fetching properties file from location : ${propLoc}")

    var properties = new Properties()
    var prop : Properties
    try {
      var propertyFiles = ConfigAccess.getConfigFile(propLoc).listFiles()
      _logger.info("Files found : " + propertyFiles.toList().toString())
      var propFilesCount = propertyFiles.Count
      _logger.info("Found ${propFilesCount} property files")
      if (propFilesCount <= 0) {
        _logger.error("No Property file(s) found in path : " + PROP_FOLDER_PATH)
        throw new Exception("No Property file(s) found in path : " + PROP_FOLDER_PATH)
      }
      for (propFile in propertyFiles) {
        if (isPropertyFile(propFile.toString())) {
          prop = new Properties()
          prop.load(new FileInputStream(propFile))
          properties.putAll(prop)
        }
      }
    } catch (fnfe : FileNotFoundException) {
      _logger.error(fnfe.Message)
      throw fnfe
    } catch (rte : RuntimeException) {
      _logger.error(rte.Message)
      throw rte
    } catch (ioe : IOException) {
      _logger.error(ioe.Message)
      throw ioe
    } catch (e : Exception) {
      _logger.error(e.Message)
      throw e
    }
    _logger.trace("Exited PropertiesReader.loadProperties")
    return properties
  }

  /**
   * To fetch the value for the required property
   *
   * @param key param comment here
   * @return value of the property
   */
  public static function getProperty(key : String) : String {
    try {
      return _properties.get().getProperty(key?.toLowerCase()).trim().toString()
    } catch (e : NullPointerException) {
      throw new NullPointerException("Entered property '${key}' could not be found")
    }
  }


  /**
   * To validate whether the file read is a property file or not
   *
   * @param propertyName
   * @return value of the property
   */
  private static function isPropertyFile(fileName : String) : boolean {
    if (fileName == null or !fileName.contains(".")) {
      return false
    }
    var splitFileName = fileName.split("\\.")
    var length = splitFileName.Count
    return (length < 1) ? false : ((((splitFileName[length - 1]).toLowerCase()) == PROP_FILE_EXTENSION) ? true : false)
  }

}