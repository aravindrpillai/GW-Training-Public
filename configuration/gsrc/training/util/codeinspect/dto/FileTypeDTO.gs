package training.util.codeinspect.dto

uses training.util.codeinspect.constants.FileTypes

/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * Desc : DTO file to handle the files
 */
class FileTypeDTO {

  var _filetype : FileTypes as FileType
  var _readAllFilesOfThisType : boolean as ReadAllFilesOfThisType = false
  var _locations : List<LocationDTO> as Locations = null

  /**
   * function to display the dto content
   *
   * @return
   */
  override function toString() : String {
    return "FileType : " + FileType +
        " | ReadAllFilesOfThisType : " + ReadAllFilesOfThisType +
        " | Locations {" + Locations?.toString() + "}"
  }
}