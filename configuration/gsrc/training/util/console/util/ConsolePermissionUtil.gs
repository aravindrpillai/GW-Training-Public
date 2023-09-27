package training.util.console.util

uses gw.api.database.Query
uses org.apache.log4j.Logger
uses training.util.console.constants.Constants

/**
 * author : Aravind
 * date : 29 Sept 2022
 * desc : Console UI Helper
 */
class ConsolePermissionUtil {

  private static final var _logger = Logger.getLogger(ConsolePermissionUtil)
  private var _currentUser : User

  construct() {
    _currentUser = User.util.CurrentUser
  }

  /**
   * function to get the instance of this class
   * This function is provided for user convinence as the
   * constructor needs to get the user initiliased all the time
   * @return
   */
  static property get Instance() : ConsolePermissionUtil{
    return new ConsolePermissionUtil()
  }

  /**
   * Function to check if the user can access the page
   *
   * @return
   */
  property get CanVisitPage() : boolean {
    if(not Constants.DEBUG_MODE){
      _logger.info("Guidewire Console Accessed by User : " + _currentUser.Credential.UserName)
      var allowedRoles = {ReadOnnlyRole, ReadAndWriteRole}
      var permitted = _currentUser.Roles?.hasMatch(\role -> allowedRoles.contains(role?.Role))
      _logger.info("Page Access is : " + (permitted ? "Allowed" : "Denied"))
      return permitted
    }
    return true
  }

  /**
   * Function to check if the user can access the page
   *
   * @return
   */
  property get DoesUserHaveFullPermission() : boolean {
    if(not Constants.DEBUG_MODE){
      var allowedRole = ReadAndWriteRole
      var allowed = _currentUser.Roles.hasMatch(\role -> allowedRole == role.Role)
      _logger.info("User with username : " + _currentUser.Credential.UserName + " has " + (allowed ? "Full Permission" : "only Read Permission"))
      return allowed
    }
    return true
  }

  /**
   * function to create or retrieve roles only role to access the console
   *
   * @return
   */
  private static property get ReadOnnlyRole() : Role {
    var readOnlyRole = Query.make(entity.Role)
        .compare(entity.Role#Name, Equals, Constants.ReadOnlyRoleName)
        .select().AtMostOneRow
    if (readOnlyRole == null) {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        _logger.info("Creating role with read only permission | Developer console")
        readOnlyRole = bundle.add(new Role())
        readOnlyRole.PublicID = "Role1:1992"
        readOnlyRole.Name = Constants.ReadOnlyRoleName
        readOnlyRole.RoleType = RoleType.TC_USER
        readOnlyRole.CarrierInternalRole = true
        readOnlyRole.Description = "Developer Console Role With Read Permission Alone"
        readOnlyRole.addToPrivileges(new RolePrivilege() {:Permission = SystemPermissionType.TC_DEVCONSOLEWITHREADPERM})
      }, Constants.DBUser)
    }
    return readOnlyRole
  }

  /**
   * function to create or retrieve read and write roles to access the console
   *
   * @return
   */
  private static property get ReadAndWriteRole() : Role {
    var readAndWriteRole = Query.make(entity.Role)
        .compare(entity.Role#Name, Equals, Constants.ReadAndWriteRoleName)
        .select().AtMostOneRow
    if (readAndWriteRole == null) {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        _logger.info("Creating role with read and write permission | Developer console")
        readAndWriteRole = bundle.add(new Role())
        readAndWriteRole.Name = Constants.ReadAndWriteRoleName
        readAndWriteRole.PublicID = "Role2:1992"
        readAndWriteRole.RoleType = RoleType.TC_USER
        readAndWriteRole.CarrierInternalRole = true
        readAndWriteRole.Description = "Developer Console Role With Read And Write Permission"
        readAndWriteRole.addToPrivileges(new RolePrivilege() {:Permission = SystemPermissionType.TC_DEVCONSOLEWITHREADANDWRITEPERM})
      }, Constants.DBUser)
    }
    return readAndWriteRole
  }
}