package training.util.codeinspect.dto

uses training.util.codeinspect.constants.FileTypes

/**
 * author : Aravind R Pillai
 * date : 03 Oct 2022
 * Desc :  DTO class to hold the CONF.xml data
 */
class RuleDTO {

  private var _className : String as ClassName
  private var _ruleName : String as RuleName
  private var _ruleDescription : String as RuleDescription = null
  private var _severity : int as Severity = 3
  private var _disabled : boolean as Disabled = false
  private var _for : List<FileTypes> as RuleFor = {}

  /**
   * function to return the dto content
   *
   * @return String
   */
  override function toString() : String {
    return "ClassName : " + ClassName +
        " | RuleName : " + RuleName +
        " | Severity : " + Severity +
        " | Disabled : " + Disabled +
        " | RuleDescription : " + RuleDescription +
        " | RuleFor : " + RuleFor?.toString()
  }
}