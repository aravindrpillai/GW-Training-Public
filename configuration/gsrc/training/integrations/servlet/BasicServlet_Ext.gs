package training.integrations.servlet
uses gw.servlet.Servlet
uses javax.servlet.http.HttpServletRequest
uses javax.servlet.http.HttpServletResponse
uses javax.servlet.http.HttpServlet


//URL : http://localhost:8080/cc/service/BasicServlet
@Servlet(\path : String -> path.matches("/BasicServlet(/.*)?"))
class BasicServlet_Ext extends HttpServlet {

  override function service(req: HttpServletRequest, response: HttpServletResponse) {
    print("Beginning call to service()...")

    // SESSION AUTH : Get user from session if the client is already signed in.
    var user = gw.servlet.ServletUtils.getAuthenticatedUser(req, true)
    print("Session user result = " + user?.DisplayName)

    // HTTP BASIC AUTH : If the session user cannot be authenticated, try HTTP Basic
    if (user == null) {
      try {
        user = gw.servlet.ServletUtils.getBasicAuthenticatedUser(req)
        print("HTTP Basic user result = " + user?.DisplayName)
        if (user == null) {
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized. No valid user.")
          return
        }
      } catch (e) {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Unauthorized. HTTP Basic authentication error.")
        return
      }
    }

    doMain(req, response, user )
  }


  private function doMain(req: HttpServletRequest, response: HttpServletResponse, user : User) {
    assert(user != null)

    var responseText = "REQUEST SUCCEEDED\n" +
        "req.RequestURI: '${req.RequestURI}'\n" +
        "req.PathInfo: '${req.PathInfo}'\n" +
        "req.RequestURL: '${req.RequestURL}'\n" +
        "authenticated user name: '${user.DisplayName}'\n"

    print(responseText)
    response.ContentType = "text/plain"
    response.setStatus(HttpServletResponse.SC_OK)
    response.Writer.append(responseText)
  }
}