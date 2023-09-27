package training.util.common

/**
 * author : Aravind R Pillai
 * date : 09 May 20202
 * desc : Enhancement for date formating
 */
enhancement DateEnhancement_Ext : Date {

  property get YYYYMMDD() : String {
    if (this != null) {
      var zero = "0"
      var month = this.MonthOfYear < 10 ? (zero.concat(this.MonthOfYear as String)) : this.MonthOfYear
      var day = this.DayOfMonth < 10 ? (zero.concat(this.DayOfMonth as String)) : this.DayOfMonth
      return (this.YearOfDate + "-" + month + "-" + day)
    }
    return null
  }

  property get ServiceCenterDateFormat() : String {
    return this.YearOfDate + "-" + this.MonthOfYear + "-" + this.DayOfMonth
  }


}