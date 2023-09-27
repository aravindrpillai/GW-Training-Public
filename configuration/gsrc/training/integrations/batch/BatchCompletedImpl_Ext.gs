package training.integrations.batch

class BatchCompletedImpl_Ext {

  function complete(processHistory : ProcessHistory, failedCount : int){

    print("Completed ${processHistory.ProcessType} with ${failedCount} Failed Count")

  }

}