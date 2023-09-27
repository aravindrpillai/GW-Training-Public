package training.util.gmaps

uses gw.api.json.JsonObject
uses gw.api.database.spatial.SpatialPoint
uses gw.api.web.template.TemplatePanelActionHandler

/**
 * author : Aravind R Pillai
 * date   : 18 Feb 2023
 * Class to handle GMaps Action
 */
class GmapActionHandler implements TemplatePanelActionHandler {

  var _address : Address

  construct(address : Address){
    _address = address
  }

  /**
   * Function to perfomr the action
   * Note : Make sure to add the _address in bundle if the GST file is called from a non Editable screen.
   * @param json
   */
  override function action(json : JsonObject) {
    print("Inside GmapActionHandler Class. Starting to update the cordinates")
    var latitude = json.get("latitude") as String
    var longitude = json.get("longitude") as String
    print("New Cordinates values are - ${latitude} , ${longitude}")

    try{
      var lat : Double = 0
      var lng : Double = 0
      try{ lat = Double.parseDouble(latitude) }catch(e){lat = 0}
      try{ lng = Double.parseDouble(longitude) }catch(e){lng = 0}
      _address.SpatialPoint = new SpatialPoint(lng, lat)
      _address.GeocodeStatus = GeocodeStatus.TC_EXACT
    }catch(e){
      print("Error from Action Handler : "+e.StackTraceAsString)
    }
    print("Successfully updated the cordinates from action() handler..")
  }

}
