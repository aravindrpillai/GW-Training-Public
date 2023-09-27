package training.util.codeinspect.rules

uses org.apache.log4j.Logger
uses training.util.codeinspect.dto.FileMetadataDTO
uses training.util.codeinspect.base.CodeInspectBase


/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * desc : Rule To check for comments
 */
class MoreThanOneSpaceRule extends CodeInspectBase {

  private var _logger = Logger.getLogger(MoreThanOneSpaceRule)

  override function shouldExecute(fileMetaData : FileMetadataDTO) : boolean {
    return true
  }

  override function rule(fileMetaData : FileMetadataDTO, lines : List<String>) {
    _logger.debug("Starting rule ${RuleName} for file : ${FileName}")
    try {
      foreach (line in lines index lineNumber) {
        line = trackAndFormatLine(lineNumber, line)
        if (!IsThisLineEmpty and !IsThisLineCommented and line.matches(".*  .*")) {
          reportViolation(lineNumber + 1, line)
        }
      }
    } catch (e : Exception) {
      _logger.error(e.StackTraceAsString)
      reportInspectionFailure(e)
    }
    _logger.debug("Finished evaluating rule ${RuleName} for file : ${FileName}")
  }

}