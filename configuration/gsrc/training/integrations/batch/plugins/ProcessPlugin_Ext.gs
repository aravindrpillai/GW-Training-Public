package training.integrations.batch.plugins

uses gw.plugin.processing.IProcessesPlugin
uses gw.processes.BatchProcess
uses training.integrations.batch.BatchProcessImpl_Ext

class ProcessPlugin_Ext implements IProcessesPlugin {

  /**
   * Function to create the BatchProcess
   * @param type      : Batch Type
   * @param arguments : Arguments for the  batch process
   * @return          : Instance of batch process
   */
  override function createBatchProcess(type : BatchProcessType, arguments : Object[]) : BatchProcess {
    switch(type) {
      case BatchProcessType.TC_MYCUSTOMBATCH_EXT:
        return new BatchProcessImpl_Ext()
      default:
        return null
    }
  }

}
