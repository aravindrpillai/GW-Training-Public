uses gw.api.database.QuerySelectColumns
uses gw.api.path.Paths

var query = gw.api.database.Query.make(Account)
query.withDistinct(true)

//Column Selective Filer
var d = query.select({
    QuerySelectColumns.pathWithAlias("AccountNumber", Paths.make(Account#AccountNumber)),
    QuerySelectColumns.pathWithAlias("NickName", Paths.make(Account#Nickname))
})
d.first().getColumn("AccountNumber")

//WHERE conditions
query.compare(Account#AccountNumber, Equals, "111")
query.compareIgnoreCase(Account#AccountNumber, Equals, "111")
query.between(Account#AccountNumber,100, 200)
query.compareIn(Account#AccountNumber,{"111","222"})
query.compareNotIn(Account#AccountNumber,{"111","222"})
query.startsWith(Account#AccountNumber,"111",true) //3rd param - ignoreCase
query.contains(Account#AccountNumber,"111",true)   //3rd param - ignoreCase

//this will log the sql query
query.withLogSQL(true)

//LimitBy
var result = query.select()
result.getCountLimitedBy(10)
result.setPageSize(10)

//Combining 2 Queries
var query2 = gw.api.database.Query.make(Account)
var union = query.union(query2)

//Using Expressions
gw.api.database.Query.make(PolicyPeriod)
    .compare(gw.api.database.DBFunction.Expr({"TermNumber", "-", "PolicyConvertedOnTerm_GRG"}), Equals, gw.api.database.DBFunction.Constant(1))
    .select()

//Subselect
/* SELECT ID FROM pc_user WHERE ID IN (SELECT AuthorID FROM pc_note) */
var userQuery = gw.api.database.Query.make(User)
var noteQuery = gw.api.database.Query.make(Note)
userQuery.subselect(User#ID, gw.api.database.InOperation.CompareIn, noteQuery, Note#Author )