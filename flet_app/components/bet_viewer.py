from flet import *
import time
from constants import DEBUG
from helpers.str_functions import add_dots
import pyperclip
from plyer import notification




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
        
        


        # refs
        self.bet_title_ref = Ref[Text]()
        self.bet_time_ref = Ref[Text]()
        self.bet_match_time_ref = Ref[Text]()
        self.bet_profit_ref = Ref[Text]()
        self.table_info_ref = Ref[Column]()
        self.table_amounts_ref = Ref[Column]()
        self.total_bet_ref = Ref[Text]()
        self.total_profit_ref = Ref[Text]()
        
        
    def copy_to_clipboard(self,data):
        print("copied to clipboard: ",data)
        pyperclip.copy(str(data))
        notification.notify(
            title="Data copied!",
            message=f"{data} copied to clipboard",
            timeout=1
        )
        

    def build(self):
        bg_color = colors.GREEN_900 if not self.bet["info"]["end_time"] else colors.BLUE_GREY_900
        profit_color = "white" if self.bet["info"]["profit_amount"]>0 else "red"
        
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
                    Text("Team",col=5,size=20,text_align=TextAlign.CENTER),
                    Text("odd",col=5,size=20,text_align=TextAlign.CENTER),
                    Text("BM",col=2,size=20,text_align=TextAlign.CENTER),
                ]),
                *list(map(
                    lambda option: ResponsiveRow([
                        Text(option["name"],col=5,text_align=TextAlign.CENTER),
                        Text(option["odd"],col=5,text_align=TextAlign.CENTER),
                        Container(
                            content=Image(
                                src=option["bookmaker"]["icon"],
                                height=30,
                                fit=ImageFit.CONTAIN,
                            ),
                            on_click=lambda _: self.copy_to_clipboard(option["link"]),
                            col=2,
                            alignment=alignment.center,
                        ),
                    ], vertical_alignment=CrossAxisAlignment.CENTER, alignment=MainAxisAlignment.CENTER),
                    self.bet["options"]
                ))
            ],width=float("inf"),spacing=1,ref=self.table_info_ref),
            
            Divider(color=colors.BLUE_ACCENT),

            # bets amounts
            Text("Bets info",size=20),
            Column([ 
                ResponsiveRow([
                    Text("Bet",col=4,size=30),
                    Text("-",col=4,size=30),
                    Text("Profit",col=4,size=30),
                ]),
                *list(map(
                    lambda option: (
                        ResponsiveRow([
                            Container(
                                content=Text(add_dots(option["amount_to_bet"]),size=20),
                                on_click=lambda e: self.copy_to_clipboard(option["amount_to_bet"]),
                                col=4,
                            ),
                            
                            Text("→",col=4,size=25),
                            
                            Text(add_dots(option["profit_amount"]),col=4,size=20),
                        ])
                    )   
                    ,self.bet["options"]
                ))
             ],spacing=1,ref=self.table_amounts_ref),
            ElevatedButton("Execute",disabled=True)
            ,Divider(color=colors.BLUE_ACCENT),

            Text(f'Total Profit: {add_dots(self.bet["info"]["profit_amount"])}',
                 size=20,ref=self.total_profit_ref,weight=FontWeight.BOLD,color=profit_color), 
            ],
            expand=1,
            horizontal_alignment=CrossAxisAlignment.CENTER,
            width=float("inf"),
            spacing=1,
            ),
            height=self.page.height,
            bgcolor=bg_color,
            padding=padding.all(10),
            )
            