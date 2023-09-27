package training.integrations.datamodelupgrade

uses gw.api.archiving.upgrade.ArchivedDocumentUpgradeVersionTrigger
uses gw.api.datamodel.upgrade.IDatamodelChange
uses gw.api.database.upgrade.VersionAction

class BeforeDatamodelChangeImpl <D extends VersionAction> implements IDatamodelChange<D> {

  private final var _versionTriggerObject : D

  construct(versionTriggerObject : D){
    _versionTriggerObject = versionTriggerObject
  }

  override property get DatabaseUpgradeVersionTrigger() : D {
    return _versionTriggerObject
  }

  override property get ArchivedDocumentUpgradeVersionTrigger() : ArchivedDocumentUpgradeVersionTrigger {
    return null
  }

}