package training.integrations.messaging.plugins

uses gw.plugin.messaging.MessageRequest

class RequestPluginImpl_Ext implements MessageRequest{

  var _destinationID : int = 63

  /**
   * This method will be executed only if the AferSend plugin is NOT configured inside messaging-config.xml
   * @param message
   */
  override function afterSend(message : Message) {
    print("Control inside RequestPluginImpl_Ext.afterSend()")
  }

  /**
   * Below function will be executed before executing the send() method of Transport plugin
   * @param message
   * @return
   */
  override function beforeSend(message : Message) : String {
    print("Control inside RequestPluginImpl_Ext.beforeSend()")
    print("Payload from EFR - "+message.Payload)
    var payload = "{'name':'Aravind', 'age':28, 'messageReferenceID':" + message.ID + "}"
    print("Payload : "+payload)
    return payload
  }

  override function shutdown() {
    print("Control inside RequestPluginImpl_Ext.shutdown()")
  }

  override function suspend() {
    print("Control inside RequestPluginImpl_Ext.suspend()")
  }

  override function resume() {
    print("Control inside RequestPluginImpl_Ext.resume()")
  }

  override property set DestinationID(destinationID : int) {
    print("Control inside RequestPluginImpl_Ext.setDesinationID() : " + destinationID)
    _destinationID = destinationID
  }
}