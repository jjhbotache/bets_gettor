from selenium_class import Bot
from time import sleep
from os import system

def login_bookmaker(bot:Bot,bookmaker:str,credentials:dict):
  """this functions logs in to a bookmaker

  Args:
      bookmaker (Bot): The bot to use
      bookmaker (str): The bookmaker to login to
      credentials (dict): The credentials to use
  """
  
  if bookmaker == "betplay":
    bot.new_tab(url=' https://betplay.com.co/',tab_name='betplay')
    bot.write_on( css_selector='#userName', text=credentials['username'] )
    bot.write_on( css_selector='#password', text=credentials['password'] )
    bot.click_on( css_selector='#btnLoginPrimary')
    # wait to be on the https://betplay.com.co/apuestas#home ulr
    while bot.get_url() != 'https://betplay.com.co/apuestas#home':
      sleep(0.5)
      bot.go('https://betplay.com.co/apuestas#home')
    
  else:
    raise Exception('Bookmaker not found')

def bet_in_betplay(bot:Bot,option:dict):
  """this function makes a bet in betplay

  Args:
      bot (Bot): The bot to use
      option (dict): The option to bet
        {
          'amount': '1000'
          'option_name': 'tolima'
          'bet_link': 'https://betplay.com.co/apuestas#filter/football/all/all/tigres_uanl'
        }
  """
  bot.go(option['bet_link'])
  container = bot.get_element( css_selector='.KambiBC-collapsible-container')
  bot.click_on( css_selector='.KambiBC-event-item__event-wrapper',from_element=container) ## this is the first event
  outcomes_container = bot.get_element( css_selector='.KambiBC-outcomes-list KambiBC-outcomes-list--layout-grid KambiBC-outcomes-list--columns-3')
  outcomes_btns = bot.get_elements( css_selector='div', element=outcomes_container)
  print(*[btn.__dict__ for btn in outcomes_btns],sep='\n')
  print(outcomes_btns)
  input("ended bet_in_betplay")
  

if __name__ == '__main__':
  print('This is a module, and cannot be executed as a standalone script.')
  main_bot = Bot(incognito=True)
  login_bookmaker(
    bot=main_bot,
    bookmaker='betplay',
    credentials={
      'username': '1106226953',
      'password': 'J1234567890j'
    }
  )
  
  try:
    bet_in_betplay(
      bot=main_bot,
      option={
        'amount': '1000',
        'option_name': 'Tigres UANL',
        'bet_link': 'https://betplay.com.co/apuestas#filter/football/all/all/tigres_uanl'
      } 
    )
  except Exception as e: 
    print(e)
    
  input('\nPress enter to exit.')
  # system("cls")