package training.integrations.messaging.plugins

uses gw.plugin.PluginCallbackHandler
uses gw.plugin.messaging.MessageFinder
uses gw.plugin.messaging.MessageReply

/**

 To trigger the message reply, use the below code.
   var messageId = 12345
   var myMsgReplyPlugin = gw.plugin.Plugins.get("ICustomMessagingReplyPlugin_Ext")
   var reply = myMsgReplyPlugin as ReplypluginImpl_Ext
   reply.acknodwledge(messageId)
 */
class ReplypluginImpl_Ext implements MessageReply{

  var _destinationID : int as DestinationID = 63
  private var _callbackHandler : gw.plugin.PluginCallbackHandler
  private var _messageFinder : gw.plugin.messaging.MessageFinder

  override function initTools(handler : PluginCallbackHandler, msgFinder : MessageFinder) {
    _callbackHandler = handler
    _messageFinder = msgFinder
  }

  public function acknodwledge(msgId : long) {
    _callbackHandler.execute( \ -> {
      var message = _messageFinder.findById(msgId)
      if (message != null) {
        message.reportAck()
      }
    })
  }


  override function shutdown() {
    print("Control inside ReplypluginImpl_Ext.shutdown()")
  }

  override function suspend() {
    print("Control inside ReplypluginImpl_Ext.suspend()")
  }

  override function resume() {
    print("Control inside ReplypluginImpl_Ext.resume()")
  }

  override property set DestinationID(destinationID : int) {
    print("Control inside RequestPluginImpl_Ext.setDesinationID() : " + destinationID)
    _destinationID = destinationID
  }
}