package training.integrations.datamodelupgrade

uses gw.api.database.upgrade.before.BeforeUpgradeVersionTrigger

abstract class BeforeUpgradeVersionTriggerBase extends BeforeUpgradeVersionTrigger {

  protected construct(minorVersionWhenTriggerIsApplicable : int) {
    super(minorVersionWhenTriggerIsApplicable)
  }

  function removeColumnFromTable(tableName :  String, columnName : String){
    var table = getTable(tableName)
    if(table.exists()){
      var columnToDrop = table.getColumn(columnName)
      if(columnToDrop.exists()){
        columnToDrop.drop()
      }else{
        throw new Exception("Table Column ${tableName}.${columnName} doesnt exist")
      }
    }else{
      throw new Exception("Table ${tableName} doesnt exist")
    }
  }

  function removeTable(tableName :  String){
    var table = getTable(tableName)
    if(table.exists()){
      table.drop()
    }
  }


  function renameColumn(tableName :  String, columnName : String, newColumnName : String){
    var table = getTable(tableName)
    if(table.exists()){
      var columnToDrop = table.getColumn(columnName)
      if(columnToDrop.exists()){
        columnToDrop.rename(newColumnName)
      }else{
        throw new Exception("Table Column ${tableName}.${columnName} doesnt exist")
      }
    }else{
      throw new Exception("Table ${tableName} doesnt exist")
    }
  }

}