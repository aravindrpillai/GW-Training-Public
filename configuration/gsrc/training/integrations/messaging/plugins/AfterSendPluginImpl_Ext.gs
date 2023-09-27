package training.integrations.messaging.plugins

uses gw.plugin.messaging.MessageAfterSend

class AfterSendPluginImpl_Ext implements MessageAfterSend{

  var _destinationID : int as DestinationID = 63

  /**
   * Control comes inside After send post executing the send() menthod of Transport Plugin
   * @param message
   */
  override function afterSend(message : Message) {
    print("Control inside AfterSendPluginImpl_Ext.afterSend()")
  }


  override function shutdown() {
    print("Control inside AfterSendPluginImpl_Ext.shutdown()")
  }

  override function suspend() {
    print("Control inside AfterSendPluginImpl_Ext.suspend()")
  }

  override function resume() {
    print("Control inside AfterSendPluginImpl_Ext.resume()")
  }

  override property set DestinationID(destinationID : int) {
    print("Control inside AfterSendPluginImpl_Ext.setDesinationID() : " + destinationID)
    _destinationID = destinationID
  }
}