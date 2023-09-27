package training.util.codeinspect.dto

/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * Desc :  DTO class to hold the violation data
 */
class ViolationsDTO {
  var _rule : RuleDTO as Rule
  var _lineNumber : Integer as LineNumber
  var _line : String as Line = null
}