package training.integrations.datamodelupgrade.changes

uses training.integrations.datamodelupgrade.BeforeUpgradeVersionTriggerBase

class Entity_3_Update extends BeforeUpgradeVersionTriggerBase {

  protected construct(minorVersionWhenTriggerIsApplicable : int) {
    super(minorVersionWhenTriggerIsApplicable)
  }

  override function execute() {
    print("ENTITY_3_UPDATE__EXECUTE")
    //super.removeTable("pcx_entity_3")
  }

  override function hasVersionCheck() : boolean {
    return false
  }

  override property get Description() : String {
    return "Delete Table"
  }
}