package training.util.codeinspect.base

uses training.util.codeinspect.dto.RuleDTO
uses training.util.codeinspect.dto.FileMetadataDTO

/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * desc : Abstract class with the main functions for the rule
 */
abstract class CodeInspectCore {

  /**
   * Function to get the rule
   * @return
   */
  abstract property get Rule() : RuleDTO;

  /**
   * Function to update the rule description
   * @param desc
   */
  abstract property set RuleDescription(desc : String);

  /**
   * Function to determine if the file needs to be executed against the rule
   * @param fileMetaData
   * @return
   */
  abstract function shouldExecute(fileMetaData : FileMetadataDTO) : boolean;

  /**
   * The rule that gets executed
   * @param fileMetaData
   * @param lines
   */
  abstract function rule(fileMetaData : FileMetadataDTO, lines : List<String>);



}