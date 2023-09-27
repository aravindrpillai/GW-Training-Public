package training.util.properties.framework

uses gw.api.startable.StartablePluginCallbackHandler
uses gw.api.startable.StartablePluginState
uses gw.api.startable.IStartablePlugin
uses org.apache.log4j.Logger
uses java.io.FileInputStream
uses gw.api.database.Query
uses gw.api.database.Relop

/**
 * Utility class to read properties from properties file
 * author : Aravind R Pillai
 * date : 12 September 2022
 */
class PropertyLoader implements IStartablePlugin {

  static var _logger = Logger.getLogger(PropertyLoader)
  var _neededKeys : Set<String>

  construct() {
    _neededKeys = new HashSet<String>()
  }

  /**
   * reads the property file frm the folder location and
   * @param pluginCallbackHandler
   * @param serverStarting
   */
  override function start(pluginCallbackHandler : StartablePluginCallbackHandler, serverStarting : boolean) {
    if(PropertyConstants.EnablePropertyUpdate){
      //loadProperties()
    }
  }


  /**
   * Function to load the properties
   * @return
   */
  function loadProperties() : Properties {
    _logger.trace("Entered PropertiesReader.loadProperties")
    var propLoc = PropertiesUtil.PropertyLocation
    _logger.info("Fetching properties file from location : ${propLoc}")
    var prop : Properties
    var allProperties = new Properties()
    try {
      var propertyFiles = PropertiesUtil.readFilesFromLocation(propLoc, true)
      for (propFile in propertyFiles) {
        if (PropertiesUtil.isPropertyFile(propFile.toString())) {
          prop = new Properties()
          prop.load(new FileInputStream(propFile))
          if(PropertyConstants.EnablePropertyUpdate){
            writeToDB(propFile.Name, prop)
          }else{
            allProperties.putAll(prop)
          }
        }
      }
      if(PropertyConstants.EnablePropertyUpdate) {
        deleteUnwantedRecords()
      }
    } catch (e : Exception) {
      _logger.error(e.Message)
      throw e
    }
    _logger.trace("Exited PropertiesReader.loadProperties")
    return allProperties
  }

  /**
   * Function to handle stop
   * @param serverShuttingDown
   */
  override function stop(serverShuttingDown : boolean) {
  }

  /**
   * Function to handle Start
   * @return
   */
  override property get State() : StartablePluginState {
    return null
  }




  /**
   * function to wride properties to DB
   * @param root
   * @param properties
   */
  private function writeToDB(root:String, properties: Properties){
    var propTable : ApplicationProperties
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      properties.eachKeyAndValue(\key, value -> {
        propTable = Query.make(ApplicationProperties).compare(ApplicationProperties#Key, Relop.Equals, key?.toString()).select().AtMostOneRow
        propTable = bundle.add(propTable == null ? new ApplicationProperties() : propTable)
        propTable.Root = root
        propTable.Key = key?.toString()
        propTable.Value = value?.toString()
        propTable.UseOverrideValue = false
        _neededKeys.add(propTable.Key)
      })
    }, PropertyConstants.DB_USER)
  }


  /**
   * function to delete removed properties
   */
  function deleteUnwantedRecords(){
    _logger.info("deleting unwanted records : Count :"+_neededKeys?.Count)
    var recordToDelete = Query.make(ApplicationProperties).compareNotIn(ApplicationProperties#Key, _neededKeys.toTypedArray()).select()
    _logger.info("Records found : Count :" + recordToDelete?.Count)
    gw.transaction.Transaction.runWithNewBundle(\bundle-> {
      foreach (record in recordToDelete) {
        bundle.add(record).remove()
      }
    }, PropertyConstants.DB_USER)
  }

}