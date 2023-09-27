package training.integrations.authentication.native.source

class NativeSource implements gw.plugin.security.AuthenticationSource {

  private var _username : String as Username
  private var _password : String as Password

  construct(username:String, password:String){
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