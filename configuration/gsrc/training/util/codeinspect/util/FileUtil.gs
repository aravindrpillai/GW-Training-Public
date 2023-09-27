package training.util.codeinspect.util

uses java.io.File
uses java.io.Writer
uses java.io.BufferedWriter
uses java.io.FileOutputStream
uses java.io.OutputStreamWriter
uses java.io.FileNotFoundException
uses training.util.codeinspect.constants.FileTypes

/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * Desc : Utility class to handle all File related operations
 */
class FileUtil {

  /**
   * Property to get the working folder
   *
   * @return
   */
  static property get AppFolder() : String {
    return System.getProperty("user.dir").replaceAll("\\\\", "/")
  }

  /**
   * Property to get the working folder
   *
   * @return
   */
  static property get ConfigurationFolder() : String {
    return AppFolder.concat("/").concat("modules/configuration")
  }

  /**
   * Property to get the working folder
   *
   * @return
   */
  static property get ThisFolder() : String {
    var thisAccRelativeLocation = PropertyReaderUtil.getProperty("codeinspect.this.accelerator.relative.location")
    return ConfigurationFolder.concat("/").concat(thisAccRelativeLocation)
  }

  /**
   * Function to derive the file type
   *
   * @param file
   * @return file type
   * @Throws FileNotFoundException
   */
  static function getFileType(file : File) : FileTypes {
    if (file == null) {
      throw new FileNotFoundException("Empty File")
    }
    switch (file.Extension.toLowerCase()) {
      case "gs":
      case "gsx":
        return FileTypes.GOSU
      case "pcf":
        return FileTypes.PCF
      case "eti":
      case "etx":
        return FileTypes.ENTITY
      case "tti":
      case "ttx":
        return FileTypes.TYPELIST
      case "grs":
      case "gr":
        return FileTypes.RULES
      default:
        return null
    }
  }

  /**
   * Function to get all the rule names available in this application | This varies according to prj and application
   * @return
   */
  static property get RuleSetsAvailable() : List<String>{
    var rulesetFolder = ConfigurationFolder.concat("/config/rules")
    var rSet = new File(rulesetFolder)
    var folderList = new ArrayList<String>()
    for(item in rSet.listFiles()){
      if(item.isDirectory()){
        folderList.add(item.Name)
      }
    }
    return folderList
  }


  /**
   * Function to find a folder - Function searches through the subfolders as well
   * @param fileTypeDTO
   */
  static function findFolder(parentLoc : String, searchName : String) : String {
    var file = new File(parentLoc)
    if (file.Directory) {
      var items = file.listFiles().where(\elt -> elt.Directory)
      for (f in items) {
        if (f.Name.containsIgnoreCase(searchName)) {
          return f.AbsolutePath
        } else {
          return findFolder(f.AbsolutePath, searchName)
        }
      }
    }
    return null
  }


  /**
   * Function to find a folder - Function searches through the subfolders as well
   * @param fileTypeDTO
   */
  static function findFile(parentLoc : String, searchName : String) : String {
    var file = new File(parentLoc)
    if (file.Directory) {
      var items = file.listFiles()
      for (f in items) {
        if (f.File and f.Name.containsIgnoreCase(searchName)) {
          return f.AbsolutePath
        } else if (f.Directory) {
          return findFile(f.AbsolutePath, searchName)
        }
      }
    }
    return null
  }

  /**
   * Function to create file in directory with content
   * @param fullFilePath
   * @param content
   */
  static function createFile(fullFilePath : String, fileName : String, content:String){
    var fileDirectory = new File(fullFilePath)
    if(not fileDirectory.exists()){
      fileDirectory.mkdir()
    }

    var writer : Writer = null
    try {
      writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(fullFilePath+"/"+fileName), "utf-8"))
      writer.write(content)
    }
    finally  {
      if(writer != null){
        writer.close()
      }
    }
  }


}


