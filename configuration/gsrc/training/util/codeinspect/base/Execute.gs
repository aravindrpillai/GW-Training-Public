package training.util.codeinspect.base

uses org.apache.log4j.Logger
uses training.util.codeinspect.dto.RuleDTO
uses training.util.codeinspect.util.FilesXMLUtil
uses training.util.codeinspect.dto.FileMetadataDTO
uses training.util.codeinspect.util.PropertyReaderUtil

/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * Desc : Main class to start the process
 */
class Execute {

  static final var _logger = Logger.getLogger(Execute)

  /**
   * Function to start the process
   */
  function run(filesXMLLocation : String = null){
    var fileConfigs = FilesXMLUtil.getFileDetails(filesXMLLocation)
    var pfObj = new PrepareFiles()
    var fileMetadataList = pfObj.prepare(fileConfigs)
    _logger.info("Created " + fileMetadataList.Count + " metadata files")
    foreach(fileMetaData in fileMetadataList){
      foreach(rule in fileMetaData.Rules){
        invokeFramework(fileMetaData, rule)
      }
      _logger.debug("Done validation for " + fileMetaData.FileName)
    }
    new DocumentBuilder().buildDocument(fileMetadataList)
    _logger.info("Execution completed.")
  }

  /**
   * Reflection to invoke the method from the rules
   * @param file
   * @param rule
   */
  private function invokeFramework(file : FileMetadataDTO, rule : RuleDTO){
    var appPackage = PropertyReaderUtil.getProperty("codeinspect.this.accelerator.relative.location")
    var rulesPackage = appPackage.replaceAll("/", ".").remove("gsrc.").concat(".rules.")
    var functionName = "run"
    var paramValues : Object[] = {file, rule}
    var paramdataTypes : Class<Object>[] = {FileMetadataDTO, RuleDTO}
    var cls = Class.forName(rulesPackage + rule.ClassName)
    var inst = cls.newInstance()
    var func = cls.Superclass.getDeclaredMethod(functionName, paramdataTypes);
    func.invoke(inst, paramValues);
  }
}