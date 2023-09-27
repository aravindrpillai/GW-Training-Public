package training.integrations.authentication.soap

uses gw.api.database.Query
uses gw.xml.ws.WsiAuthenticationException
uses gw.xsd.guidewire.soapheaders.Authentication
uses gw.plugin.security.WebservicesAuthenticationContext

/**
 * For soap, auth source is not needed to specify
 * COnfigure this class in plugin : WebservicesAuthenticationPlugin.gwp
 */
class SoapAuthentication implements gw.plugin.security.WebservicesAuthenticationPlugin {

  override function authenticate(webContext : WebservicesAuthenticationContext) : User {
    var QNameHeader = webContext.RequestSoapHeaders?.getChild(Authentication.$QNAME)
    var wsUserId = QNameHeader?.getChild(Authentication.$ELEMENT_QNAME_Username).$Text
    var wsPassword = QNameHeader?.getChild(Authentication.$ELEMENT_QNAME_Password).$Text
    var user = Query.make(User).join(User#Credential).compareIgnoreCase(Credential#UserName, Equals, wsUserId).select().single()
    return user
  }

}

