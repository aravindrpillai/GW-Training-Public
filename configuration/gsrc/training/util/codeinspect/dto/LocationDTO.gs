package training.util.codeinspect.dto

/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * Desc : DTO file to handle the file Locations
 */
class LocationDTO {

  var _location : String as Location
  var isFolder : boolean as IsFolder
  var _readAllRulesUnderThis : boolean as ReadAllRulesUnderThis = false
  var _ruleCategory : String as RuleCategory

  /**
   * function to display the dto content
   *
   * @return
   */
  override function toString() : String {
    return "[" + (IsFolder ? "Folder" : "File") + ": " + Location + (RuleCategory != null ? (" | RuleCategory : "+RuleCategory) : "")+" | ReadAllRulesUnderThis : "+ReadAllRulesUnderThis+"]"
  }


}