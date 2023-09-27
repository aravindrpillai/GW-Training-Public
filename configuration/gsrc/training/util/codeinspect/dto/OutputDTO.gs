package training.util.codeinspect.dto

uses training.util.codeinspect.constants.FileTypes

/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * desc : DTO class to keep the file Metadata - This file is passes to the child classes
 */
class OutputDTO {

  construct(){
    Rules = new ArrayList<RuleDTO>()
  }

  var _fileName : String as FileName
  var _type : FileTypes as FileType
  var _extension : String as Extension

  //Field keeps the list of Rules that needs to be executed on top of this file
  var _rules : List<RuleDTO> as Rules

  //violations
  var _violations : List<ViolationsDTO> as Violations = null
  var _error : Exception as ProcessTerminationError = null

}