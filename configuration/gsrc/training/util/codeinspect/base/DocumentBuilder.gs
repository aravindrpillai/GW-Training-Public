package training.util.codeinspect.base

uses org.apache.log4j.Logger
uses training.util.codeinspect.dto.RuleDTO
uses training.util.codeinspect.templates.CodeInspectFileSection
uses training.util.codeinspect.templates.CodeInspectFileTypeList
uses training.util.codeinspect.templates.CodeInspectRuleSection
uses training.util.codeinspect.templates.CodeInspectRulesList
uses training.util.codeinspect.templates.CodeInspectTemplateBase
uses training.util.codeinspect.util.FileUtil
uses training.util.codeinspect.dto.ViolationsDTO
uses training.util.codeinspect.constants.FileTypes
uses training.util.codeinspect.dto.FileMetadataDTO
uses training.util.codeinspect.util.PropertyReaderUtil

/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * desc : Class to generate the document
 */
class DocumentBuilder {

  static final var _logger = Logger.getLogger(DocumentBuilder)

  /**
   * function to generate the document
   *
   * @param fileMetadataList
   */
  function buildDocument(fileMetadataList : List<FileMetadataDTO>) {
    _logger.info("Starting to generate document.")
    var eachFileContent : String
    var eachFileRolesContent : String
    var fileHTMLContentBuilder = new StringBuilder()
    var fileTypeGroupingMap = new HashMap<FileTypes, List<FileMetadataDTO>>()
    var metaDataOnFileTypeMap : List<FileMetadataDTO>
    foreach (fileMetadata in fileMetadataList index fileIndex) {

      //Below for Files tab
      metaDataOnFileTypeMap = fileTypeGroupingMap.get(fileMetadata.FileType)
      if (metaDataOnFileTypeMap == null) {
        metaDataOnFileTypeMap = new ArrayList<FileMetadataDTO>()
      }
      metaDataOnFileTypeMap.add(fileMetadata)
      fileTypeGroupingMap.put(fileMetadata.FileType, metaDataOnFileTypeMap)

      //For File Content Tab
      if (fileMetadata.Violations?.HasElements) {
        eachFileRolesContent = buildFileContent(fileMetadata, fileIndex)
        eachFileContent = CodeInspectFileSection.renderToString(fileMetadata, eachFileRolesContent, fileIndex)
        fileHTMLContentBuilder.append(eachFileContent)
      }
    }
    var fileTypesAsHTMLContent = CodeInspectFileTypeList.renderToString(fileTypeGroupingMap)
    var rulesHTMLContent = CodeInspectRulesList.renderToString()
    var fullHTMLContent = CodeInspectTemplateBase.renderToString(fileHTMLContentBuilder.toString(), rulesHTMLContent, fileTypesAsHTMLContent)
    var opFileName = OutputFileName
    var filePath = PropertyReaderUtil.getProperty("codeinspect.absolute.output.location")
    FileUtil.createFile(filePath, opFileName, fullHTMLContent.toString())
    _logger.info("Document generation done. Report available at : "+filePath+"/"+opFileName)
  }

  /**
   * function to build the file content
   * @param fileMetadata
   * @param fileIndex
   * @return
   */
  private function buildFileContent(fileMetadata : FileMetadataDTO, fileIndex : int) : String {
    var ruleViolations = new HashMap<RuleDTO, Set<ViolationsDTO>>()
    var violations : Set<ViolationsDTO>
    foreach (violation in fileMetadata.Violations) {
      violations = ruleViolations.get(violation.Rule)
      if (violations == null) {
        violations = new HashSet<ViolationsDTO>()
      }
      violations.add(violation)
      ruleViolations.put(violation.Rule, violations)
    }
    var ruleHTMLContentBuilder = new StringBuilder()
    var ruleHTMLContent : String
    foreach (rule in ruleViolations.Keys index roleIndex) {
      violations = ruleViolations.get(rule)
      ruleHTMLContent = CodeInspectRuleSection.renderToString(rule, violations, fileIndex, roleIndex)
      ruleHTMLContentBuilder.append(ruleHTMLContent)
    }
    return ruleHTMLContentBuilder.toString()
  }

  /**
   * function to generate the file name based on current date time
   * @return
   */
  private property get OutputFileName() : String {
    var date = Date.CurrentDate
    var dateSufffix = date.YearOfDate + date.MonthName.substring(0, 3) + date.DayOfMonth
    var time = date.HourOfDay + "H" + date.Minute + "M" + date.Second + "S"
    return "Report_As_Of_" + dateSufffix + "_" + time + ".html"
  }
}