from flet import *
from components.bets_lister import Bets_lister
from components.bet_viewer import Bet_viewer
from modules.bets_gettor_logic.app import get_sure_bets
import time
from constants import DEBUG
from helpers.main_page_functions import old_bets_register_manager
from helpers.calc_functions import calc_amounts_to_bet
from helpers.number_funtions import normalize_amount
from plyer import notification


class Main_page(UserControl):
    def __init__(self, page):
        super().__init__()
        self.page = page
        # globals
        self.surebets = []
        self.bet_on_bet_viewer = None
        self.amount_to_bet = 50000
        self.getting_surebets = False
        

        self.old_surebets_registers = []


        self.bets_listener_column_ref = Ref[Column]()
        self.bet_viewer_column_ref = Ref[Column]()

    def set_sb_in_bet_viewer(self, sb):
        """This method is called from the bet viewer to set the surebet in the bet viewer """

        print("setting sb in bet viewer:",sb["info"]["id"])
        self.bet_on_bet_viewer = sb
        self.page.run_thread(self.sync_bet_on_bet_viewer_thread())
        return
        old_bet_with_same_id = [old_sb for old_sb in self.old_surebets_registers if old_sb["id"] == sb["info"]["id"]][0]
        # prepapre the bet to be shown in the bet viewer
        self.bet_on_bet_viewer["info"]["start_time"] = old_bet_with_same_id["start_time"]
        self.bet_on_bet_viewer["info"]["end_time"] = old_bet_with_same_id["end_time"]
        
    def sync_and_set_bet_data(self,bet_id):
      """ This method is called to sync the info of the bet on the bet viewer"""
      if self.bet_on_bet_viewer:
        

        try: self.bet_on_bet_viewer = [bet for bet in self.surebets if bet["info"]["id"] == bet_id][0]
        except: pass

        # sync also the register
        old_bet_register = [old_sb for old_sb in self.old_surebets_registers if old_sb["id"] == self.bet_on_bet_viewer["info"]["id"]][0]
        self.bet_on_bet_viewer["info"]["start_time"] = old_bet_register["start_time"]
        self.bet_on_bet_viewer["info"]["end_time"] = old_bet_register["end_time"]

        # set the amounts and profits
        amounts = [normalize_amount(round(a)) for a in calc_amounts_to_bet( total_bet=self.amount_to_bet, bet=self.bet_on_bet_viewer )]
        for i,a in enumerate(amounts):
          self.bet_on_bet_viewer["options"][i]["amount_to_bet"] = a
          odd = self.bet_on_bet_viewer["options"][i]["odd"]
          self.bet_on_bet_viewer["options"][i]["profit_amount"] = odd * a

        min_profit_amount = min(o["profit_amount"] for o in self.bet_on_bet_viewer["options"])

        self.bet_on_bet_viewer["info"]["profit_amount"] = min_profit_amount - self.amount_to_bet

        self.update_main_columns(update_bet_listener=False)

    def get_sure_bets_thread(self):
        """ This method is called in a thread to get the surebets forever """
        if DEBUG: print("starting loop! getting surebets")
        while True:
            if DEBUG: print("getting surebets"+("-"*60))
            
            self.getting_surebets = True;self.update_main_columns(update_bet_viewer=False)
            new_surebets = get_sure_bets(
              ids_to_also_get=[self.bet_on_bet_viewer["info"]["id"]] if self.bet_on_bet_viewer else []
            )
            if len(new_surebets) > len(self.surebets):
              print("notifying!!")
              notification.notify(
                title="New surebets!",
                message=f"There are {len(new_surebets)-len(self.surebets)} new surebets!	",
                timeout=2,
                
              )
            self.surebets = new_surebets
            self.getting_surebets = False;self.update_main_columns(update_bet_viewer=False)

            if DEBUG: print("surebets: ",len(self.surebets))

            self.old_surebets_registers = old_bets_register_manager(
              old_bets_register_list= self.old_surebets_registers,
              new_bets_list= self.surebets,
              id_in_viewer= self.bet_on_bet_viewer["info"]["id"] if self.bet_on_bet_viewer else None
            )
            if DEBUG: print("old_surebets: ",*self.old_surebets_registers,sep="\n")


            if self.bet_on_bet_viewer: self.sync_and_set_bet_data(self.bet_on_bet_viewer["info"]["id"])
            
            self.update_main_columns()
            time.sleep(.3)

    def sync_bet_on_bet_viewer_thread(self):
        """ This method is called in a thread to sync the bet on the bet viewer """
        while self.bet_on_bet_viewer:
          self.sync_and_set_bet_data(self.bet_on_bet_viewer["info"]["id"])
          time.sleep(.6)

    def update_amount_to_bet(self,e):
        """ This method is called when the amount to bet is changed """
        self.amount_to_bet = int(e.control.value)
        self.update_main_columns(update_bet_listener=False)
     
    def update_main_columns(self,update_bet_viewer=True,update_bet_listener=True):
      """ This method updates the main columns """
      if update_bet_listener:
        self.bets_listener_column_ref.current.controls = [
          Bets_lister(
            page=self.page,
            surebets=self.surebets,
            on_set_sb_in_bet_viewer=self.set_sb_in_bet_viewer,
            on_amount_change=self.update_amount_to_bet,
            loading=self.getting_surebets
          )
        ]

      if update_bet_viewer:
        if self.bet_on_bet_viewer:
          self.bet_viewer_column_ref.current.controls = [
            Bet_viewer(
              page=self.page,
              bet=self.bet_on_bet_viewer,
              amount_to_bet=self.amount_to_bet,
            )
          ]
        else:
          self.bet_viewer_column_ref.current.controls = [
            Text("No bet selected",size=40)
          ]
          self.bet_viewer_column_ref.current.alignment = alignment.center
          self.bet_viewer_column_ref.current.horizontal_alignment = CrossAxisAlignment.CENTER

      try:
        self.update()
      except Exception as e:
        print("error updating columns:",e) 
        
    def get_sb_to_bet_viewer(self):
        """ This method returns the surebet that is being shown in the bet viewer """
        if self.bet_on_bet_viewer:
          return {
              **self.bet_on_bet_viewer,
              "old_surebet": self.sb_old_surebet
          }
        else:
          return None

    def on_amount_change(self,e):
        """ This method is called when the amount to bet is changed """
        self.amount_to_bet = int(e.control.value)
        self.update_main_columns(update_bet_listener=False)

    def did_mount(self):
        if DEBUG: print("did mount")
        self.update_main_columns()
        self.page.run_thread(self.get_sure_bets_thread())

    def build(self):
        if DEBUG: print("building")
        return(
          Row([
            Column([
              Container(
                content=Row(
                  [
                    TextField(value=self.amount_to_bet,label="Bet amount",input_filter=NumbersOnlyInputFilter(),on_change=self.on_amount_change),
                    IconButton(icon=icons.SETTINGS,tooltip="Settings",on_click=lambda e: self.page.go("/settings")),
                    # ElevatedButton(text="Execute manager",on_click=lambda e: self.page.go("/execute_manager"))
                  ],
                  alignment=MainAxisAlignment.SPACE_BETWEEN
                ),         
                bgcolor=colors.BLUE_GREY_500,
                height=self.page.height*0.1,
                padding=padding.all(5),
                margin=margin.only(bottom=5)
              ),
              Column([],expand=1,ref=self.bets_listener_column_ref),
            ],expand=1,height=self.page.height,spacing=0),
            Column([],expand=1,ref=self.bet_viewer_column_ref),
          ])
        )