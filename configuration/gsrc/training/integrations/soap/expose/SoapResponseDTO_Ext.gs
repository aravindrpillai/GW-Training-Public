package training.integrations.soap.expose

uses gw.xml.ws.annotation.WsiExportable

@WsiExportable
final class SoapResponseDTO_Ext {

  var status : boolean as Status
  var message : String as Message
  var accountNumber : String as AccountNumber
  var accountHolderName : String as AccountHolderName
  var addressLine1 : String as AddressLine1
  var addressLine2 : String as AddressLine2
  var zipcode : String as Zipcode

}