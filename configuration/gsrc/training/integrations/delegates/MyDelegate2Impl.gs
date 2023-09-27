package training.integrations.delegates

class MyDelegate2Impl implements training.integrations.delegates.MyDelegate2 {

  construct(entity : MyEntityToTestDelegate){
    print("Inside constructor of MyDeligate2Impl..")
    print("Type of this entity is : "+typeof(entity))
  }

  override function functionOnMyDelegate2() {
    print("Function on Delegate 2 Impl")
  }
}