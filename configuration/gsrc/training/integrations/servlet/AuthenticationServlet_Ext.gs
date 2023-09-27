package training.integrations.servlet

uses gw.servlet.Servlet
uses gw.servlet.ServletUtils
uses javax.servlet.http.HttpServletRequest
uses javax.servlet.http.HttpServletResponse

/**
 * Configuration:
 * In Servley.xml : <servlet class= "training.integrations.servlet.MyServlet_ext" />
 * URL : http://localhost:8080/cc/service/AuthServlet
 */
@Servlet(\path : String -> path.matches("/AuthServlet"))
class AuthenticationServlet_Ext extends gw.servlet.AbstractBasicAuthenticationServlet{


  private function handleLogin(req : HttpServletRequest, resp : HttpServletResponse) : User{
    print("QueryString='" + req.QueryString + "'")

    // SESSION AUTH : Get user from session if the client is already signed in.
    var user = ServletUtils.getAuthenticatedUser(req, true)
    print("Login user=" + user?.DisplayName)

    // HTTP BASIC AUTH : If the session user cannot be authenticated, try HTTP Basic
    if (user == null) {
      try {
        user = gw.servlet.ServletUtils.getBasicAuthenticatedUser(req)
        print("DMSServlet-login getBasicUser=" + user?.DisplayName)
      }
      catch (e : Throwable) {
        resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized. HTTP Basic authentication error.")
        print("DMSServlet-login getBasicUser")
        return null
      }
    }
    if (user == null) {
      var username = req.getParameter("username")
      var password = req.getParameter("password")
      if (username != null && password != null) {
        try {
          user = ServletUtils.login(req, username, password)
        }
        catch (e : Throwable) {
          resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized. username & password.")
          print("DMSServlet-login login")
          return null
        }
      }
    }
    if (user == null) {
      resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized. No valid user info.")
      print("No info in queryString='" + req.QueryString + "'")
    }
    return user
  }


  override function doGet(req: HttpServletRequest, resp : HttpServletResponse) {
    print("servlet test url: " + req.RequestURI)
    print("query string: " + req.QueryString)
    resp.ContentType = "text/plain"
    resp.setStatus(HttpServletResponse.SC_OK)
    resp.Writer.append("I am the page " + req.PathInfo)
  }

  override function isAuthenticationRequired( req: HttpServletRequest ) : boolean {
    return true
  }
}