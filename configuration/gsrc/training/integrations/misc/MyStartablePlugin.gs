package training.integrations.misc

uses gw.api.startable.IStartablePlugin
uses gw.api.startable.StartablePluginCallbackHandler
uses gw.api.startable.StartablePluginState

class MyStartablePlugin implements IStartablePlugin {

  override function start(pluginCallbackHandler : StartablePluginCallbackHandler, serverStarting : boolean) {
    print("Starting the server")
  }

  override function stop(serverShuttingDown : boolean) {
    print("Stop triggered")
  }

  override property get State() : StartablePluginState {
    return this.State
  }
}