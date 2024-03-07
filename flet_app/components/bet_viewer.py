from flet import *

class Bet_viewer(UserControl):
    def __init__(self, page):
        super().__init__()
        self.page = page

    def build(self):
        return Column([
         Text("Bet Viewer")   
        ],
        expand=1,
        alignment=alignment.center
        )