package training.util.codeinspect.util

uses java.io.File
uses org.w3c.dom.Element
uses org.apache.log4j.Logger
uses training.util.codeinspect.dto.RuleDTO
uses javax.xml.parsers.DocumentBuilderFactory
uses training.util.codeinspect.constants.FileTypes

/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * desc : Class to read Conf.xml file and load it as DTO list
 */
class RulesXMLUtil {

  static final var _logger = Logger.getLogger(RulesXMLUtil)

  //Class init disabled
  private construct() {
  }

  /**
   * Function to load the conf file and convert it to DTO
   */
  static function getRules(skipDisabled : boolean = true) : List<RuleDTO> {
    var confPath = FileUtil.ThisFolder.concat("/constants/rules.xml")
    var file = new File(confPath)
    var document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(file)
    var rules = document.getElementsByTagName("rule")

    var disabled : boolean
    var rule : Element
    var ruleDTO : RuleDTO
    var ruleFor : String
    var rulesArray : List<String>
    var confDTOList = new ArrayList<RuleDTO>()
    var allowedFileTypes = FileTypes.AllValues*.Code.toList()

    foreach (i in 0..|rules.Length) {
      rule = rules.item(i) as Element
      disabled = Boolean.parseBoolean(rule.getAttribute("disabled"))
      if(disabled and skipDisabled){
        _logger.info("Skipping DISABLED RULE - "+rule.getAttribute("name"))
        continue
      }
      ruleDTO = new RuleDTO()
      ruleDTO.ClassName = rule.getAttribute("className")
      ruleDTO.RuleName = rule.getAttribute("name")
      ruleDTO.RuleDescription = rule.getAttribute("description")
      ruleDTO.Severity = Integer.parseInt(rule.getAttribute("severity"))
      ruleDTO.Disabled = disabled

      ruleFor = rule.getAttribute("ruleFor")?.trim()
      _logger.info("Rule '"+ruleDTO.RuleName+"' is for '"+ruleFor+"'")
      if (ruleFor != null and ruleFor != "") {
        rulesArray = ruleFor.toUpperCase().split(",")?.toList()
        if (rulesArray.countWhere(\elt -> allowedFileTypes.contains(elt.trim())) > 0) {
          ruleDTO.RuleFor = new ArrayList<FileTypes>()
          foreach(ruleAsStr in rulesArray){
            ruleDTO.RuleFor.add(FileTypes.valueOf(ruleAsStr.trim()))
          }
        } else {
          if (ruleFor.toUpperCase() == "ALL") {
            ruleDTO.RuleFor = FileTypes.AllValues
          } else {
            throw new IllegalStateException("Rule `" + ruleDTO.RuleName + "` has an inavlid type in field `ruleFor`. (see file `rules.xml`).")
          }
        }
      } else {
        ruleDTO.RuleFor = FileTypes.AllValues
      }
      confDTOList.add(ruleDTO)
    }
    return confDTOList
  }


}