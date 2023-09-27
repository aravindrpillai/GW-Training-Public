package training.util.jwt

uses java.lang.*
uses java.util.Date
uses io.jsonwebtoken.Jwts
uses io.jsonwebtoken.SignatureAlgorithm
uses io.jsonwebtoken.ExpiredJwtException
uses io.jsonwebtoken.MalformedJwtException


/**
 * author : Aravind
 * date : 08/17/2022
 * Class to create JWT token and validate it
 *
 * NOTE :
 *  usage:
 *    to generate token : Authorize.generateToken("aravind.ramachandran.pillai@gmail.com")
 *    to validate token : Authorize.validateToken("pass.token.here")
 */
public class Authorize {

  /**
   * Static class, hence disabling initilization
   */
  private construct(){}

  private static var _expiryInMilliSeconds = 60000
  private static var _secretKey = "My-Secret-Key"

  /**
   * Function to generate the token
   * @param username
   * @return
   */
  static function generateToken(username : String) : String {
    var now_0 = Date.CurrentDate
    var expiryDate = new Date(now_0.getTime() + _expiryInMilliSeconds)
    var jwtBuilder = Jwts.builder()
    var token = jwtBuilder
        .setSubject(username)
        .setIssuedAt(now_0)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS256, _secretKey)
        .compact()
    return token
  }


  /**
   * function to validate the token
   * @param token
   */
  @Throws(Exception, "Authorization Failure Message")
  static function validateToken(token : String) {
    var message : String = null
    try {
      var claim = Jwts.parser().setSigningKey(_secretKey).parseClaimsJws(token)
    }
    catch (exp : ExpiredJwtException) {
      message = "Token Expired"
    }
    catch (mfe : MalformedJwtException) {
      message = "Invalid Token"
    }
    catch (e : Exception) {
      message = e.Message
    }
    if(message != null){
      throw new Exception(message)
    }
  }

}
