package training.integrations.datamodelupgrade

uses gw.api.database.upgrade.after.AfterUpgradeVersionTrigger
uses gw.api.database.upgrade.before.BeforeUpgradeVersionTrigger
uses gw.api.datamodel.upgrade.IDatamodelChange
uses gw.plugin.upgrade.IDatamodelUpgrade
uses training.integrations.datamodelupgrade.changes.Entity_1_Update
uses training.integrations.datamodelupgrade.changes.Entity_2_Update
uses training.integrations.datamodelupgrade.changes.Entity_3_Update

/**
 * Author :  Aravind
 *
 * Integer passed inside the "Entity_1_Update" must be the value on extension.properties.
 * this class gets executed only only when the value = extension.properties
 *
 * NOTE - The entire framework gets executed when
 * ------ * There is any change in the Data Model
 * ------ * There the value of extension.properties are modified
 */
class DataModelUpgradeImpl implements IDatamodelUpgrade {

  override property get MajorVersion() : int {
    return 0 //Return 0 only
  }

  override property get BeforeUpgradeDatamodelChanges() : List<IDatamodelChange<BeforeUpgradeVersionTrigger>> {
    print("BEFORE UPGRADE - Starting the datamodel upgrade process")
    var beforeDataChanges = new ArrayList<IDatamodelChange<BeforeUpgradeVersionTrigger>>()
    //beforeDataChanges.add(new BeforeDatamodelChangeImpl(new Entity_1_Update(55)))
    //beforeDataChanges.add(new BeforeDatamodelChangeImpl(new Entity_2_Update(55)))
    //beforeDataChanges.add(new BeforeDatamodelChangeImpl(new Entity_3_Update(55)))
    print("BEFORE UPGRADE - Datamodel upgrade process done")
    return beforeDataChanges
  }

  override property get AfterUpgradeDatamodelChanges() : List<IDatamodelChange<AfterUpgradeVersionTrigger>> {
    print("AFTER UPGRADE - Starting the datamodel upgrade process")
    var afterDataChanges = new ArrayList<IDatamodelChange<AfterUpgradeVersionTrigger>>()
    print("AFTER UPGRADE - Datamodel upgrade process done")
    return afterDataChanges
  }
}