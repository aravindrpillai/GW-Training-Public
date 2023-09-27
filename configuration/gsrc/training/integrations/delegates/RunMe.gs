package training.integrations.delegates

class RunMe {

  function runMeFunction() {
    print("starting...")
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var e = bundle.add(new MyEntityToTestDelegate())
      e.ThisTableColumn = "This table column"
      e.DelegateTableColumn = "Delegate Table Column"

      print("\nStarting to call function of delegate impl from the child entity")
      e.functionOnMyDelegate()

      print("\nStarting to call function of delegate 2 impl from the child entity")
      e.functionOnMyDelegate2()

    }, "su")
    print("done...")
  }

}