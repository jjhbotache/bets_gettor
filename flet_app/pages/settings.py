from flet import *
import json
from os import path
from components.bookmaker_data_manager import Bookmaker_data_manager

class Settings(UserControl):
  config_file_path = path.join(   path.dirname(__file__),   "..",   "settings",   "bookmakers_credentials.json" )
  
  def __init__(self,page):
    super().__init__()
    self.page = page
    self.inputs_ref = Ref[Column]()
    self.config = []
    
  def did_mount(self):
    # check if the bookmakers_credentials.json file exists
    try:
      with open(Settings.config_file_path) as f:
        self.config = json.load(f)
    except:
      with open(Settings.config_file_path,"w") as f:
        bookmakers = ["wplay","betplay","codere"]
        data = [
          [
            {
            "name":b,
            "type":"primary",
            "username":"",
            "password":""
          },
            {
            "name":b,
            "type":"secondary",
            "username":"",
            "password":""
          }
          ]
          for b in bookmakers
          ]

        self.config = data
        json.dump(data,f,indent=2)
    
    print(self.config)
    self.render_bookmakers_inputs()
      
  def on_bookmaker_data_change(self,data):
    
    # from the data received, find the bookmaker and update the config
    for i,bookmaker_groups in enumerate(self.config):
      for j,bm in enumerate(bookmaker_groups):
        if bm["name"] == data["name"] and bm["type"] == data["type"]:
          self.config[i][j] = data
          break
        
    # and save the new config
    
    with open(Settings.config_file_path,"w") as f:
      json.dump(self.config,f,indent=2)
      
      
      
  def render_bookmakers_inputs(self):
    for bookmaker_groups in self.config:
      for bm in bookmaker_groups:
        self.inputs_ref.current.controls.append(
          Bookmaker_data_manager(
            name=bm["name"],
            given_type=bm["type"],
            username=bm["username"],
            password=bm["password"],
            on_data_change=self.on_bookmaker_data_change
          )
        )
    self.update()
    
      
  def build(self):
    return Container(
      content=Column(
      controls=[
        Container(
          content=Row([
          IconButton(icon=icons.ARROW_BACK,tooltip="Back",on_click=lambda e: self.page.go("/") ),
          Text("Settings",size=40),
        ],height=100),
          bgcolor=colors.BLUE_GREY_500
        ),
        Container(
          content=Row([
            Column([
              
            ],ref=self.inputs_ref,scroll=ScrollMode.AUTO,height=self.page.height-100),
          ]),
          bgcolor=colors.BLUE_GREY_700
        )
      ],
      height=self.page.height,
    ),
    bgcolor=colors.BLUE_GREY_800
    )