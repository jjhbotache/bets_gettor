# make a class that gets two teams and create a match obj
class Match:
    def __init__(self, team1, team2, events:list):
        self.team1 = team1
        self.team2 = team2
        self.events = events
        
    def __str__(self):
        return f"{self.team1} vs {self.team2}"
