package training.integrations.datamodelupgrade.changes

uses training.integrations.datamodelupgrade.BeforeUpgradeVersionTriggerBase

class Entity_2_Update extends BeforeUpgradeVersionTriggerBase {

  protected construct(minorVersionWhenTriggerIsApplicable : int) {
    super(minorVersionWhenTriggerIsApplicable)
  }

  override function execute() {
    print("ENTITY_2_UPDATE__EXECUTE")
    //super.removeColumnFromTable("pcx_entity_2","column_name")
  }

  override function hasVersionCheck() : boolean {
    return false
  }

  override property get Description() : String {
    return "Delete column"
  }
}