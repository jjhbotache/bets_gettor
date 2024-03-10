from flet import *
from components.bet_card import Bet_card
from random import randint


class Bets_lister(UserControl):
    def __init__(self, page, on_set_sb_in_bet_viewer, surebets=[]):
        super().__init__()
        self.page = page

        self.surebets = sorted(surebets, key=lambda x: x["info"]["profit"], reverse=True)
        self.surebets_controls = []


        for sb in self.surebets:
            self.surebets_controls.append(
                Bet_card(
                    page=self.page,
                    surebet=sb,
                    on_open_surebet=lambda sb: on_set_sb_in_bet_viewer(sb),
                )
            )

    def build(self):
        return Container(Column([
            Row([
              Text("Bets Amount"),
              TextField("0.00"),
            ]),
            Text("Bets Gettor",size=40),
            Text("By: Juan Jose Huertas Botache",size=8),
            Column(
                controls=self.surebets_controls,
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
    