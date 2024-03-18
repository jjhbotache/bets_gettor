from flet import *

class Bookmaker_data_manager(UserControl):
  def __init__(self,name,given_type,username,password, on_data_change):
    super().__init__()
    
    self.name = name#"wplay"
    self.given_type = given_type#"primary" # "secondary"
    self.username = username
    self.password = password
    
    self.on_data_change = on_data_change
    
  def reset_data(self):
    self.on_data_change(
      {
        "name":self.name,
        "type":self.given_type,
        "username":self.username,
        "password":self.password
      }
    )
    
  def on_username_change(self,e):
    self.username = e.control.value
    self.reset_data()
    
  def on_password_change(self,e):
    self.password = e.control.value
    self.reset_data()
      
  def build(self):
    return Card(
      content=Container(
        Row([Column(
      controls=[
        Text(self.name,size=20),
        Divider(color=colors.BLUE_GREY_800),
        Text(self.given_type,size=15),
        TextField(value=self.username,label="Username", on_change=self.on_username_change),
        TextField(value=self.password,label="Password", on_change=self.on_password_change,password=True,can_reveal_password=True),        
      ],
      
    )],
    ),
      padding=padding.symmetric(horizontal=20,vertical=10),
      margin=margin.symmetric(horizontal=10),
    ) 
    )