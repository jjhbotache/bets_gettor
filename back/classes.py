from bs4 import BeautifulSoup
from helper_functions import str_compare 
from functools import reduce

# make a class that gets two teams and create a match obj
class Match:
    def __init__(self, team1, team2, events:list):
        self.team1 = team1
        self.team2 = team2
        self.events = events
        
    def __str__(self):
        return f"{self.team1} vs {self.team2}"


class Option:
    def __init__(self, name:str, odd:float, bookmaker):
        self.name = name
        self.odd = odd
        self.bookmaker = bookmaker
    
    def __str__(self):
        return f"{self.name} ({self.odd})"

class Bookmaker:
    def __init__(self, name:str, id:int):
        self.name = name
        self.id = id
    
    def __str__(self):
        return f"{self.id}) {self.name}"
    
class Event:
    two_events_similarity_umbral = 1.3
    
    def __init__(self,team1:dict,team2:dict,drawOdd:float,bookmaker:dict):
        self.bookmaker = Bookmaker(bookmaker["name"],bookmaker["id"])
        self.team1= Option(team1["name"],float(team1["odd"]),self.bookmaker)
        self.team2= Option(team2["name"],float(team2["odd"]),self.bookmaker)
        self.draw = Option("Draw",drawOdd,self.bookmaker)
        
        
        # self.get_teams_from_div()
    def get_dict(self):
        return {
            "bookmaker": self.bookmaker.__dict__,
            "options":
        [
            {
                "name": self.team1.name,
                "odd": float(self.team1.odd)
            },
            {
                "name": self.draw.name,
                "odd": float(self.draw.odd)
            },
            {
                "name": self.team2.name,
                "odd": float(self.team2.odd)
            }
        ]}
    
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
            return Event(
                {
                    "name":min([self.team1.name,other_event.team1.name],key=lambda name : len(name)),
                    "odd":0
                },
                {
                    "name":min([self.team2.name,other_event.team2.name],key=lambda name : len(name)),
                    "odd":0
                },
                0,
                {
                    "id":0,
                    "name":""
                }
            )
        else:
          return False
      
    def __str__(self):
        return f"""{self.team1} VS {self.team2} // {self.draw}"""
    

class Surebet:
    def __init__(self, events:list):
        self.events = events
        self.team1 = self.events[0].team1
        self.team2 = self.events[0].team2
        self.draw = self.events[0].draw
        self.get_biggers_odds()

        
    def get_biggers_odds(self):
        # for each option, get the bigger odd with its bookmaker
        teams = [event.team1 for event in self.events] + [event.team2 for event in self.events]
        
        teams.sort(key=lambda team : str_compare(team.name,self.team1.name)) 
        
        teams1 = teams[:len(teams)//2]
        teams2 = teams[len(teams)//2:]
        
        
        self.team1 = max(teams1, key=lambda team : team.odd)
        self.team2 = max(teams2, key=lambda team : team.odd)
        self.draw = max([event.draw for event in self.events], key=lambda team : team.odd)
         
        
        
    def __str__(self):
        bet_amount = 50000
        
        prob_imp_t1 = 1 / self.team1.odd
        prob_imp_t2 = 1 / self.team2.odd
        prob_imp_d = 1 / self.draw.odd
        
        self.sum = prob_imp_t1 + prob_imp_t2 + prob_imp_d
        
        if self.sum < 1:
            
            # Cantidad a Apostar en Opción = (Probabilidad Implícita de Opción / Suma de las Probabilidades Implícitas) * Factor de Estaca
            
            return f"""
                Surebet:
                {self.team1} VS {self.team2} // {self.draw}
                
                Apuesta al {self.team1.name} en {self.team1.bookmaker.name}: {(prob_imp_t1/self.sum) * bet_amount }
                Apuesta al {self.team2.name} en {self.team2.bookmaker.name}: {(prob_imp_t2/self.sum) * bet_amount }
                Apuesta al {self.draw.name} en {self.draw.bookmaker.name}: {(prob_imp_d/self.sum) * bet_amount }
                
                apuesta: {bet_amount}
                ganancia: {(((prob_imp_t1/self.sum) * bet_amount ) * self.team1.odd)-bet_amount} 
                
            """
        else:
            return""
            return f"no surebet in:  {self.team1} VS {self.team2} // {self.draw}"
        