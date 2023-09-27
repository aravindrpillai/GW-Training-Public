package training.util.properties.framework

/**
 * author :  Aravind R Pillai
 * date   : 16 Nov 2022
 * desc   : Class to handle the framework constants
 */
class PropertyConstants {

  //Below flag will enable the Property updation.
  //Turn this OFF in Production
  public static var _enablePropertyUpdate : boolean as EnablePropertyUpdate = true

  //Specify the root folder where the property files are kept
  public static var _propFolderPath : String as PROP_FOLDER_PATH = "gsrc/training/util/properties/framework/properties/"

  //Available Environments
  //child folder inside the properties rot folder must be the one amongst the below
  public static enum ENVIRONMENTS {LOCAL, DEV, TEST, PROD}


  public static var _dbUser : String as DB_USER = "su"
  public static var _propFileExtension : String as PROP_FILE_EXTENSION = "properties"


}