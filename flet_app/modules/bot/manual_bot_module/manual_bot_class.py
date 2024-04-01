import pywinauto
import pyautogui
import pyperclip
from time import sleep
from os import system,path

class Bot():
  bookmakers = ["wplay","betplay","codere"]
  
  def __init__(self, start_edge:bool=False):
    
    if start_edge:
      self.windows = self.get_edge_windows(filtered_by_new_window=True)
      for attempt in range(3):
        try:
          if len(self.windows) == 0:
            # create a new msedge window
            system("start msedge")
            sleep((attempt+1)*2)
          self.select_window()
          break
        except Exception as e:
          print("No edge windows found.:",e)
    else:
      self.windows = self.get_edge_windows()

  def select_window(self, get_window_index:callable=None):    
    """select a window from the list of windows

    Args:
        get_window_index (callable): a function that returns the index of the window to select according to the list of windows given
    """
    
    if get_window_index is None:
      self.windows = self.get_edge_windows(filtered_by_new_window=True)
      def get_window_index(windows):
        # choose the window with the text "New tab"
        return [i for i,window in enumerate(windows) if "new tab" in window.window_text().lower()][0]
    
    self.window = self.windows[get_window_index(
      self.windows
    )]
    
  def execute_js(self, js_script:str):
    # focus the window
    self.focus_window()
    
    pyautogui.press("f12") # open dev tools
    sleep(1)
    pyautogui.hotkey('ctrl', 'shift','p') # open command palette
    pyperclip.copy("Show console")
    sleep(.4)
    pyautogui.hotkey('ctrl', 'v')
    sleep(.6)
    pyautogui.press("enter") # get console
    pyperclip.copy(js_script)
    sleep(.4)
    pyautogui.hotkey('ctrl', 'l')
    pyautogui.click(
      x=1600,
      y=510
    )
    sleep(.4)
    pyautogui.hotkey('ctrl', 'v')
    sleep(.6)
    pyautogui.press('enter')
    pyautogui.press("f12")
    
  def get_edge_windows(self,filtered_by_new_window:bool=False):
    #gets a list of all the windows filtered by visible and enabled
    windows = pywinauto.Desktop().windows(visible_only=True,enabled_only=True)
    # filter out the windows without titles and those which haven't the word "edge" in their title
    windows = [window for window in windows if window.window_text() and "edge" in window.window_text().lower()]
    
    if filtered_by_new_window:
      # filter out the windows without the word "new tab" in their title
      windows = [window for window in windows if "new tab" in window.window_text().lower()]
    
    return windows
  
  def focus_window(self, window=None):
    if window is None: window = self.window
    #activates the window
    # window.SetFocus()
    window.set_focus()  
    window.maximize()
    # print(f"Changed to the window '{window.window_text()}'.")


  def go_to_url(self, url:str):
    self.focus_window()
    pyperclip.copy(url)
    pyautogui.hotkey('ctrl', 'l')
    pyautogui.hotkey('ctrl', 'v')
    pyautogui.press('enter')
    sleep(4)
    
      
  def login_in_bookmaker(self, bookmaker:str, credentials:dict):
    self.focus_window()
    if bookmaker == "wplay":
      login_script_path = path.join( path.dirname(__file__), "login_wplay_js_script.js")
      
      with open(login_script_path, "r") as f:
        login_script = f.read()
        
      self.execute_js(login_script.replace(
        "USERNAME", credentials["username"] )
        .replace(
        "PASSWORD", credentials["password"] )
      )
    else:
      print("Bookmaker not found or implemented yet.")
      
  def get_bm_window(self, bookmaker:str, primary = True):
    # print(*[ms_w.window_text() for ms_w in self.get_edge_windows()],sep="\n"*2);return
    type_str = "inprivate" if not primary else "personal"
    
    
    edge_windows = self.get_edge_windows()
    try:
      if bookmaker == "betplay":
        bookmaker_window = [window for window in edge_windows if ("betplay" in window.window_text().lower() or "Apuestas deportivas de futbol - Gana gracias a tu pasión" in window.window_text()) and type_str in window.window_text().lower() ][0]
        
      elif bookmaker == "wplay":
        bookmaker_window = [window for window in edge_windows if "wplay" in window.window_text().lower() and type_str in window.window_text().lower() ][0]
        
      elif bookmaker == "codere":
        bookmaker_window = [window for window in edge_windows if "codere" in window.window_text().lower() and type_str in window.window_text().lower() ][0]
    except IndexError:
      
      print(f"Window for {bookmaker} in private:{not primary} not found.")
      return
        
    return {
      "bookmaker": bookmaker,
      "type": "primary" if primary else "secondary",
      "window": bookmaker_window,
    }
      
  def get_all_bm_windows(self):
    bookmakers_dicts = []
    for bm_name in Bot.bookmakers:
      bookmakers_dicts.append( self.get_bm_window(bm_name) )
      
      if bm_name != "codere":
        bookmakers_dicts.append( self.get_bm_window(bm_name, False)  )
        
    return bookmakers_dicts

  def bet_in_bookmaker(self, bookmaker_window:dict, amount:int,option:str):
    """ bets in the bookmaker (wplay, betplay)

    Args:
        bookmaker_window (dict): the bookmaker window
          {
            "bookmaker": str,
            "type": str,
            "window": pywinauto.window.WindowSpecification
          }
        amount (int): the amount to bet
        option (str): the option to bet on
    """
    
    
    window,bookmaker = bookmaker_window["window"],bookmaker_window["bookmaker"]
    
    if bookmaker == "codere":raise Exception("Can't bet on codere yet")
    
    self.window = window
    self.focus_window()
    
    bet_script_path = path.join(
      path.dirname(__file__),
      f"bet_script_for_{bookmaker}.js")
    with open(bet_script_path, "r") as f:
      bet_script = f.read()
        
    self.execute_js(
      bet_script.replace(
      "AMOUNT", str(amount) )
      .replace(
      "OPTION", str(option) )
    )
    
    if bookmaker == "betplay":
      sleep(2)
      pyautogui.write(str(amount))
      aux_script_path = path.join(
        path.dirname(__file__),
        "aux_scripts",
        "betplay_aux_script_1.js"
      )
      with open(aux_script_path, "r") as f:
        aux_script = f.read()
      self.execute_js(aux_script)


if __name__ == "__main__":
  bot = Bot()
  bot.bet_in_bookmaker(
    bookmaker_window=bot.get_bm_window("codere"),
    amount=1,
    option="jaguares cordoba"
  )
    