from .selenium_module.selenium_class import Bot as SeleniumBot
from .manual_bot_module.manual_bot_class import Bot as ManualBot

class Bot():
  """This class is a centralizer for the bots that will contain the info of the automatizations
  """
  def __init__(self,selenium,incognito):
    if selenium:
      if incognito:
        self.selenium_bot = SeleniumBot(incognito=True)
      else:
        self.selenium_bot = SeleniumBot()
    else:
      self.manual_bot = ManualBot()