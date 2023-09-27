package training.util.properties.framework

uses gw.api.database.Query
uses java.io.FileInputStream
uses gw.util.concurrent.LockingLazyVar


/**
 * author : Aravind R Pillai
 * date   : 16 Nov 2022
 * desc   : Class to read the property
 *
 */
class PropertyReader {

  private static var _properties = LockingLazyVar.make(\-> new PropertyLoader().loadProperties())

  /**
   * To fetch the value for the required property
   *
   * @param key param comment here
   * @return value of the property
   */
  public static function getProperty(key : String) : String {
    try {
      if(PropertyConstants.EnablePropertyUpdate){
        var prop = Query.make(ApplicationProperties)
            .compareIgnoreCase(ApplicationProperties#Key, Equals, key)
            .select().single()
        return prop.UseOverrideValue ? prop.OverrideValue : prop.Value
      }else{
        return _properties.get().getProperty(key?.toLowerCase()).trim()
      }

    } catch (e : IllegalStateException) {
      throw new RuntimeException("Entered property '${key}' could not be found")
    }
  }


  /**
   * To fetch the value for the required property
   *
   * @param key param comment here
   * @return value of the property
   */
  public static function getPropertyFromEnv(key : String, env:String) : String {
    var prop : Properties
    var properties = new Properties()
    try {
      var propLoc = PropertyConstants.PROP_FOLDER_PATH + env
      var propertyFiles = PropertiesUtil.readFilesFromLocation(propLoc, true)
      for (propFile in propertyFiles) {
        if (PropertiesUtil.isPropertyFile(propFile.toString())) {
          prop = new Properties()
          var f = new FileInputStream(propFile)
          prop.load(f)
          f.close()
          properties.putAll(prop)
        }
      }
    } catch (e : Exception) {
      return null
    }
    return properties?.getProperty(key)
  }



}