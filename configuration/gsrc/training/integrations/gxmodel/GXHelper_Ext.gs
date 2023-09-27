package training.integrations.gxmodel

/**
 * GXOptions:
 The Incremental option accepts a Boolean value. Its default value is false.
 > true – Export only changed properties to the GX model.
 > false – Export all properties to the GX model, regardless of whether they have changed.

 The Verbose option specifies whether to export a property if the value is null.
 Its default value of verbose is false

 $ShouldSend
 This property returns true if at least one mapped data model field changed in the LOCAL DB BUNDLE.
 If you want to send your message only if data model fields changed, use this property to determine
 whether data model fields changed.
 note - This wont work if the bundle is already committed
 This condition is mainly used in Preupdates/Event fired where the bundle is yet to commit
 */
class GXHelper_Ext {

  function create(){
    var account = gw.api.database.Query.make(Account).select().FirstResult
    printAccountInfo(account)
    var gxOptions = new gw.api.gx.GXOptions() {
      :Incremental = false,
      :Verbose = true,
      :SuppressExceptions = true
    }

    var myGxModel = training.integrations.gxmodel.on.entity.accountmodel.Account.create(account, gxOptions)

    var shouldSend = myGxModel.$ShouldSend
    print("\nDid any value changed from previous version : " + shouldSend)

    var xmlPayload = myGxModel.asUTFString()

    print("\n"+xmlPayload)
  }

  function printAccountInfo(account : Account){
    print("Account Number      : "+account.AccountNumber)
    print("Account status code : "+account.AccountStatus.Code)
    print("Account Status desc : "+account.AccountStatus.Description)
    print("Account Create Time : "+account.CreateTime.XmlDateTime)
    print("Account Nick Name   : "+account.Nickname)
    print("Account Public ID   : "+account.PublicID)
  }

}