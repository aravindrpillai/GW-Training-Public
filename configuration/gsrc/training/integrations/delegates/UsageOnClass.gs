package training.integrations.delegates

class UsageOnClass implements training.integrations.delegates.MyDelegate {

  delegate _clipboardPart represents training.integrations.delegates.MyDelegate

  construct() {
    _clipboardPart = new MyDelegateImpl(null)
    this.functionOnMyDelegate()
  }

}