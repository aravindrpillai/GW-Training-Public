uses gw.api.profiler.Profiler
uses gw.api.profiler.ProfilerTag

/**
 * MyProfilerTags must be common class where all the custom profilers are kept
 */
static class MyProfilerTags {
  public static final var MY_TEST_TAG1 : ProfilerTag = new ProfilerTag("MyTestProfiler1")
  public static final var MY_TEST_TAG2 : ProfilerTag = new ProfilerTag("MyTestProfiler2")
  //Do not initilalise
  private construct() {}
}


//In your code where you need to profile, do the below
var frame = Profiler.push(MyProfilerTags.MY_TEST_TAG1)
try {
  print("Place the code to profile here")
} finally {
  Profiler.pop(frame)
}