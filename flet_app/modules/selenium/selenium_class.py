from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options as EdgeOptions
from time import sleep
from helpers.cookies_funtions import get_cookies_from_url
from os import path



class Bot:
    def __init__(self,incognito=False):
      edge_options = EdgeOptions()
      if incognito: edge_options.add_argument("--inprivate")
      edge_options.add_argument("--enable-chrome-browser-cloud-management")
      edge_options.add_argument("--enable-javascript")
      edge_options.add_argument("--enable-cookies")
      # Establecer el User-Agent deseado
      # user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0"
      # edge_options.add_argument(f"user-agent={user_agent}")

      
      
      
      self.driver = webdriver.Edge( options=edge_options )
     
      
      self.driver.maximize_window()
      self.driver.implicitly_wait(20)
      self.driver.get('https://www.google.com')
      
      self.tabs = [
        {
          'name': 'main',
          'tab_id': self.driver.window_handles[0]
        }
      ]
      self.retry_times = 3
      self.retry_delay = 1       
    
    def add_bm_cookies(self,bookmaker:str):
      if bookmaker == 'wplay':
         self.driver.add_cookie(
        get_cookies_from_url([
          path.join(path.dirname(__file__), "cookies", "wplay_cookies.json"),
          path.join(path.dirname(__file__), "cookies", "wplay_cookies.json")
        ])
      )
      else:
        raise Exception('Bookmaker not found')
        
    
    
    def get_url(self):
      """gets the current url

      Returns:
          str: the current url
      """
      return self.driver.current_url   
        
    def go(self, url):
      """goes to a url

      Args:
          url (str): url to go to
      """
      self.driver.get(url)
    
    def new_tab(self, url, tab_name):
      """goes to a url in a new tab

      Args:
          url (str): url to go to
      """
      self.driver.execute_script("window.open('');")
      self.driver.switch_to.window(self.driver.window_handles[-1])
      self.go(url)
      self.tabs.append({
        'name': tab_name,
        'tab_id': self.driver.window_handles[-1]
      })
      
    def switch_tab(self, tab_name):
      """switches to a tab

      Args:
          tab_name (str): name of the tab
      """
      for tab in self.tabs:
        if tab['name'] == tab_name:
          self.driver.switch_to.window(tab['tab_id'])
          break
      else:
        raise Exception('Tab not found')
    
    
    def write_on(self,css_selector,text,from_element=None):
      """writes on a input

      Args:
          css_selector (str): css selector of the input
          text (str): text to write
      """
      tries = 0
      while tries < self.retry_times:
        tries += 1
        try: 
          if from_element: from_element.find_element(By.CSS_SELECTOR,css_selector).send_keys(text)
          else: self.driver.find_element(By.CSS_SELECTOR,css_selector).send_keys(text)
          break
        except:
          if tries >= self.retry_times:
            sleep(self.retry_delay)
          else:
            raise Exception('Could not write on the element: '+css_selector)
      
    def click_on(self,css_selector,from_element=None):
      """clicks on a element

      Args:
          css_selector (str): css selector of the element
      """
      tries = 0
      while tries < self.retry_times:
        tries += 1
        try: 
          if from_element: from_element.find_element(By.CSS_SELECTOR,css_selector).click()
          else: self.driver.find_element(By.CSS_SELECTOR,css_selector).click()
          break
        except:
          if tries >= self.retry_times:
            sleep(self.retry_delay)
          else:
            raise Exception('Could not click on the element: '+css_selector)
    
    def get_element(self,css_selector,element=None):
      """gets a element from the page or element given

      Args:
          css_selector (str): css selector of the element

      Returns:
          the element found
      """
      tries = 0
      while tries < self.retry_times:
        tries += 1
        try: 
          if element: return element.find_element(By.CSS_SELECTOR,css_selector)
          else: return self.driver.find_element(By.CSS_SELECTOR,css_selector)
        except:
          if tries >= self.retry_times:
            sleep(self.retry_delay)
          else:
            raise Exception('Could not find the element: '+css_selector)
      
    def get_elements(self,css_selector,element=None):
      """gets a list of elements from the page or element given

      Args:
          css_selector (str): css selector of the elements

      Returns:
          list of elements found
      """
      tries = 0
      while tries < self.retry_times:
        tries += 1
        try: 
          if element: return element.find_elements(By.CSS_SELECTOR,css_selector)
          else: return self.driver.find_elements(By.CSS_SELECTOR,css_selector)
        except:
          if tries >= self.retry_times:
            sleep(self.retry_delay)
          else:
            raise Exception('Could not find the elements: '+css_selector)