uses training.integrations.soap.consume.soapconsumewsc.soapserviceexpose_ext.SoapServiceExpose_Ext

var accountNumber = "7406874502"
print("Starting to trigger SOAP request - Account Number : " + accountNumber)

var api = new SoapServiceExpose_Ext()
api.Config.Http.Authentication.Basic.Username = "su"
api.Config.Http.Authentication.Basic.Password = "gw"

var resp = api.searchAccount(accountNumber)

print("Account Number : " + resp.AccountNumber)
print("AccountHolderName : " + resp.AccountHolderName)
print("Address  : " + resp.AddressLine1 + ", " + resp.AddressLine2 + ", " + resp.Zipcode)
print("Status : " + resp.Status)
print("Message : " + resp.Message)
print("Done..")