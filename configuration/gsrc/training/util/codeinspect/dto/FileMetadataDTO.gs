package training.util.codeinspect.dto

uses java.io.File
uses training.util.codeinspect.constants.FileTypes

/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * desc : DTO class to keep the file Metadata - This file is passes to the child classes
 */
class FileMetadataDTO {

  construct(){
    Rules = new ArrayList<RuleDTO>()
  }

  //Actual File
  var _file : File as File

  //File Metadata
  var _fileName : String as FileName
  var _type : FileTypes as FileType
  var _extension : String as Extension

  //Field keeps the list of Rules that needs to be executed on top of this file
  var _rules : List<RuleDTO> as Rules

  //violations
  var _violations : List<ViolationsDTO> as Violations = new ArrayList<ViolationsDTO>()
  var _error : Exception as ProcessTerminationError = null

}