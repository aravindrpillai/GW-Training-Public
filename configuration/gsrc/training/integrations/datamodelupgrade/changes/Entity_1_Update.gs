package training.integrations.datamodelupgrade.changes

uses training.integrations.datamodelupgrade.BeforeUpgradeVersionTriggerBase

class Entity_1_Update extends BeforeUpgradeVersionTriggerBase {

  protected construct(minorVersionWhenTriggerIsApplicable : int) {
    super(minorVersionWhenTriggerIsApplicable)
  }

  override function execute() {
    print("ENTITY_1_UPDATE__EXECUTE")
    //super.renameColumn("pcx_entity_1", "column_name_old", "column_name_new")
  }

  override function hasVersionCheck() : boolean {
    return false
  }

  override property get Description() : String {
    return "Update column name"
  }
}