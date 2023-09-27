package training.integrations.authentication.native

uses gw.plugin.security.AuthenticationSource
uses gw.plugin.security.AuthenticationServicePlugin
uses gw.plugin.security.UserNamePasswordAuthenticationSource
uses gw.plugin.security.AuthenticationServicePluginCallbackHandler
uses training.integrations.authentication.native.source.NativeSource
uses training.integrations.authentication.native.source.PortalSource

class AuthenticationServicePluginImpl implements AuthenticationServicePlugin {

  var _handler : AuthenticationServicePluginCallbackHandler

  override property set Callback(callbackHandler : AuthenticationServicePluginCallbackHandler) {
    _handler = callbackHandler
  }

  override function authenticate(source : AuthenticationSource) : String {
    switch(true){
      case source typeis NativeSource:
        return handleNativeAuth(source as UserNamePasswordAuthenticationSource)
      case source typeis PortalSource:
        return handlePortalAuth(source as UserNamePasswordAuthenticationSource)
      default:
        throw new Exception("Invalid Source")
    }
  }

  function handleNativeAuth(source : UserNamePasswordAuthenticationSource) : String{
    var username = source.Username
    var userPublicId = _handler.findUser(username)
    return userPublicId
  }

  function handlePortalAuth(source : UserNamePasswordAuthenticationSource) : String{
    var username = source.Username
    var userPublicId = _handler.findUser(username)
    return userPublicId
  }


}
