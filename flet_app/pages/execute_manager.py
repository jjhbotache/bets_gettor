from flet import *
import json
from os import path

class Execute_manager(UserControl):
  config_file_path = path.join(   path.dirname(__file__),   "..",   "settings",   "bookmakers_credentials.json" )
  
  def __init__(self, page):
    super().__init__()
    self.page = page
    self.data_table_ref = Ref[DataTable]()
    
  def did_mount(self):
    # read the json file
    
    with open(Execute_manager.config_file_path, "r") as f:
      data = json.load(f)
    
    for bm_credentials_group in data:
      for bm in bm_credentials_group:
        self.data_table_ref.current.rows.append(
          DataRow(
            cells=[
              DataCell(Text(bm["name"])),
              DataCell(Text(bm["type"])),
              DataCell(
                Icon(name=icons.CHECK_CIRCLE_OUTLINE)
                # Icon(name=icons.DONE)
                ),
              DataCell(FilledButton("login",data=bm))
            ],
          ),
        )
      
    self.update()

  def build(self):
    return Column(
      controls=[
        DataTable(
          columns=[
            DataColumn(Text("Bookmaker")),
            DataColumn(Text("Type")),
            DataColumn(Text("Status")),
            DataColumn(Text("Action")),
          ],
          width=float("inf")
          ,
          ref=self.data_table_ref,
        )
      ],
      expand=True,
      expand_loose=True,
      height="100%",
    )
  