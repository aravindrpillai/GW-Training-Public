package training.integrations.messaging

class TriggerMessaging {

  function trigger(){
    print("Starting to trigger Messaging")

    var account = gw.api.database.Query.make(Account).select().FirstResult
    print("Accoun Number : " + account.AccountNumber)

    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var writableAccount = bundle.add(account)
      writableAccount.addEvent("MyCustomEvent_Ext")
    },"su")

    print("Done...")
  }

}