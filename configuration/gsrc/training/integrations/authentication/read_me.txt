
For Soap WS:
    WebservicesAuthenticationPlugin.gwp --------> Implements WebservicesAuthenticationPlugin
    Here we dont need to authenticate source.
    Directly authenticate from the class as the source is known
For Rest WS:
    RestAuthenticationSourceCreatorPlugin.gwp --> Implements AuthenticationSourceCreatorPlugin
    Here We need to specify the source using the above plugin.
    Later the control goes through the normal AuthenticationServicePlugin Impl