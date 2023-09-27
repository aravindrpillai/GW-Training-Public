uses gw.plugin.contact.ContactSystemPlugin

var plugin = gw.plugin.Plugins.get(ContactSystemPlugin)

var contactSystemEnabled = gw.plugin.Plugins.isEnabled(ContactSystemPlugin)
print("Plugin Enabled : "+contactSystemEnabled)

try {
  var output = plugin.retrieveContact("abc:123", null)
  print("Output : "+output)

} catch (e){
  print(e.StackTraceAsString)
}