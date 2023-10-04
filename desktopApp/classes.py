from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class Bot_selenium():
    def __init__(self):

        # edge_options = webdriver.EdgeOptions()
        # edge_options.use_chromium = True
        # # edge_options.add_argument("user-data-dir=C:/Users/jjhue/AppData/Local/Microsoft/Edge/User Data")
        # # edge_options.add_argument("profile-directory=Personal")

        # self.driver = webdriver.Edge(options=edge_options)
        self.driver = webdriver.Edge()

    
    def use(self,timeout=10,xpath="",name="",id="",class_name="",css_selector="",input="",just_wait=False):
        if xpath!="":
            try:
                enter = WebDriverWait(self.driver,timeout).until(
                    EC.presence_of_element_located((By.XPATH,xpath))
                )
            except:
                print(f"cant find in the time to {xpath}")
                return
        elif name!='':
            try:
                enter = WebDriverWait(self.driver,timeout).until(
                    EC.presence_of_element_located((By.NAME,name))
                )
            except:
                print(f"cant find in the time to {name}")
                return
        elif id!='':
            try:
                enter = WebDriverWait(self.driver,timeout).until(
                    EC.presence_of_element_located((By.ID,id))
                )
            except:
                print(f"cant find in the time to {id}")
                return
        elif css_selector!='':
            try:
                enter = WebDriverWait(self.driver,timeout).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR,css_selector))
                )
            except:
                print(f"cant find in the time to {css_selector}")   
                return
        elif class_name!='':
            try:
                enter = WebDriverWait(self.driver,timeout).until(
                    EC.presence_of_element_located((By.CLASS_NAME,class_name.replace(" ",".")))
                )
            except:
                print(f"cant find in the time to {class_name}")   
                return
        else:
            print("can't use or find")
            return
        if just_wait:
            return
        elif input=="":
            for zxc in range(5):
                try:
                    enter.click()
                except:
                    time.sleep(2)
        else:
            enter.send_keys(input) 
            
    def use2(self,nameOfElement:str,by,value:str,press=True,input=None,many=False,timeBetween=2,timeout=20):
        
        # time.sleeps and gets the element
        try:
            element = WebDriverWait(self.driver,timeout).until(
                        EC.presence_of_all_elements_located(
                            (
                                by,
                                value.replace(" ",".") if by == By.CLASS_NAME else value
                            )
                        )
                    )
            element = element[0] if not many else element
            
            if input:
                element.send_keys(input) 
            elif press:
                element.click()
            else:
                return element
        except:
            print(f"couldn't press the {nameOfElement} in {timeout} secs")
        
    def hide(self):
      self.driver.execute_script("""
                                 // Ocultar la propiedad navigator.webdriver
                                  Object.defineProperty(navigator, 'webdriver', {
                                    get: () => false,
                                  });

                                  // Eliminar las variables $cdc_ y $wdc_ del objeto window
                                  if (window.$cdc_) {
                                    delete window.$cdc_;
                                  }
                                  if (window.$wdc_) {
                                    delete window.$wdc_;
                                  }

                                  // Crear un nuevo objeto con un nombre diferente para webdriver (opcional)
                                  window.navigator2 = window.navigator;

                                 """)

class BotBettor(Bot_selenium):
  def __init__(self):
      super().__init__()
  
  def login(self,id_bookmaker,username,password):
        if id_bookmaker == 1:
          self.driver.get("https://apuestas.wplay.co/es")
          self.hide()
          self.use(name="username",input=username,css_selector="input[name='username']")
          self.use(name="password",input=password,css_selector="input[name='password']")
          self.use2("login button",By.CLASS_NAME,"log-in")
        elif id_bookmaker == 2:
          self.driver.get("https://betplay.com.co/")
          self.hide()
          time.sleep(5*1000)
          # Encuentra el elemento input por su atributo 'formcontrolname'
          input_element = self.driver.find_element(By.ID, "userName")
          input_element.send_keys('MiNombreDeUsuario')
          return
          self.use(name="username of betplay",input=username,id="userName")
          self.use(name="password",input=password,id="password")
          self.use(name="login button",id="btnLoginPrimary")
        elif id_bookmaker == 3:
          pass
        else:
          raise Exception("id_bookmaker not found")
  
from playwright.sync_api import sync_playwright

class Bot_playwright:
    def __init__(self):
        # Inicializa el contexto de Playwright
        with sync_playwright() as p:
            self.browser = p.chromium.launch()
            self.page = self.browser.new_page()

    def click(self, selector):
        # Realiza clic en el elemento seleccionado por el selector CSS
        self.page.click(selector)

    def input(self, selector, text):
        # Ingresa texto en el elemento seleccionado por el selector CSS
        self.page.fill(selector, text)

    def open_google(self):
        # Abre el sitio web de Google
        self.page.goto("https://www.google.com")

    def close(self):
        # Cierra el navegador y finaliza la instancia del bot
        self.browser.close()

class Bot_playwright2:
    def __init__(self):
        with sync_playwright() as p:
            self.browser = p.chromium.launch(headless=False)
            self.page = self.browser.new_page()
            self.page.goto("https://www.google.com/")
            # time.sleep(5*1000)

    def click(self, selector):
        self.page.click(selector)

    def input(self, selector, text):
        self.page.fill(selector, text)