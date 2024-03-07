from flet import *
from components.bet_card import Bet_card
from random import randint
from bets_gettor_logic.app import get_sure_bets
import threading
import time

class Bets_lister(UserControl):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.bets_column_ref = Ref[Column]()

        threading.Thread(target=self.get_sure_bets_thread).start()


    def get_sure_bets_thread(self):
        while True:
            surebets = get_sure_bets()
            surebets = sorted(surebets, key=lambda x: x["info"]["profit"], reverse=True)

            self.bets_column_ref.current.controls = []

            for sb in surebets:
                sb_title = sb["options"][0]["name"] + " vs " + sb["options"][2]["name"]
                sb_profit = sb["info"]["profit"]
                
                self.bets_column_ref.current.controls.append(
                    Bet_card(
                        page=self.page,
                        title=sb_title,
                        profit=sb_profit,
                    )
                )

            self.update()
            print("updating surebets: ",len(surebets))
            


    def build(self):
        return Container(Column([
            Row([
              Text("Bets Amount"),
              TextField("0.00"),
            ]),
            Text("Bets Gettor",size=40),
            Text("By: Juan Jose Huertas Botache",size=8),
            Column(
                ref=self.bets_column_ref,
                expand=1,
                scroll=ScrollMode.ADAPTIVE,
                width=float("inf")
            ),
        ],
        expand=1,
        alignment=alignment.center,
        ),
        bgcolor=colors.GREEN_900,
        padding=padding.all(10),
        height=self.page.height,
        )    
    