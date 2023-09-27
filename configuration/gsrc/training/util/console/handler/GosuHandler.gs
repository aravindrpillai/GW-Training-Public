package training.util.console.handler

uses org.apache.log4j.Logger
uses gw.lang.reflect.TypeSystem
uses gw.lang.parser.ParserOptions
uses gw.lang.parser.GosuParserFactory
uses gw.api.util.DisplayableException
uses gw.lang.parser.ScriptabilityModifiers
uses gw.lang.reflect.IScriptabilityModifier
uses training.util.console.constants.Constants
uses training.util.console.dao.ConsoleRegister
uses training.util.console.templates.CodeTemplate
uses training.util.console.util.ConsolePermissionUtil

/**
 * author : Aravind
 * date : 28 Sept 2022
 * Class to execute gosu code
 */
class GosuHandler {

  private static final var _logger = Logger.getLogger(GosuHandler)

  /**
   * Function to execute the code
   * @param code
   * @return
   */
  public function execute(code : String) : String {
    _logger.info("Starting to execute gosy query")
    if(code == null or code == ""){
      throw new DisplayableException("Console is empty.")
    }
    _logger.debug("Code is : "+code)
    var isUpdateQuery = false
    var error : Exception = null
    if(code.containsIgnoreCase("devconsolehistory") and Constants.DisableOperationsOnMasterTable){
      throw new DisplayableException("Access to master table is denied. To view the content you can use the history tab")
    }
    if(code.containsIgnoreCase(".currentbundle") or code.containsIgnoreCase(".runwithnewbundle")){
      isUpdateQuery = true
      if(not ConsolePermissionUtil.Instance.DoesUserHaveFullPermission){
        error = new Exception("Permission Denied : This user does not have data write access")
      }
    }
    var imports = new ArrayList<String>()
    var codeLines = new ArrayList<String>()
    foreach(eachLine in code.split("\n")){
      if(eachLine.startsWith("uses ")){
        imports.add(eachLine)
      }else{
        if(eachLine?.trim() != null and eachLine?.trim() != ""){
          codeLines.add(eachLine)
        }
      }
    }

    var formattedCode = CodeTemplate.renderToString(imports, codeLines)
    var response : String = null
    try {
      var parser = GosuParserFactory.createParser(TypeSystem.getCompiledGosuClassSymbolTable(), ScriptabilityModifiers.SCRIPTABLE as IScriptabilityModifier)
      var programParser = GosuParserFactory.createProgramParser()
      var options = (new ParserOptions()).withParser(parser).asThrowawayProgram()
      var result = programParser.parseExpressionOrProgram(formattedCode, parser.getSymbolTable(), options)
      var output = result.evaluate()
      var sb = new StringBuilder()
      foreach(line in (output as List<Object>)){
        sb.append(line).append("\n")
      }
      response = sb.toString()
    } catch (t : Exception) {
      _logger.error(t.StackTraceAsString)
      error = t
    }

    //Create history
    new ConsoleRegister().registerForGosu(code, isUpdateQuery, error)
    if(error != null){
      throw new DisplayableException(error.Message)
    }
    return response
  }

}