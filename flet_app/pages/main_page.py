from flet import *
from components.bets_lister import Bets_lister
from components.bet_viewer import Bet_viewer

class Main_page(UserControl):
    def __init__(self, page):
        super().__init__()
        self.page = page

    def build(self):
        return(
          Row([
            Column([Bets_lister(self.page),],expand=1),
            Column([Bet_viewer(self.page),],expand=1),
          ])
        )