from .selenium_module.main_selenium_functions import login_bookmaker
from .selenium_module.selenium_class import Bot as SeleniumBot
from .manual_bot_module.manual_bot_class import Bot as ManualBot
from time import sleep
def login_bm(bm_name:str,credentials:dict):
  """Login in a bookmaker using the corresponding bot.

  Args:
      bm_name (str): _description_
      credentials (dict): 
        {
          'username': '1106226953',
          'password' : 'password123s'
        }
  """
  if bm_name == "betplay" or bm_name == "codere":
    login_bookmaker(
      bot=SeleniumBot(),
      bookmaker=bm_name,
      credentials=credentials
    )
    
  elif bm_name == "wplay":
    manual_bot=ManualBot()
    manual_bot.go_to_url("https://www.wplay.co/")
    sleep(3)
    manual_bot.login_in_bookmaker("wplay",{
      "username":"camitoschamosos@gmail.com",
      "password":"Chaminosos1234"
    })
    
  else:
    print("Bookmaker not found or implemented yet.")