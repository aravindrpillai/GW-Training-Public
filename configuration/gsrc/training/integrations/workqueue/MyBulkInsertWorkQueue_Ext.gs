package training.integrations.workqueue

uses gw.processes.BulkInsertWorkQueueBase

class MyBulkInsertWorkQueue_Ext extends BulkInsertWorkQueueBase<Account, StandardWorkItem> {


  protected construct() {
    super(BatchProcessType.TC_MYCUSTOMBATCH_EXT, StandardWorkItem, Account)

  }

  /**
   * Function instead of FindTargets()
   * @param builder
   * @param batchProcessArgs
   */
  protected override function buildBulkInsertSelect(builder : Object, batchProcessArgs : List<Object>) {
    var allowFailedDuplicates = true //Whether to recreate a failed work item.
    excludeDuplicatesOnStandardWorkItem(builder, allowFailedDuplicates)

    var sourceQuery = extractSourceQuery(builder)
    sourceQuery.compare(Account#CreateTime.PropertyInfo.Name, LessThanOrEquals,Date.Today.addBusinessDays(-5))
  }

  override function processWorkItem(item : StandardWorkItem) {
    var account = extractTarget(item) // Convert the ID of the target to an object reference

  }

}