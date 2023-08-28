import difflib
from consts import TEAMS

def find_closest_team(input_name):
    input_parts = input_name.lower().split()
    closest_match = difflib.get_close_matches(' '.join(input_parts), TEAMS, n=1, cutoff=0)
    if closest_match:
        # print(f"{input_name} -> {closest_match[0]}")
        return closest_match[0]
    else:
        return None

def sum_all(numbers):
    sum = 0
    for i in numbers: sum+=i
    return sum

def calcular_montos_apuesta(odds, inversion_total):
    for odd in odds: odds[odd]["implicit_prob"] = 1/float(odds[odd]["odds"]) 
    
    sum_probabilities = sum_all([odds[odd]["implicit_prob"] for odd in odds])
    
    for odd in odds: odds[odd]["invest_amount"] = inversion_total * (odds[odd]["implicit_prob"]/sum_probabilities)
    
    print("odds:",odds)
    return odds

def get_sure_bets_from_events(events:list):
    # verify that the events are from the same match
    teams = []
    for e in events: teams+= e["event"].split(" vs ")
    print("teams:",teams)
    print("teams:",set(teams))
    if len(set(teams)) != 2: raise Exception("the events are not from the same match")
    print("good")
    bigger_odds = {
        teams[0]:{"odds":0},
        teams[1]:{"odds":0},
        "Draw":{"odds":0}
    }
    # print("bigger odds:",bigger_odds)
    # for each team, get the bigger odds 
    odds = [event["odds"] for event in events]
    for odd_option in bigger_odds:
        odd_options = [list(filter(lambda odd : odd["name"] == odd_option,odd))[0] for odd in odds]
        # odds = [(odd if odd["name"] == odd_option else None ) for odd in odds]
        # print("odds:",odds)
        # filter the odds by the ones that are from the team
        bigger_odds[odd_option] = max(odd_options, key=lambda x: float(x["odds"]))
    
    print("bigger odds:",bigger_odds)
    
    # whit the bigger odds, calculate if exists a sure bet
    sumatory = sum_all(
        [1/float(odd["odds"]) for odd in bigger_odds.values()]
    )
    print("="*60)
    print("sumatory:",sumatory)
    # print if there is a sure bet
    if sumatory > 1: 
        print("no sure bet")
        # bigger_odds = calcular_montos_apuesta(bigger_odds, 50000)
    else:
        print("="*120)
        print("sure bet :D")
        print("="*120)
        
    bigger_odds = calcular_montos_apuesta(bigger_odds, 50000)
        
    for odd_option in bigger_odds: print(f"""
    bet {bigger_odds[odd_option]["invest_amount"]} to {odd_option} in the bookmaker {bigger_odds[odd_option]["id_bookmaker"]}                              
                                    """)
    invest = sum_all([bigger_odds[odd]["invest_amount"] for odd in bigger_odds])
    final_profit = bigger_odds[odd_option]["invest_amount"] * float(bigger_odds[odd_option]["odds"])
    print(f"""
        total bet: {invest}
        final profit: {final_profit}
        profit percentage: {round((1-sumatory)*100,2)}%
            """)
        
        
