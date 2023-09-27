package training.integrations.batch

uses gw.api.database.Query
uses gw.processes.BatchProcessBase

class BatchProcessImpl_Ext extends BatchProcessBase {

  construct() {
    super(BatchProcessType.TC_MYCUSTOMBATCH_EXT)
  }

  //Handler to check the initial conditions.
  //Batch will be executed if this returns true
  override function checkInitialConditions() : boolean {
    return true
  }

  //Provides a description for the batch
  override property get Description() : String {
    return "Batch description"
  }

  //Control Comes here, when Termination is requested.
  override function requestTermination() : boolean {
    //do our logic here
    return super.requestTermination()
  }

  //If true - Cannot run the same batch multiple times together.
  override property get Exclusive() : boolean {
    return true
  }

  protected override function doWork() {
    var accounts = Query.make(Account).select()
    var chunkSize = 100
    setChunkingById(accounts, chunkSize) // or accounts.setPageSize(100)
    OperationsExpected = accounts.Count
    var itr = accounts.iterator()
    while (itr.hasNext() and not TerminateRequested) {
      try {
        //logic
        incrementOperationsCompleted()
      } catch (e : Exception) {
        incrementOperationsFailed()
      }
    }
  }

}