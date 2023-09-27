package training.util.codeinspect.util

uses java.io.File
uses org.w3c.dom.Document
uses org.w3c.dom.NodeList
uses javax.xml.parsers.DocumentBuilderFactory

/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * desc : Utility class for readimg XMLs
 */
class XMLUtil {

  var _file : File
  var _document : Document
  construct(file : File){
    _file = file
    _document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(_file)
  }

  private construct(){}

  /**
   * Function to get the NodeList base on param name
   * @param tagName
   * @return
   */
  function getElementsByTagName(tagName : String) : NodeList {
    var elements = _document.getElementsByTagName(tagName)
    return elements
  }


}