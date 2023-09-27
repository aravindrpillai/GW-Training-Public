uses gw.api.database.Queries
uses gw.api.database.Query

var specialityQuery = Queries.createQuery<Account>(Account)
Query.make(Account).compare(Account#AccountNumber, Equals, "2345678")
var deleteBuilder = new com.guidewire.pl.system.database.query.DeleteBuilder(specialityQuery)
deleteBuilder.execute()

//CPBuildingCovSpecCost
//IMAccountsRecPartCovCost