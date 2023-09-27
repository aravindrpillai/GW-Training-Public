package training.util.codeinspect.base

uses java.io.FileReader
uses org.apache.log4j.Logger
uses training.util.codeinspect.dto.RuleDTO
uses java.util.concurrent.locks.ReentrantLock
uses training.util.codeinspect.dto.ViolationsDTO
uses training.util.codeinspect.dto.FileMetadataDTO
uses training.util.codeinspect.constants.FileTypes

/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * desc : Base class to run through the file and update the metadata dto
 */
abstract class CodeInspectBase extends CodeInspectCore {

  private var _ruleDTO : RuleDTO
  private var _fileMetaData : FileMetadataDTO
  private var _lock = new ReentrantLock()
  private var _logger = Logger.getLogger(CodeInspectBase)
  private var _trackLineEnabled = false
  private var _isLineCommented_MultiLine = false
  private var _isLineCommented_SingleLine = false
  private var _isEmptyLine = false

  final function run(fileMetaData : FileMetadataDTO, rule : RuleDTO) {
    _ruleDTO = rule
    _fileMetaData = fileMetaData
    if (shouldExecute(fileMetaData)) {
      _lock.lock()
      try {
        var lines = org.apache.commons.io.IOUtils.readLines(new FileReader(fileMetaData.File))
        rule(fileMetaData, lines)
      } finally {
        _lock.unlock()
      }
    }
  }

  /**
   * Function to get the file type
   * @return
   */
  final property get FileType() : FileTypes {
    return _fileMetaData.FileType
  }

  /**
   * Function to get the file name
   * @return
   */
  final property get FileName() : String {
    return _fileMetaData.FileName
  }

  /**
   * function ot get the file path
   * @return
   */
  final property get FilePath() : String {
    return _fileMetaData.File.AbsolutePath
  }

  /**
   * Function to get the rule
   * @return
   */
  final property get Rule() : RuleDTO {
    return _ruleDTO
  }

  /**
   * Function to get the rule name
   * @return
   */
  final property get RuleName() : String {
    return _ruleDTO.RuleName
  }

  /**
   * Function to set the rule description
   * @param desc
   */
  override property set RuleDescription(desc : String) {
    _ruleDTO.RuleDescription = desc
  }

  /**
   * Function to get the rule desctiption
   * @return
   */
  final property get RuleDescription() : String {
    return _ruleDTO.RuleDescription
  }

  /**
   * Function to report a violation
   * @param lineNum
   * @param line
   */
  final function reportViolation(lineNum : int, line : String = null) {
    var viol = new ViolationsDTO()
    viol.Rule = _ruleDTO
    viol.LineNumber = lineNum
    viol.Line = (line == null or line == "") ? null : line
    _fileMetaData.Violations.add(viol)
  }

  /**
   * function to report a failure during processing
   * @param error
   * @param terminateTheEntireProcess
   */
  final function reportInspectionFailure(error : Exception, terminateTheEntireProcess : boolean = false) {
    _fileMetaData.ProcessTerminationError = error
    if (terminateTheEntireProcess) {
      throw error
    }
  }

  /**
   * Function to track line
   * @param lineNumber
   * @param line
   */
  function trackAndFormatLine(lineNumber:int, line :  String) : String{
    _trackLineEnabled = true
    _isEmptyLine = false
    _isLineCommented_SingleLine = false
    line = line.trim()
    if(line != "" and line != null){
      if(line.startsWith("//")){
        _isLineCommented_SingleLine = true
        print("------------------------------------------------------------------line ${lineNumber} is commented - SINGLE LINE")
      }
      if(line.startsWith("/*") or _isLineCommented_MultiLine){
        _isLineCommented_MultiLine = true
        print("------------------------------------------------------------------line ${lineNumber} is commented - MULTILINE ")
      }
      if(line.contains("*/") and _isLineCommented_MultiLine){
        _isLineCommented_MultiLine = false
        print("------------------------------------------------------------------line ${lineNumber} is commented -- CLOSED")
      }
    }
    if(line == null or line == ""){
      _isEmptyLine = true
    }
    return _isEmptyLine ? null : line
  }

  /**
   * Function to check if the line is commented or not
   * @return
   */
  property get IsThisLineCommented() : boolean {
    if(not _trackLineEnabled){
      throw new Exception("'IsThisLineCommented' can be used only after using function trackAndFormatLine() inside your loop")
    }
    return _isLineCommented_SingleLine or _isLineCommented_MultiLine
  }

  /**
   * Function to check if the line is commented or not
   * @return
   */
  property get IsThisLineEmpty() : boolean {
    if(not _trackLineEnabled){
      throw new Exception("'IsThisLineCommented' can be used only after using function trackAndFormatLine() inside your loop")
    }
    return _isEmptyLine
  }

  /**
   * Function to determine if the file needs to be vaildated against the rule
   * @param fileMetaData
   * @return
   */
  override function shouldExecute(fileMetaData : FileMetadataDTO) : boolean {
    return true
  }


}