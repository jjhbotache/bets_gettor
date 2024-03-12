from flet import *
import time
from constants import DEBUG
from helpers.str_functions import add_dots


class Bet_viewer(UserControl):
    def __init__(self, page,bet,amount_to_bet):
        """
        get_sb: function to get the surebet that is being shown in the bet viewer
        bet_id: the id of the bet that is being shown in the bet viewer
        """
        super().__init__()
        self.page = page
        self.bet = bet
        self.amount_to_bet = amount_to_bet

        bet_start_time = self.bet["info"]["start_time"] #aux var  
        bet_end_time = self.bet["info"]["end_time"] #aux var      
        self.existence_time = round(
            bet_end_time - bet_start_time 
                if bet_end_time else 
            time.time() - bet_start_time
        )
        
        self.bet_title = self.bet["options"][0]["name"] + " vs " + self.bet["options"][2]["name"] 
        
        self.profit_color = "white" if self.bet["info"]["profit_amount"]>0 else "red"


        # refs
        self.bet_title_ref = Ref[Text]()
        self.bet_time_ref = Ref[Text]()
        self.bet_match_time_ref = Ref[Text]()
        self.bet_profit_ref = Ref[Text]()
        self.table_info_ref = Ref[Column]()
        self.table_amounts_ref = Ref[Column]()
        self.total_bet_ref = Ref[Text]()
        self.total_profit_ref = Ref[Text]()


    def build(self):
        return Container(Column([
            Text(self.bet_title,size=25,ref=self.bet_title_ref),
            Text(self.existence_time,ref=self.bet_time_ref),

            Divider(color=colors.BLUE_ACCENT),

            ResponsiveRow([
                Text(self.bet["info"]["time"],col=4,ref=self.bet_match_time_ref),
                ElevatedButton(f"profit %{round(self.bet['info']['profit'],2)}",col=4,ref=self.bet_profit_ref),
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
            Column([ 
                ResponsiveRow([
                    Text("Bet",col=4,size=30),
                    Text("---",col=4,size=30),
                    Text("Profit",col=4,size=30),
                ]),
                *[ResponsiveRow([
                    Text(add_dots(o["amount_to_bet"]),col=4,size=20),
                    Text("→",col=4,size=25),
                    Text(add_dots(o["profit_amount"]),col=4,size=20),
                ])
                for o in self.bet["options"]]
             ],spacing=1,ref=self.table_amounts_ref),
            
            Divider(color=colors.BLUE_ACCENT),

            Text(f'Total Profit: {add_dots(self.bet["info"]["profit_amount"])}',
                 size=20,ref=self.total_profit_ref,weight=FontWeight.BOLD,color=self.profit_color), 
            ],
            expand=1,
            horizontal_alignment=CrossAxisAlignment.CENTER,
            width=float("inf"),
            spacing=1,
            ),
            height=self.page.height,
            bgcolor=colors.GREEN_900 if not self.bet["info"]["end_time"] else colors.BLUE_GREY_900,
            padding=padding.all(10),
            )
            