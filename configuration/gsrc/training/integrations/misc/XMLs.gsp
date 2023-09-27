uses gw.api.util.TypecodeMapperUtil
uses javax.xml.namespace.QName
uses java.io.BufferedWriter
uses java.io.FileWriter
uses gw.xml.XmlElement
uses java.io.File


/**
 * code to parse an xml
 */
function parseXMLExample () : void {
  var xmlFile = new File("xml_location.xml")
  var xml = XmlElement.parse(xmlFile)
  var vehicles = xml.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Vehicles")
  for (eachVehicle in vehicles.$Children index i) {
    var year = eachVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Year").$Text
    var make = eachVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Make").$Text
    var model = eachVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Model").$Text
    print (i + " - " + year + " - " + make + " - " + model)
  }
}


/**
 * function to apppend an new summary to the xml
 */
function exportXMLExample () : void {
  var xmlFile = new File("xml_location.xml")
  var xml = XmlElement.parse(xmlFile)
  var vehiclesOnPolicy = xml.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Vehicles")
  for (currentVehicle in vehiclesOnPolicy.$Children) {
    var year = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Year").$Text
    var make = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Make").$Text
    var model = currentVehicle.$Children.singleWhere(\ el -> el.$QName.LocalPart == "Model").$Text

    var summary = new XmlElement(new QName("http://abc.com/xml/namespace", "Summary"))
    summary.set$Text(year + " " + make + " " + model)
    currentVehicle.addChild(summary)
  }

  var outputAsUTFString = new BufferedWriter(new FileWriter(new File("output_file_location.xml")))
  outputAsUTFString.write(xml.asUTFString())
  outputAsUTFString.close()
}