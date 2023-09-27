package training.util.gmaps

uses gw.api.json.JsonObject
uses gw.api.database.spatial.SpatialPoint
uses gw.api.web.template.TemplatePanelUpdateHandler

/**
 * author : Aravind R Pillai
 * date   : 18 Feb 2023
 * Class to handle GMaps update
 */
class GmapUpdateHandler implements TemplatePanelUpdateHandler {

  var _address : Address

  construct(address : Address){
    _address = address
  }


  /**
   * Function to perfomr the action
   * Note : Make sure to add the _address in bundle if the GST file is called from a non Editable screen.
   * @param json
   */
  override function update(json : JsonObject) : JsonObject {
    print("Inside GmapUpdateHandler class. Starting to update the cordinates.")
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
      print("Error From Update Handler : "+e.StackTraceAsString)
    }
    print("Successfully updated the cordinates from update() handler.")

    //Building a response (sample) - this is nit used in the GST
    var response = new JsonObject()
    response.put("key_1", "value_1")
    response.put("key_2", "value_2")
    return response
  }
}
