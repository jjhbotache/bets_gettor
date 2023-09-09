from classes import *
import time
import pyautogui as pya
import pyperclip as pypc
from plyer import notification



def open_google():
  bot1 = BotBettor()
  bot1.use(id="APjFqb",input="hi")
  time.sleep(10000)
  
def login_bookmaker(id_bookmaker=0):
  print("login_bookmaker: ",id_bookmaker)
  bots = []
  
  if id_bookmaker==0:
    pass
  elif id_bookmaker==1:
    bots.append(BotBettor())
    bots[-1].login(id_bookmaker=1,username="camitoschamosos@gmail.com",password="Chaminosos1234")
    time.sleep(10000)
  elif id_bookmaker==2:
    pya.PAUSE = 0.5
    pya.FAILSAFE = True
    
    
    pya.hotkey('win', 'r')
    pya.write('msedge')
    
    pya.press('enter')
    time.sleep(2.5)

    pya.hotkey('alt', 'space')
    for i in range(5):  pya.press('down')
    pya.press('enter')
    # time.sleep(1)
     
    pya.hotkey('ctrl', 'l')
    # promt = pya.prompt("a buscar que?")
    promt = "arsenal"
    # pya.write(f"https://apuestas.wplay.co/es/search?s={promt}")
    pypc.copy(f"https://apuestas.wplay.co/es/search?s={promt}")
    pya.hotkey('ctrl', 'v')
    pya.press('enter')
    time.sleep(3)
    
    pya.press('f12')
    time.sleep(8)
    pya.press('esc')
    time.sleep(2)
    
    # pya.write(f"const results = document.querySelectorAll('.results > .date-group');const bestMatch = results[0];const link = bestMatch.querySelector('a');window.location.assign(link.href);")
    pypc.copy("const results = document.querySelectorAll('.results > .date-group');const bestMatch = results[0];const link = bestMatch.querySelector('a');window.location.assign(link.href);")
    pya.hotkey('ctrl', 'v')
    time.sleep(2)
    pya.press('enter')
    
    time.sleep(4)
    pya.confirm("ya?")
      
  elif id_bookmaker==3:
    # bot = Bot_playwright()
    # bot.open_google()
    # bot.input("input[name='q']", "Playwright tutorial")
    # bot.click("input[type='submit']")
    # bot.close()
    
    bot = Bot_playwright2()
    bot.input('input[name="q"]', 'Selenium tutorial')
    bot.click('input[name="btnK"]')
  else:
    raise Exception("id_bookmaker not found")
    
  bot1 = BotBettor()
  bot1.use(id="APjFqb",input="hi")
  time.sleep(10000)
  
def say_hi(name):
  string = "Hi!"+name
  print(string)
  return string

def create_notification(titulo,mensaje,duracion=10):
  notification.notify(
    title=titulo,
    message=mensaje,
    timeout=duracion
  )
  
def copy_to_clipboard(text):
  create_notification("Copied to clipboard",text,2)
  pypc.copy(text)
