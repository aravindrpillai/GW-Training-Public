package training.integrations.inbound.jms

uses gw.plugin.PluginCallbackHandler
uses gw.plugin.integration.inbound.InboundIntegrationMessageReplyHandler
uses gw.plugin.messaging.MessageFinder

class JMSInbound implements InboundIntegrationMessageReplyHandler {

  override function process(o : Object) {

  }

  override function initTools(handler : PluginCallbackHandler, msgFinder : MessageFinder) {

  }

  override function shutdown() {

  }

  override function suspend() {

  }

  override function resume() {

  }

  override property set DestinationID(destinationID : int) {

  }
}