package training.integrations

uses gw.forms.FormData
uses gw.forms.FormInferenceContext
uses gw.xml.XMLNode
uses training.integrations.messaging.TriggerMessaging
uses training.util.kafka.Consumer
uses training.util.kafka.Producer
uses training.util.kafka.Topics

class Trigger extends FormData{


  override function populateInferenceData(context : FormInferenceContext, availableStates : Set<Jurisdiction>) {

  }

  override property get InferredByCurrentData() : boolean {
    return false
  }

  override function addDataForComparisonOrExport(contentNode : XMLNode) {

  }
}