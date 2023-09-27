package training.integrations.soap.expose

uses gw.api.database.Query
uses gw.xml.ws.annotation.WsiPermissions
uses gw.xml.ws.annotation.WsiWebService

@WsiWebService
class SoapServiceExpose_Ext {

  /**
   * Function pulls the account details
   *
   * @param accountNumber param comment here
   * @return Your descriptions here!
   */
  function searchAccount(accountNumber:String) : SoapResponseDTO_Ext {
    var responseObj = prepareResponseObject(accountNumber)
    return responseObj
  }

  private function prepareResponseObject(accountNumber : String) : SoapResponseDTO_Ext {
    var myAccount = Query.make(Account).compare(Account#AccountNumber, Equals, accountNumber).select().AtMostOneRow
    var response = new SoapResponseDTO_Ext()
    if (myAccount == null) {
      response.Status = false
      response.Message = "No Account found for account number  : " + accountNumber
    } else {
      response.AccountNumber = myAccount.AccountNumber
      response.AccountHolderName = myAccount.Nickname
      var address = myAccount.AccountHolderContact.getPrimaryAddress()
      response.AddressLine1 = address.AddressLine1
      response.AddressLine2 = address.AddressLine2
      response.Zipcode = address.PostalCode
      response.Status = true
      response.Message = null
    }
    return response
  }


}