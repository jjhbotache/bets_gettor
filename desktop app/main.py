import webview
from main_functions import * 


def loop(window):
  window.expose(
    say_hi,
    open_google,
    login_bookmaker,
    create_notification,
    copy_to_clipboard,
    write_duration,
    get_durations,
  )

window = webview.create_window('Hello world', 'webFront/index.html',maximized=True)
webview.start(func=loop,args=window,
              debug=True,
              ) 