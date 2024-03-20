from bs4 import BeautifulSoup
from .helper_functions import *
from functools import reduce
from .consts import *
import time
import traceback

# make a class that gets two teams and create a match obj
class Match:
    def __init__(self, team1, team2, events:list):
        self.team1 = team1
        self.team2 = team2
        self.events = events
        
    def __str__(self):
        return f"{self.team1} vs {self.team2}"


class Option:
    @classmethod
    def get_js_code(self,bookmaker_id,name,price="prompt('Insert the price of the bet')"):
        
        price = "prompt('Insert the price of the bet')" if price == 0 else price
        js_code = ""
        functions=[]
        try:
            right_codes = list(filter(
                        lambda obj_code : int(obj_code["bm_id"]) == int(bookmaker_id)
                        , JS_CODES
                    ))
            rigth_dict = right_codes[0]
            js_code = rigth_dict["code"].replace(
                "<<name>>", name).replace(
                "'<<amount>>'", str(price))
                
            try:functions = rigth_dict["functions"]
            except:functions = []
                
        except Exception as e:
            print("===========error:",traceback.format_exc())
            return "no code"
        return js_code,functions
        
    
    def __init__(self, name:str, odd:float, bookmaker, link:str="",amount_to_bet:int=0):
        
        self.name = name
        self.odd = odd
        self.bookmaker = bookmaker
        self.link = link
        
    
    def __str__(self):
        return f"{self.name} ({self.odd})"

class Bookmaker:
    def __init__(self, id:int):
        self.id = id
        self.name = bookmakers[id]["name"]
        self.icon = bookmakers[id]["icon"]
    
    def __str__(self):
        return f"{self.id}) {self.name}"
    
class Event:
    two_events_similarity_umbral = 1.5
    
    def __init__(self,team1:dict,team2:dict,drawOdd:float,bookmaker_id:int,link:str="",time:str="00:00",amount_to_bet:int=0):
        
        self.bookmaker = Bookmaker(bookmaker_id)
        self.link = link
        self.time = time
        self.team1= Option(team1["name"],
        float(team1["odd"])
        ,self.bookmaker,self.link,amount_to_bet)
        self.team2= Option(team2["name"],float(team2["odd"]),self.bookmaker,self.link,amount_to_bet)
        self.draw = Option("Draw",drawOdd,self.bookmaker,self.link,amount_to_bet)
        
    def get_dict(self):
        return {
            "bookmaker": self.bookmaker.__dict__,
            "link": self.link,
            "time": self.time,
            "options":[
                {
                    "name": self.team1.name,    
                    "odd": self.team1.odd,
                    "bookmaker": self.team1.bookmaker.__dict__,
                    "link": self.link,
                },
                {
                    "name": self.team2.name,
                    "odd": self.team2.odd,
                    "bookmaker": self.team2.bookmaker.__dict__,
                    "link": self.link,
                },
                {
                    "name": self.draw.name,
                    "odd": self.draw.odd,
                    "bookmaker": self.draw.bookmaker.__dict__,
                    "link": self.link,
                }
            ]
        }
    
    def compare_with_other_event(self,other_event,umbral_acumulated_needed=two_events_similarity_umbral):
        """compare two events and return the ideal one that is the one with the shortest names

        Args:
            other_event (_type_): _description_
            umbral (float, optional): _description_. Defaults to 0.65.
        """
        coincidences1 = [
            str_compare(self.team1.name , other_event.team1.name),
            str_compare(self.team2.name , other_event.team2.name),
        ]
        coincidences2 = [
            str_compare(self.team1.name , other_event.team2.name),
            str_compare(self.team2.name , other_event.team1.name),
        ]
        
        
        
        if (
            reduce(lambda acum,coincidence: acum+coincidence,coincidences1) >= umbral_acumulated_needed
            or
            reduce(lambda acum,coincidence: acum+coincidence,coincidences2) >= umbral_acumulated_needed
        ):
            ideal_team1 = max([self.team1.name,other_event.team1.name],key=lambda name : len(name))
            ideal_team2 = max([self.team2.name,other_event.team2.name],key=lambda name : len(name))
            # ideal_team1 = self.team1.name
            # ideal_team2 = self.team2.name
            
            # print("ideal events",ideal_team1,"//",ideal_team2)
            return Event(
                {
                    "name":ideal_team1,
                    "odd":0
                },
                {
                    "name":ideal_team2,
                    "odd":0
                },
                0,
                0
            )
        else:
          return False
      
    def __str__(self):
        return f"""{self.team1} VS {self.team2} // {self.draw}"""
    

class Surebet:
    def __init__(self, events:list):
        self.events = events
        self.time = self.events[0].time
        self.team1 = self.events[0].team1
        self.team2 = self.events[0].team2
        self.draw = self.events[0].draw
        
        
        self.get_biggers_odds()
        
        self.prob_imp_t1 = 1 / self.team1.odd 
        self.prob_imp_t2 = 1 / self.team2.odd
        self.prob_imp_d = 1 / self.draw.odd
        
        self.sum = self.prob_imp_t1 + self.prob_imp_t2 + self.prob_imp_d
        
        self.is_surebet = self.sum < 1
        if DEBUG: self.is_surebet = self.sum < 1.2 #only for testing

        self.profit = (1 / self.sum) * 100 - 100
        
        # Limpiar y formatear los nombres de los equipos
        team1_name_cleaned = clean_and_format_name(self.team1.name)
        team2_name_cleaned = clean_and_format_name(self.team2.name)
        # Crear el ID combinando los nombres de los equipos limpios
        self.id = (team1_name_cleaned[:2] + team1_name_cleaned[-2:] +
                   team2_name_cleaned[:2] + team2_name_cleaned[-2:]).lower()
        # tomar la fecha actual en milisegundos
                      
    def get_biggers_odds(self):
        # for each option, get the bigger odd with its bookmaker
        teams = [event.team1 for event in self.events] + [event.team2 for event in self.events]
        
        teams.sort(key=lambda team : str_compare(team.name,self.team1.name)) 
        teams.sort(key=lambda team : str_compare(team.name,self.team2.name),reverse=True) 
        
        teams1 = teams[:len(teams)//2]
        teams2 = teams[len(teams)//2:]
        
        # set the team with the bigger odd
        self.team1 = max(teams1, key=lambda team : team.odd)
        self.team2 = max(teams2, key=lambda team : team.odd)
        self.draw = max([event.draw for event in self.events], key=lambda team : team.odd)
         
    def get_dict(self):
        
        return {
            "options":
        [
            {
                "name": self.team1.name,
                "odd": float(self.team1.odd),
                "bookmaker": self.team1.bookmaker.__dict__,
                "link": self.team1.link,
                "prob_impl": self.prob_imp_t1,
            },
            {
                "name": self.draw.name,
                "odd": float(self.draw.odd),
                "bookmaker": self.draw.bookmaker.__dict__,
                "link": self.draw.link,
                "prob_impl": self.prob_imp_d,
            },
            {
                "name": self.team2.name,
                "odd": float(self.team2.odd),
                "bookmaker": self.team2.bookmaker.__dict__,
                "link": self.team2.link,
                "prob_impl": self.prob_imp_t2,
            }
        ],
            "info":{
                "sum": self.sum,
                "is_surebet": self.is_surebet,
                "profit": self.profit,
                "time": self.time,
                "id": self.id
            }
        }
        
    def __str__(self):
        bet_amount = 50000
        return f" {self.team1} VS {self.team2} // {self.draw}"
        
        if self.sum < 1:
            # Cantidad a Apostar en Opción = (Probabilidad Implícita de Opción / Suma de las Probabilidades Implícitas) * Factor de Estaca
            return f"""
                Surebet:
                {self.team1} VS {self.team2} // {self.draw}
                
                Apuesta al {self.team1.name} en {self.team1.bookmaker.name}: {(self.prob_imp_t1/self.sum) * bet_amount }
                Apuesta al {self.team2.name} en {self.team2.bookmaker.name}: {(self.prob_imp_t2/self.sum) * bet_amount }
                Apuesta al {self.draw.name} en {self.draw.bookmaker.name}: {(self.prob_imp_d/self.sum) * bet_amount }
                
                apuesta: {bet_amount}
                ganancia: {(((self.prob_imp_t1/self.sum) * bet_amount ) * self.team1.odd)-bet_amount} 
                
            """
        else:
            return f"no surebet in:  {self.team1} VS {self.team2} // {self.draw}"
        