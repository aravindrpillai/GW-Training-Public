package training.util.codeinspect.rules

uses org.w3c.dom.Element
uses org.apache.log4j.Logger
uses training.util.codeinspect.util.XMLUtil
uses training.util.codeinspect.constants.FileTypes
uses training.util.codeinspect.dto.FileMetadataDTO
uses training.util.codeinspect.base.CodeInspectBase
uses training.util.codeinspect.util.PropertyReaderUtil

/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * desc : Rule To check for comments
 */
class EntityFieldsWithoutDescRule extends CodeInspectBase {

  private var _logger = Logger.getLogger(EntityFieldsWithoutDescRule)
  private final var _dataTableExtension = PropertyReaderUtil.getProperty("codeinspect.project.extension")
  private var _fieldsExpectingDescription = {
      "column", "array", "foreignkey", "onetoone", "edgeForeignKey",
      "typekey", "typecode", "typefilter",
      "checkconstraint", "customconsistencycheck", "searchColumn", "searchTypekey",
      "event", "index", "monetaryamount", "column-override", "typekey-override"
  }

  override function shouldExecute(fileMetaData : FileMetadataDTO) : boolean {
    switch (true) {
      case fileMetaData.FileType == FileTypes.ENTITY:
      case fileMetaData.FileType == FileTypes.TYPELIST:
      case fileMetaData.FileName.containsIgnoreCase(_dataTableExtension):
      case fileMetaData.File.containsText(_dataTableExtension):
        return true
    }
    return false
  }

  override function rule(fileMetaData : FileMetadataDTO, lines : List<String>) {
    _logger.debug("Starting rule ${RuleName} for file : ${FileName}")
    try {
      var xmlUtil = new XMLUtil(fileMetaData.File)
      var isCustomTable = fileMetaData.FileName.containsIgnoreCase(_dataTableExtension)
      foreach (fieldWithDesc in _fieldsExpectingDescription) {
        _logger.debug("Looking for DataType - " + fieldWithDesc)
        var nodeList = xmlUtil.getElementsByTagName(fieldWithDesc)
        for (i in 0..|nodeList.Length) {
          var element = nodeList.item(i) as Element
          var columnName = element.getAttribute("name")
          if (fileMetaData.FileType == FileTypes.TYPELIST) {
            columnName = element.getAttribute("code")
          }
          if (not isCustomTable and not columnName.containsIgnoreCase(_dataTableExtension)) {
            //this is an ootb field in an etx file
            continue
          }
          var columnDesc = element.getAttribute("desc")?.trim()
          if (columnDesc == null or columnDesc == "") {
            reportViolation(i + 1, "Column: " + columnName + " (" + fieldWithDesc + ")")
          }
        }
      }
    } catch (e : Exception) {
      _logger.error(e.StackTraceAsString)
      reportInspectionFailure(e)
    }
    _logger.debug("Finished evaluating rule ${RuleName} for file : ${FileName}")
  }

}