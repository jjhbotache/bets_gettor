import webview
from main_functions import * 
from python.app import *
from python.bot.bot import bet


def loop(window):
  window.expose(
    create_notification,
    copy_to_clipboard,
    send_mail,
    # api functions
    sure_bets,
    manage_surebet,
    get_js_code,
    bet,
  )

window = webview.create_window('Apibettor', 'reactUI/dist/index.html',maximized=True)
webview.start(func=loop,args=window,
              debug=True,
              ) 