package training.util.codeinspect.rules

uses org.apache.log4j.Logger
uses training.util.codeinspect.base.CodeInspectBase
uses training.util.codeinspect.dto.FileMetadataDTO

/**
 * author : Krishna Kumar B
 * date : 11 Oct 2022
 * desc : Rule To check .equals function and throws a violation on .equals function.
 * == must be used instead of .equals()
 */
class EqualityCheckRule extends CodeInspectBase {

  private var _logger = Logger.getLogger(EqualityCheckRule)

  override function shouldExecute(fileMetaData : FileMetadataDTO) : boolean {
    return true
  }

  override function rule(fileMetaData : FileMetadataDTO, lines : List<String>) {
    _logger.debug("Starting rule ${RuleName} for file : ${FileName}")
    try {
      foreach (line in lines index lineNumber) {
        line = trackAndFormatLine(lineNumber, line)
        if (!IsThisLineEmpty and !IsThisLineCommented and line.contains(".equals")) {
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