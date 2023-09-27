



function doCondition(messageContext : MessageContext) : boolean{
  var period = messageContext.Root as PolicyPeriod
  if(messageContext.EventName == "IssuePolicy"){
    return period.NewlyAddedForms.HasElements
  }
  return false
}


function doAction(messageContext : MessageContext){
  var period = messageContext.Root as PolicyPeriod
  var form = period.NewlyAddedForms.firstWhere(\elt -> elt.FormPatternCode == "My_FORM_PATTERN")
  var payload = form.ParsedFormContent.asFormattedUTFString()
  messageContext.createMessage(payload)
}