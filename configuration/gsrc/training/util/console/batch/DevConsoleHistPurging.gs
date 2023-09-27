package training.util.console.batch

uses gw.api.database.Query
uses org.apache.log4j.Logger
uses gw.processes.BatchProcessBase
uses training.util.console.constants.Constants

/**
 * author : Krishna
 * data   : 02 Nov 2022
 * Class to handle data purging
 * NOTE : This is not scheduled - and is left to the end user
 *
 *   <typecode code="PurgeDevConsoleData" desc="Batch to purge Dev console Data." name="Purge Dev Console Data">
 *      <category code="UIRunnable" typelist="BatchProcessTypeUsage"/>
 *      <category code="Schedulable" typelist="BatchProcessTypeUsage"/>
 *   </typecode>
 */
class DevConsoleHistPurging extends BatchProcessBase {

  private static final var _logger = Logger.getLogger(DevConsoleHistPurging)

  public construct() {
    super(BatchProcessType.TC_PURGEDEVCONSOLEDATA)
  }

  /**
   * Function to check initial conditions
   *
   * @return
   */
  override function checkInitialConditions() : boolean {
    //Initial check can be written here
    return true
  }

  /**
   * Function to handle termination request
   *
   * @return
   */
  override function requestTermination() : boolean {
    super.requestTermination()
    return true
  }

  /**
   * Function to handle the work
   */
  override function doWork() {
    _logger.info("Starting batch to purge Console history")
    try {
      var consoleRecords = Query.make(DevConsoleHistory).select()
      OperationsExpected = consoleRecords.Count
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        for (record in consoleRecords) {
          if (TerminateRequested) {
            return
          }
          _logger.debug("Purging Console object with id : " + record.ID)
          var purgeRec = bundle.add(new DevConsoleHistoryPurged())
          purgeRec.ExecutedTime = record.ExecutedTime
          purgeRec.Content = record.Content
          purgeRec.IsSQLQuery = record.IsSQLQuery
          purgeRec.ClientIP = record.ClientIP
          purgeRec.UserExecuted = record.UserExecuted
          purgeRec.DataManipulated = record.DataManipulated
          purgeRec.RowsAffected = record.RowsAffected
          purgeRec.ErrorMessage = record.ErrorMessage
          purgeRec.ExecutionFailed = record.ExecutionFailed
          bundle.add(record).remove()
          incrementOperationsCompleted()
        }
      }, Constants.DBUser)
    } catch (e) {
      _logger.error(e.StackTraceAsString)
      incrementOperationsFailed()
    }
    _logger.info("Console history purging completed")
  }


}