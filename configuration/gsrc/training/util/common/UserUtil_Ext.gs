package training.util.common

uses gw.api.database.Query
uses training.util.properties.conventional.PropertyReader_Ext

/**
 * Author : Aravind R Pillai
 * Date   : 06 Mqy 2022
 * Desc   : Class to handle user functionalities
 */
class UserUtil_Ext {

  /**
   * Function to return the active user
   * Use this function where integrations are called from PCF.
   * In case active user is not available, this returns the integration user
   * @return : Username
   */
  static property get AvailableUser() : String {
    if (User.util.CurrentUser == null) {
      return IntegrationUser
    } else {
      return User.util.CurrentUser.Credential?.UserName
    }
  }


  /**
   * Function to return the integration User
   * Use this use for exclusive integrations where current user wont be available
   * @return : Username
   */
  static property get IntegrationUser() : String {
    return PropertyReader_Ext.getProperty("common.integration.user")
  }


  /**
   * Function to return the user
   * @return : User
   */
  static function getUser(username : String) : User {
    return Query.make(User).join(User#Credential).compare(Credential#UserName, Equals, username).select().single()
  }

}