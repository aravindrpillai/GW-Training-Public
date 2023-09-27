package training.integrations.messaging.plugins

uses gw.plugin.messaging.MessageTransport

class TransportPluginImpl_Ext implements MessageTransport {

  var _destinationID : int as DestinationID = 63


  /**
     * function to Write the web-service call logic
     * @param message
     * @param transformedPayload
     */
    override function send(message : Message, transformedPayload : String) {
      print("Control inside TransportPluginImpl_Ext.send()")
      try {
        var account = message.MessageRoot as Account
        print("Message Root : " + account.AccountNumber)
        print("EFR Payload for processing : " + message.Payload)
        print("Final Payload for processing : " + transformedPayload)


        // new RestConsume_Ext().makeServiceCall()
        // Call the service from here
        var raiseError = false
        if(raiseError){
          throw new Exception("ssss")
        }


        message.reportAck()
      } catch (e : Exception) {
        print("Reporting Error - TransportPluginImpl_Ext.send()")
        message.reportError()
      }
    print("Done TransportPluginImpl_Ext.send()")
  }

  override function shutdown() {
    print("Control inside TransportPluginImpl_Ext.shutdown()")
  }

  override function suspend() {
    print("Control inside TransportPluginImpl_Ext.suspend()")
  }

  override function resume() {
    print("Control inside TransportPluginImpl_Ext.resume()")
  }

  override property set DestinationID(destinationID : int) {
    print("Control inside TransportPluginImpl_Ext.setDesinationID() : " + destinationID)
    _destinationID = destinationID
  }
}