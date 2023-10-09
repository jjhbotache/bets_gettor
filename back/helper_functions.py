from difflib import SequenceMatcher
import re
import psutil

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
    # print("teams:",teams)
    # print("teams:",set(teams))
    if len(set(teams)) != 2: raise Exception("the events are not from the same match")
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
            
def str_compare(str1:str,str2:str):
    return SequenceMatcher(None, str1, str2).ratio()
        
def generar_segunda_string(primera_string):
    # Convertir a minúsculas
    segunda_string = primera_string.lower()
    # Reemplazar espacios con guiones bajos
    segunda_string = re.sub(r'\s', '_', segunda_string)
    # Eliminar caracteres no alfanuméricos, excepto paréntesis y guiones bajos
    segunda_string = re.sub(r'[^\w\s\(\)]', '', segunda_string)
    # reemplazar cualquier cosa encerrada entre parentesis por "_w_"
    segunda_string = re.sub(r'\([^)]*\)', '_w_', segunda_string)
    
    
    
    return segunda_string


def get_memory_used_mb():
    # Obtener el uso de memoria actual del proceso de Python
    process = psutil.Process()
    memory_info = process.memory_info()

    # Obtener la cantidad de memoria utilizada en bytes
    memory_used_bytes = memory_info.rss

    # Convertir la cantidad de memoria a MB para mayor legibilidad
    memory_used_mb = memory_used_bytes / (1024 * 1024)
    
    return memory_used_mb

# Función para limpiar y formatear un nombre
def clean_and_format_name(name):
    # Utilizar una expresión regular para eliminar caracteres no alfabéticos
    cleaned_name = re.sub(r'[^a-zA-Z]', '', name)
    return cleaned_name

def format_str_to_minutes(tiempo):
    # Divide la cadena de tiempo en minutos y segundos
    minutos, segundos = map(int, tiempo.split(":"))
    
    # Calcula el total de minutos
    total_minutos = minutos + segundos / 60
    
    return total_minutos
