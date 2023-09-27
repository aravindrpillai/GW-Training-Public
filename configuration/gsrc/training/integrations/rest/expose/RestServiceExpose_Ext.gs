package training.integrations.rest.expose

uses gw.api.database.Query
uses gw.api.json.JsonObject
uses gw.api.json.JsonConfigAccess
uses gw.api.json.mapping.TransformResult
uses gw.api.json.mapping.JsonMappingOptions
uses jsonschema.training.AccountSearchRequest.v1_0.Request
uses jsonschema.training.AccountSearchResponse.v1_0.Response

class RestServiceExpose_Ext {

  /**
   * Function to Search Account
   *
   * @param body - JSON Object
   * @return response as JSON Object
   * <p>
   * NOTE : use the below code to generate the wraper classes
   * : new com.guidewire.tools.json.JsonSchemaWrapperCodegenTool().runTool()
   */
  function searchAccount(body : JsonObject) : JsonObject {
    print("Starting soap process for payload.")
    var requestObj = Request.wrap(body)

    //Mapping the response object
    var myAccount = Query.make(Account).compare(Account#AccountNumber, Equals, requestObj.AccountNumber).select().AtMostOneRow
    var responseObj = new Response()
    responseObj.Status = (myAccount != null)
    responseObj.Message = (myAccount == null) ? "No Account found for account number  : ${requestObj.AccountNumber}" : null
    responseObj.AccountNumber = myAccount.AccountNumber
    responseObj.AccountHolderName = myAccount.AccountHolder?.DisplayName
    responseObj.AddressLine1 = myAccount?.AccountHolderContact?.PrimaryAddress?.AddressLine1
    responseObj.AddressLine2 = myAccount?.AccountHolderContact?.PrimaryAddress?.AddressLine2
    responseObj.Zipcode = myAccount?.AccountHolderContact?.PrimaryAddress?.PostalCode

    //unwrapping and returning
    print("done processing rest service request. sending response..")
    return responseObj.unwrap()
  }


  /**
   * Function to Search Account2
   *
   * @param body - JSON Object
   * @return response as JSON Object
   */
  function searchAccountWithMapperAndFilter(body : JsonObject) : TransformResult {
    print("Starting soap process for payload.")
    var requestObj = Request.wrap(body)

    //Querying & setting the response object
    var myAccount = Query.make(Account).compare(Account#AccountNumber, Equals, requestObj.AccountNumber).select().AtMostOneRow
    var responseObj = new ResponseDTO_EXT()
    responseObj.Status = (myAccount != null)
    responseObj.Message = "WithMapper :" + ((myAccount == null) ? "No Account found for account number  : ${requestObj.AccountNumber}" : "")
    responseObj.Account = myAccount

    //Configuring mapper
    var jsonResponseMapper = JsonConfigAccess.getMapper("training.AccountSearchResponse-1.0", "Response")

    //Configuring filter
    var filter = new JsonMappingOptions()
    filter.withFilter("training.AccountSearchResponseFilter-1.0")

    print("done processing rest service request. sending response..")
    return jsonResponseMapper.transformObject(responseObj, filter)
  }

}