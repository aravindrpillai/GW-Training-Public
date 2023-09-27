package training.util.codeinspect.util

/**
 * author : Aravind R Pillai
 * date : 04 Oct 2022
 * desc : Class to handle range
 */
class Range {

  private var low : int
  private var high : int

  public construct(low_0 : int, high_0 : int) {
    this.low = low_0
    this.high = high_0
  }

  /**
   * Function to check if a number is within the range
   * @param number
   * @return
   */
  public function contains(number : int) : boolean {
    return (number >= low and number <= high)
  }
}