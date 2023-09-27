package training.integrations.forms

uses gw.forms.FormInferenceContext
uses gw.forms.FormData
uses gw.xml.XMLNode

/**
 * Aravind R Pillai
 *
 * desc :
 * 1. Create the class which extends FormData
 * 2. Go to the forms section of a Policy in the Product Designer and provide the absolute path of the file
 * 3. Whenever a change happens the Forms framework will spin this up and and event will be triggered (based on the policy action)
 *    Entity Involved -> Form.eti
 * 4. In the EFR, get the forms using the below code
 *      var period : PolicyPeriod
 *      var form = period.NewlyAddedForms.firstWhere(\elt -> elt.FormPatternCode == "My_FORM_PATTERN")
 *      var payload = form.ParsedFormContent.asFormattedUTFString()
 *      messageContext.createMessage(payload)
 */
class MyFormsInferenceClass extends FormData {

  private var _accountHolderName : String
  private var _accountNumber :  String

  /**
   * This function is to prepare the inference data.
   * We need to store the data that is needed to create the context in global variables to access it from the last function
   * @param context
   * @param availableStates
   */
  override function populateInferenceData(context : FormInferenceContext, availableStates : Set<Jurisdiction>) {
    var account = context.Period.Policy.Account
    _accountHolderName = account.DisplayName
    _accountNumber = account.AccountNumber
  }

  override property get InferredByCurrentData() : boolean {
    return false
  }

  /**
   * PolicyCenter only calls this after your FormData object creates inference data.
   * The function is the switch to execute addDataForComparisonOrExport()
   */
  property get ShouldBeAdded() : boolean {
    return _accountNumber != "123456"
  }

  /**
   * Prepare the form context here
   * @param contentNode
   */
  override function addDataForComparisonOrExport(contentNode : XMLNode) {
    var node = new XMLNode("AccountInfo")
    node.setAttributeValue("AccountNumber", _accountNumber )
    node.setAttributeValue("AccountHolder", _accountHolderName )
    contentNode.addChild(node)
  }
}