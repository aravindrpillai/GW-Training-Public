package training.integrations.delegates

class MyDelegateImpl implements training.integrations.delegates.MyDelegate {

  construct(entity : entity.MyDelegate){
    print("Inside constructor of MyDeligateImpl..")
    print("Type of this entity is : "+typeof(entity))
  }


  override function functionOnMyDelegate() {
    print("Function on Delegate Impl")
  }
}