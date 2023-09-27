package training.integrations.gxmodel

uses gw.api.database.Query
uses gw.api.json.JsonConfigAccess
uses training.integrations.gxmodel.on.dto.GXDTO

class UsingViews {

  function createPayload(accNo : String) {

    var myAccount = Query.make(Account).compare(Account#AccountNumber, Equals, accNo).select().AtMostOneRow
    var dto = new GXDTO()
    dto.Account = myAccount
    dto.Policy = myAccount.Policies.first()
    dto.IsPolicyAnyGood = true
    dto.SenderName = myAccount.DisplayName
    dto.Date = Date.CurrentDate

    var jsonResponseMapper = JsonConfigAccess.getMapper("training.AccountSearchResponse-1.0", "Response")
    var jsonObj = jsonResponseMapper.transformObject(dto)
    var jsonString = jsonObj.toJsonString()
    var xmlString = jsonObj.toXmlElement()
  }

}