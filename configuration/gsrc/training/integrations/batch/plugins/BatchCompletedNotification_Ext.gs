package training.integrations.batch.plugins

uses gw.plugin.workqueue.IBatchCompletedNotification
uses training.integrations.batch.BatchCompletedImpl_Ext

class BatchCompletedNotification_Ext implements IBatchCompletedNotification {

  /**
   * Function gets executed when the batch is completed
   *
   * @param process         history of batch
   * @param workItemsFailed count
   */
  override function completed(process : ProcessHistory, workItemsFailed : int) {
    switch (process.ProcessType) {
      case BatchProcessType.TC_MYCUSTOMBATCH_EXT:
        new BatchCompletedImpl_Ext().complete(process, workItemsFailed)
        break
    }
  }
}