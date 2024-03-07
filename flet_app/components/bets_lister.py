from flet import *
from components.bet_card import Bet_card
from random import randint

class Bets_lister(UserControl):
    def __init__(self, page):
        super().__init__()
        self.page = page

    def build(self):
        return Container(Column([
            Row([
              Text("Bets Amount"),
              TextField("0.00"),
            ]),
            Text("Bets Gettor",size=40),
            Text("By: Juan Jose Huertas Botache",size=8),
            Column([
                Bet_card(self.page,f"bet {i}", randint(0,200) ) for i in range(0,100)
            ],expand=1,scroll=ScrollMode.ADAPTIVE,width=float("inf")),
        ],
        expand=1,
        alignment=alignment.center,
        ),
        bgcolor=colors.GREEN_900,
        padding=padding.all(10),
        height=self.page.height,
        )    
    