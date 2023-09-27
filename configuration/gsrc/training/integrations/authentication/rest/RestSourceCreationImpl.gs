package training.integrations.authentication.rest

uses gw.plugin.security.AuthenticationSource

/**
 * configure this class in Plugin : RestAuthenticationSourceCreatorPlugin.gwp
 */
class RestSourceCreationImpl implements AuthenticationSource {

  public var _username : String as Username
  public var _password : String as Password

  construct(username : String, password : String) {
    _username = username
    _password = password

  }

  override property get Hash() : char[] {
    return new char[0]
  }

  override function determineSourceComplete() : boolean {
    return false
  }
}