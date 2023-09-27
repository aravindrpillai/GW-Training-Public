package training.util.codeinspect.util

uses java.io.File
uses org.w3c.dom.Element
uses org.w3c.dom.NodeList
uses org.apache.log4j.Logger
uses training.util.codeinspect.dto.FileTypeDTO
uses javax.xml.parsers.DocumentBuilderFactory
uses training.util.codeinspect.dto.LocationDTO
uses training.util.codeinspect.constants.FileTypes

/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * Desc : Utility class to read the files.xml
 */
class FilesXMLUtil {

  static final var _logger = Logger.getLogger(FilesXMLUtil)

  private construct() {
  }

  /**
   * Function to load the conf file and convert it to DTO
   */
  static function getFileDetails(fileXMLLocation : String) : List<FileTypeDTO> {
    if (fileXMLLocation == null) {
      _logger.info("No 'files.xml' provided. Hence reading from default 'files.xml'")
      fileXMLLocation = FileUtil.ThisFolder.concat("/constants/files.xml")
    }
    _logger.info("Starting to read files.xml from : " + fileXMLLocation)
    var file = new File(fileXMLLocation)
    var document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(file)
    var files = document.getElementsByTagName("file")

    if(files.Length == 0){
      throw new RuntimeException("No File Configurations found")
    }

    var ruleSetAvailable = FileUtil.RuleSetsAvailable
    var content : Element
    var contentType : String
    var disable : String
    var fileDTO : FileTypeDTO
    var locationDTO : LocationDTO
    var items : NodeList
    var item : Element
    var ruleCategory : String
    var fileDTOList = new ArrayList<FileTypeDTO>()
    var fileType : FileTypes

    foreach (contentIndex in 0..|files.Length) {
      content = files.item(contentIndex) as Element
      contentType = content.getAttribute("type")
      disable = content.getAttribute("disable")
      if(disable != null and disable != ""){
        if(Boolean.parseBoolean(disable)){
          _logger.info("Skipping "+contentType+" -- DISABLED")
          continue
        }
      }

      try{
        fileType = FileTypes.valueOf(contentType?.toUpperCase()?.trim())
      }catch(e:IllegalArgumentException){
        throw new IllegalStateException("`" + contentType + "` is not a valid type. (See file `files.xml`). Value must be one from FileTypes enum")
      }

      fileDTO = new FileTypeDTO()
      fileDTO.FileType = fileType
      if(fileType == DISPLAYKEY){
        fileDTO.ReadAllFilesOfThisType = true
        fileDTO.Locations = { new LocationDTO(){ :Location = "config/locale/display.properties", :IsFolder = false }}
        fileDTOList.add(fileDTO)
        continue
      }



      items = content.getElementsByTagName("item")
      fileDTO.ReadAllFilesOfThisType = (items.Length == 0)
      fileDTO.Locations = new ArrayList<LocationDTO>()
      foreach (itemIndex in 0..|items.Length) {
        item = items.item(itemIndex) as Element

        if(not fileDTO.ReadAllFilesOfThisType and item.TextContent?.trim() == "*.*"){
          fileDTO.ReadAllFilesOfThisType = true
          fileDTO.Locations =  null
          break
        }

        locationDTO = new LocationDTO()

        if(fileType == FileTypes.RULES){
          ruleCategory = item.TextContent.split("/").first()
          if((not fileDTO.ReadAllFilesOfThisType) and (ruleCategory == null or ruleCategory == "")){
            throw new IllegalStateException("Rule Category is cannot be null. See Rules of files.xml")
          }
          if(ruleSetAvailable.hasMatch(\elt1 -> elt1.toUpperCase() == ruleCategory?.toUpperCase())){
            locationDTO.RuleCategory = ruleCategory
            locationDTO.Location = item.TextContent.remove("*.*").remove(ruleCategory).remove("/")
            locationDTO.ReadAllRulesUnderThis = (locationDTO.Location == null or locationDTO.Location == "")
            locationDTO.IsFolder = true
          }else{
            throw new IllegalStateException("Invalid Rule Category. See Rules of files.xml. Value must be one from "+ruleSetAvailable?.toString())
          }
        }else{
          locationDTO.Location = item.TextContent.remove("/*.*")
          locationDTO.IsFolder = item.TextContent.contains("/*.*")
        }
        fileDTO.Locations.add(locationDTO)
      }
      fileDTOList.add(fileDTO)

      //Removing unwanted entries inside Locations - ONLY for RULESET
      var rulesDTOList = fileDTOList.where(\elt -> elt.FileType == FileTypes.RULES and (not elt.ReadAllFilesOfThisType))
      foreach(fileDto in rulesDTOList){
         var f = fileDto.Locations.firstWhere(\elt -> elt.ReadAllRulesUnderThis)
        if(f != null){
          fileDto.Locations.removeAll(fileDto.Locations.where(\elt -> elt != f and elt?.RuleCategory == f.RuleCategory ))
        }
      }

    }
    if (fileDTOList.Count == 0) {
      throw new RuntimeException("No files/folders configured to evaluate. Please configure them in files.xml")
    }
    _logger.info("Found " + fileDTOList.Count + " file configurations")
    return fileDTOList
  }


}