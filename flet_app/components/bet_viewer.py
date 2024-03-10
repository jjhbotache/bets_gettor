from flet import *
import threading
import time
import asyncio
from constants import DEBUG
from helpers.calc_functions import calc_amounts_to_bet

class Bet_viewer(UserControl):
    def __init__(self, page,get_sb):
        """
        get_sb: function to get the surebet that is being shown in the bet viewer
        bet_id: the id of the bet that is being shown in the bet viewer
        """
        super().__init__()
        self.page = page
        self.get_sb = get_sb
        self.bet = self.get_sb()
        if self.bet != None:
            if self.bet["old_surebet"]["end_time"] == None:
                self.existence_time = time.time() - self.bet["old_surebet"]["start_time"]
            else:
                self.existence_time = self.bet["old_surebet"]["end_time"] - self.bet["old_surebet"]["start_time"]
        else:
            self.existence_time = 0

        
        

        # refs
        self.bet_title_ref = Ref[Text]()
        self.bet_time_ref = Ref[Text]()
        self.bet_match_time_ref = Ref[Text]()
        self.bet_profit_ref = Ref[Text]()
        self.table_info_ref = Ref[Column]()
        self.table_amounts_ref = Ref[Column]()
        self.total_bet_ref = Ref[Text]()
        self.total_profit_ref = Ref[Text]()


        # prepare data
        try:
            self.bet_title = self.bet["options"][0]["name"] + " vs " + self.bet["options"][2]["name"] 
        except:
            self.bet_title = "No bet selected"


    def update_time_thread(self):
        if DEBUG: print("starting update time thread!!")
        while True:
            self.bet = self.get_sb()
            if self.bet != None:
                if self.bet["old_surebet"]["end_time"] == None:
                    self.existence_time = time.time() - self.bet["old_surebet"]["start_time"]
                else:
                    self.existence_time = self.bet["old_surebet"]["end_time"] - self.bet["old_surebet"]["start_time"]
            else:
                self.existence_time = 0
            self.existence_time = round(self.existence_time)

            self.bet_time_ref.current.value = f"{self.existence_time} segs"
            self.update()
            time.sleep(1)

    def on_mount_change(self,e):
        print("on mount change")
        if not self.bet or not self.table_amounts_ref.current: return
        self.table_amounts_ref.current.controls = []

        amounts_to_bet = calc_amounts_to_bet(
            total_bet=int(e.control.value),
            bet=self.bet
        )
        for i,option in enumerate(self.bet["options"]):
            amount_to_bet = amounts_to_bet[i]
            profit = amount_to_bet * option["odd"]

            self.table_amounts_ref.current.controls.append(
                ResponsiveRow([
                    Column([
                        IconButton(icons.GAMEPAD),
                        Text(amount_to_bet),    
                    ],col=4,horizontal_alignment=CrossAxisAlignment.CENTER),
                    Text("➡️",col=4),
                    Text(profit,col=4),
                ],vertical_alignment=CrossAxisAlignment.CENTER,alignment=alignment.center),
            )
        self.update()
        
    def did_mount(self):
        if self.bet != None: self.page.run_thread(self.update_time_thread)
        self.update()

    def build(self):
        if self.bet == None or self.bet == {}:
            return Container(Column([
                Text("No bet selected",size=25),
            ]),
            height=self.page.height,
            expand=1,
            )
        else:
            return Container(Column([
            Row([TextField("0",label="Bet amount",input_filter=NumbersOnlyInputFilter(),on_change=self.on_mount_change)]),   
            Text(self.bet_title,size=25,ref=self.bet_title_ref),
            Text(ref=self.bet_time_ref),

            Divider(color=colors.BLUE_ACCENT),

            ResponsiveRow([
                Text(self.bet["info"]["time"],col=4,ref=self.bet_match_time_ref),
                ElevatedButton(f"profit {round(self.bet['info']['profit'],2)}",col=4,ref=self.bet_profit_ref),
                Container(col=4),
            ],width=float("inf")),   

            Divider(color=colors.BLUE_ACCENT),

            # team / odd / bookmaker / code
            Column([
                ResponsiveRow([
                    Text("Team",col=5,size=20),
                    Text("odd",col=3,size=20),
                    Text("BM",col=2,size=20),
                    Text("Code",col=2,size=20),
                ]),
                *[
                    ResponsiveRow([
                        Text(option["name"],col=5),
                        Text(option["odd"],col=3),
                        IconButton(icons.DELETE,col=2),
                        IconButton(icons.CODE,col=2),
                    ],vertical_alignment=CrossAxisAlignment.CENTER)
                    for option in self.bet["options"]
                ]
            ],width=float("inf"),spacing=1,ref=self.table_info_ref),
            
            Divider(color=colors.BLUE_ACCENT),

            # bets amounts
            Text("Bets info",size=20),
            Column([ ],spacing=1,ref=self.table_amounts_ref),
            
            Divider(color=colors.BLUE_ACCENT),

            Text("Total Bet: 0000",size=20,ref=self.total_bet_ref), 
            Text("Total Profit: 0000",size=20,ref=self.total_profit_ref), 
            ],
            expand=1,
            horizontal_alignment=CrossAxisAlignment.CENTER,
            width=float("inf"),
            spacing=1,
            ),
            height=self.page.height,
            bgcolor=colors.GREEN_900,
            padding=padding.all(10),
            )
            