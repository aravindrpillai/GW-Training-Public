package training.util.properties.framework

uses gw.api.database.IQueryBeanResult
uses gw.util.Pair
uses org.apache.log4j.Logger

/**
 * author : Aravind
 * date : 16 Nov 2022
 * Class to handle UI opertaions
 */
class PropertyUIHelper {

  static var _logger = Logger.getLogger(PropertyLoader)

  /**
   * Function to perform search
   * @param searchKeyword
   * @return
   */
  function search(searchKeyword : String = null) : IQueryBeanResult<ApplicationProperties> {
    _logger.debug("Keyword -- "+searchKeyword)
    if (searchKeyword == null) {
      return gw.api.database.Query.make(ApplicationProperties).select()
    }
    return gw.api.database.Query.make(ApplicationProperties).contains(ApplicationProperties#Key, searchKeyword, true).select()
  }

  /**
   * Function to pull other environment details
   * @param key
   * @return
   */
  function getDataFromAllEnvs(key: String) : List<Pair<String, String>>{
    _logger.debug("Starting to get all env info for property : "+key)
    var envs = PropertyConstants.ENVIRONMENTS.AllValues
    var value : String
    var retObject = new ArrayList<Pair<String, String>>()
    var thisEnv = PropertiesUtil.Environment
    foreach(env in envs){
      if(thisEnv.equalsIgnoreCase(env.Code)){
        continue
      }
      value = PropertyReader.getPropertyFromEnv(key, env.Code)
      retObject.add(new Pair(env.Name, value))
    }
    return retObject
  }

  function addNewRecord(){

  }


}
