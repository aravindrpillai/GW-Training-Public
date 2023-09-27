package training.util.codeinspect.util

uses java.io.File
uses java.io.FileReader

/**
 * author : Aravind R Pillai
 * date : 09 Oct 2022
 * desc : Utility class for custom rules
 */
class RulesUtil {

  /**
   * Function to check if the line is sommented or not | Expensive method -Use when really required
   * @param lineNumber
   * @param file
   * @return
   */
  function isThisLineCommented(lineNumber : int, file: File) : boolean {
    var lines = org.apache.commons.io.IOUtils.readLines(new FileReader(file))
    return isThisLineCommented(lineNumber, lines)
  }

  /**
   * Function to check if the line is sommented or not  | Expensive method -Use when really required
   * @param lineNumber
   * @param list of lines in the file
   * @return
   */
  function isThisLineCommented(lineNumber : int, lines: List<String>) : boolean {
    var line = lines.get(lineNumber)?.trim()
    if(line.startsWith("//")){
      return true
    }else{
      if(line.startsWith("/*") and line.endsWith("*/")){
        return true
      }else{
        var newLine = ""
        for(i in 0|..|lineNumber){
          newLine = lines.get(lineNumber-i-1)?.trim()
          if(newLine.contains("*/")){
            return false
          }else if(newLine.contains("/*")){
            return true
          }
        }
        return false
      }
    }

  }

}