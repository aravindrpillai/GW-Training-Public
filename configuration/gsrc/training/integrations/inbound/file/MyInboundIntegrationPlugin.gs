package training.integrations.inbound.file

uses gw.plugin.integration.inbound.InboundIntegrationHandlerPlugin

/**
 * Setup :
 * We need to configure 2 plugins for this.
 *  1. MyInboundIntegrationPlugin implements InboundIntegrationHandlerPlugin
 *        - refer this gosu class as the implementation
 *  2. MyInboundIntegrationPluginStartable implements InboundIntegrationStartablePlugin
 *        - add property --> "integrationservice" and the value must be same the name configired in the inbound-integ-config.xml file
 *        - refer the java implementation - com.guidewire.pl.integration.inbound.file.DefaultFileInboundIntegrationPlugin
 */
class MyInboundIntegrationPlugin implements InboundIntegrationHandlerPlugin {

  construct(){
    print("MyInboundIntegration constructor()")
  }

  override function process(obj: Object) {
    print("Control inside the process method()")
    //value of obj depends on the "processingmode"
    // if its "line", the value of obj will be each line
    // if its "file", the value of obj will be file
    print("-----------> "+typeof (obj))
  }

}