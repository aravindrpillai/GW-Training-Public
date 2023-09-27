
/*
Note:
Typelist : RunTimePropertyGroup.tti
File: RuntimeProperties.xml
  <Properties xmlns="http://guidewire.com/psc/properties">
    <Property>
      <Group>integration</Group>
      <Name>TestOne</Name>
      <Description/>
      <Value>Value</Value>
    </Property>
  </Properties>
 */

uses gw.api.properties.RuntimePropertyRetriever

var runtimePropertyRetriever = new RuntimePropertyRetriever(RuntimePropertyGroup.TC_CONFIGURATION)
var value = runtimePropertyRetriever.getStringProperty("TestOne")