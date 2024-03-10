from flet import *
from components.bets_lister import Bets_lister
from components.bet_viewer import Bet_viewer
from bets_gettor_logic.app import get_sure_bets
import threading
import time
import os
import asyncio
from constants import DEBUG

# print(*(dir(UserControl())),sep="\n")
class Main_page(UserControl):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.surebets = []
        self.sb_on_bet_viewer = None
        

        self.old_surebets = [
            # {
            # id: abcdef,
            # start_time: 123456,
            # end_time: 123456,
            # }
        ]
        self.sb_old_surebet = None


        self.bets_listener_column_ref = Ref[Column]()
        self.bet_viewer_column_ref = Ref[Column]()


    def set_sb_in_bet_viewer(self, sb):
        """This method is called from the bet viewer to set the surebet in the bet viewer """
        print("setting sb in bet viewer:",sb["info"]["id"])
        self.sb_on_bet_viewer = sb
        
        self.sb_old_surebet = [old_sb for old_sb in self.old_surebets if old_sb["id"] == sb["info"]["id"]][0]
        self.update_main_columns(update_bet_listener=False)

    def get_sure_bets_thread(self):
        """ This method is called in a thread to get the surebets forever """
        if DEBUG: print("starting loop! getting surebets")
        while True:
            if DEBUG: print("getting surebets"+("-"*60))
            self.surebets = get_sure_bets()
            if DEBUG: print("surebets: ",len(self.surebets))


            # for each surebet, if it is not in the old_surebets list,
            # if it is not, add it
            # also, for each old surebet, if it is not in the new surebets list, set the end_time
          
            old_surebet_ids = [old_sb["id"] for old_sb in self.old_surebets]
            for sb in self.surebets:
                sb_id = sb["info"]["id"]
                if sb_id not in old_surebet_ids:
                    self.old_surebets.append(
                        {
                            "id": sb_id,
                            "start_time": time.time(),
                            "end_time": None
                        }
                    )

            new_surebet_ids = [sb["info"]["id"] for sb in self.surebets]
            for old_sb in self.old_surebets:
                old_surebet_id = old_sb["id"]
                if old_surebet_id not in new_surebet_ids:
                    old_sb["end_time"] = time.time()

            self.update_main_columns(update_bet_viewer=False)
     
    def update_main_columns(self,update_bet_viewer=True,update_bet_listener=True):
      """ This method updates the main columns """
      if update_bet_listener:
        self.bets_listener_column_ref.current.controls = [
          Bets_lister(
            page=self.page,
            surebets=self.surebets,
            on_set_sb_in_bet_viewer=self.set_sb_in_bet_viewer
          )
        ]

      if update_bet_viewer:
        self.bet_viewer_column_ref.current.controls = [
          Bet_viewer(
            page=self.page,
            get_sb=self.get_sb_to_bet_viewer,
          )
        ]
      
      self.update()
        

    def get_sb_to_bet_viewer(self):
        """ This method returns the surebet that is being shown in the bet viewer """
        if self.sb_on_bet_viewer:
          return {
              **self.sb_on_bet_viewer,
              "old_surebet": self.sb_old_surebet
          }
        else:
          return None


    def did_mount(self):
        if DEBUG: print("did mount")
        self.update_main_columns()
        self.page.run_thread(self.get_sure_bets_thread())


    def build(self):
        if DEBUG: print("building")
        return(
          Row([
            Column([],expand=1,ref=self.bets_listener_column_ref),
            Column([],expand=1,ref=self.bet_viewer_column_ref),
          ])
        )