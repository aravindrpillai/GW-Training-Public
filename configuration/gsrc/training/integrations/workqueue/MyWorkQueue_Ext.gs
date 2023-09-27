package training.integrations.workqueue

uses gw.api.database.Query
uses gw.pl.persistence.core.Bundle
uses gw.processes.WorkQueueBase

class MyWorkQueue_Ext extends WorkQueueBase<Account, StandardWorkItem> {

  protected construct() {
    super(BatchProcessType.TC_MYCUSTOMBATCH_EXT, StandardWorkItem, Account)
  }

  /**
   * Function to return the targets
   * @return - Iterator of accounts
   */
  override function findTargets() :Iterator <Account> {
    var accounts = Query.make(Account)
    .compare(Account#CreateTime.PropertyInfo.Name, GreaterThanOrEquals, Date.CurrentDate.addMonths(-1))
    .select()
    print("Accounts found : "+accounts.Count)
    return accounts.iterator()
  }

  /**
   * Function to determine if the particular record needs to be processed or not..
   * @param account
   * @return
   */
  override function shouldProcessItem(account:Account):boolean{
    return true
  }


  /**
   * Function to create Workitem.
   * NOTE : This function is required ONLY if 'Custom Work Item' is used..!
   * @param account
   * @param bundle
   * @return
   */
  override function createWorkItem(account : Account, bundle : Bundle) : StandardWorkItem {
    var wi = new StandardWorkItem(bundle)
    wi.Target = account.ID.Value
    return wi
  }


  /**
   * Function to do the process
   * @param item
   *  Use softentityreference (a soft link) rather than foreignkey (a hard link).
   *  A softentityreferece is a foreign key for which PolicyCenter does not enforce integrity constraints in the database.
   *  The use of a hard foreign key in this context would do the following:
   *    - Require that you delete the work item row from the database before you delete or archive the linked entity row.
   *    - Can force gw to include the custom work item table in the main domain graph.
   */
  override function processWorkItem(item : StandardWorkItem) {
    var account = extractTarget(item) // Convert the ID of the target to an object reference
  }
}