package training.integrations.authentication.native

uses gw.plugin.security.AuthenticationSource
uses gw.plugin.security.AuthenticationSourceCreatorPlugin
uses training.integrations.authentication.native.source.NativeSource
uses training.integrations.authentication.native.source.PortalSource
uses wsi.local.gw.wsi.pl.loginapi.faults.LoginException

uses javax.servlet.http.HttpServletRequest

public class AuthenticationSourceCreationPluginImpl implements AuthenticationSourceCreatorPlugin {

  override function createSourceFromHTTPRequest(request : HttpServletRequest) : AuthenticationSource {
    var source : AuthenticationSource
    var userName : String = request.getAttribute("username") as String
    var password : String = request.getAttribute("password") as String

//
//    //Use the below if the params are passes as queryParameters (appended in the URL)
//    var userName = request.getParameter( "username" )
//    var password = request.getParameter( "password" )
//

    switch(true){
      case request.RequestURI.contains("portal"):
        return new PortalSource(userName, password)
      case request.RequestURI.contains("native"):
        return new NativeSource(userName, password)
      default:
        throw new LoginException("Invalid Source")
    }
  }

}
