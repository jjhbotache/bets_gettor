import requests
from bs4 import BeautifulSoup
from helper_functions import *
from classes import *

total_bookmakers = 3

def get_data_from_bookmaker(bookmaker=0):
  if bookmaker == 1:
    return get_data_from_codere()
  elif bookmaker == 2:
    return get_data_from_betplay()
  elif bookmaker == 3:
    return get_data_from_wplay()
  elif bookmaker == 0:
    all_bets = []
    for bookmaker in range(total_bookmakers):
      # get the data from the bookmaker
      data_from_bookmaker = get_data_from_bookmaker(bookmaker+1)
      # get the bets from the data
      bets_from_bookmaker = data_from_bookmaker["bets"]
      all_bets.append(bets_from_bookmaker)
      
    return {
      "bets": all_bets,
      "msg": "here is the info from all the bookmakers"
    }
  
  else:
    return {
      "msg": "bookmaker not found"
    }
  

def get_data_from_codere():
  """idk how df the page gets the info, then I scrape the page and get the info from the html
  

  Returns:
      info_dict: a dict with the info from the page
  """
  info_dict = {}
  try:
    
    api_route = "https://m.codere.com.co/NavigationService/Home/GetEvents?parentId=3069005120&gameTypes=1"
    
    response = requests.get(api_route)
    info_dict["response"] = response.json()
    info_dict["betsAvailable"] = list(
      map(
        lambda obj : obj["Games"]
          , info_dict["response"])
    )
    
    
    info_dict["bets"] = []
    for event in info_dict["betsAvailable"]:
      event = event[0]
      # print("-"*60)
      # print(event)
      event_name = find_closest_team(event["Results"][0]["Name"]) + " vs " + find_closest_team(event["Results"][2]["Name"])
      odds = event["Results"]
      mapped_odds = list(
        map(
          lambda odd : {
            "name": find_closest_team(odd.get("Name", "Draw")) if odd.get("Name", "Draw") != "X" else "Draw",
            "odds": odd["Odd"],
            "id_bookmaker": 1,
          },
          odds
        )
      )
      info_dict["bets"].append({
        "event": event_name,
        "odds": mapped_odds
      })
      
    # this lines just send  the bets
    info_dict = {
      "bets": info_dict["bets"],
      "msg": "here is the info from codere colombia matchs with 1x2 bets available and its odds"
    }
  
  except Exception as e:
    info_dict["msg"]= "could get the info of betplay"
    info_dict["error"] = str(e)
  
  
  return info_dict

def get_data_from_betplay():
  """here we get the info from betplay colombia matchs with 1x2 bets available and its odds
  the api is understandable so we can get the info from the response directly

  Returns:
      info_dict: a dict with the info from the page
  """
  
  info_dict = {}
  try:
    api_route = 'https://na-offering-api.kambicdn.net/offering/v2018/betplay/listView/football/colombia.json?lang=es_CO&market=CO&client_id=2&channel_id=1&ncid=1692045302877&useCombined=true'
    
    response = requests.get(api_route)
    info_dict["response"] = response.json()
    # filtrar los eventos que tengan betOffers de id 2
    # impirmir el nombre del evento, los nombres de los equipos y el valor de las cuotas
    
    info_dict["betsAvailable"] = list(
      filter(lambda event : 
            event["betOffers"][0]["betOfferType"]["id"] == 2
            , info_dict["response"]["events"]
            )
    )
    info_dict["bets"] = []
    
    for event in info_dict["betsAvailable"]:
      odds = event["betOffers"][0]["outcomes"]
      event_name = find_closest_team(odds[0]["participant"]) + " vs " + find_closest_team(odds[2]["participant"])
      mapped_odds = list(
        map(
          lambda odd : {
            "id_bookmaker": 2,
            "name": find_closest_team( odd.get("participant", "Draw").lower()) if odd.get("participant", "Draw") != "Draw" else "Draw",
            "odds": odd["odds"]/1000
          },
          odds
        )
      )
      info_dict["bets"].append({
        "event": event_name,
        "odds": mapped_odds,
        "id_bookmaker": 2,
      })
      

    # this lines just send  the bets
    info_dict = {
      "id_bookmaker": 2,
      "bets": info_dict["bets"],
      "msg": "here is the info from betplay colombia matchs with 1x2 bets available and its odds"
    }

  except Exception as e:
    info_dict["msg"]= "could get the info of betplay"
    info_dict["error"] = str(e)
   
  return info_dict

def get_data_from_wplay():
  info_dict = {}
  # get the html and make a soup object https://apuestas.wplay.co/es/PrimeraAColombia
  try:
    url = "https://apuestas.wplay.co/es/PrimeraAColombia"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    # from it, get all the objects with the property data-mkt_id
    divs_with_odds = soup.find_all("div", {"data-mkt_id": True})
    # for each div, find the span with the seln-name class
    # and the span with the price and dec classes
    # and append the info to the bets list
    info_dict["bets"] = []
    for div in divs_with_odds:
      try:
        options = div.find_all("td")
        odds = list(
          map(
            lambda td : {
              "id_bookmaker": 3,
              "name": find_closest_team  (td.find("span", {"class": ["seln-name","seln-draw-label"]}).text) if not (td.find("span", {"class": ["seln-name","seln-draw-label"]}).text in ["Draw","Empate"]) else "Draw",
              "odds": td.find("span", {"class": "price dec"}).text
            },
            options
          )
        )
        event_name = find_closest_team( odds[0]["name"]) + " vs " + find_closest_team( odds[2]["name"])
      
        info_dict["bets"].append({
          "event": event_name,
          "odds": odds,
        })
      except:
        print("error, couldnt get the info of the div")
        
    info_dict["msg"]= "here is the info from wplay colombia matchs with 1x2 bets available and its odds"
  except Exception as e:
    info_dict["msg"]= "could get the info of betplay"
    info_dict["error"] = str(e)
   
  return info_dict

def get_sure_bets():
  """this function gets the sure bets from the data of the bookmakers

  Returns:
      sure_bets: a list with the sure bets
  """
  
  matches = []
  # save for each bookmaker, a list of bets
  all_bets = get_data_from_bookmaker()["bets"]
  # get the longest list of bets
  longest_list = max(all_bets, key=lambda bets: len(bets))
  # print("longest_list:",longest_list)
  for event in longest_list:
    # from the odds of the event, get the two teams
    event_odds = [odd["name"] for odd in event["odds"]]
    teams = list(filter(
      lambda odd : odd!="Draw",
      event_odds
      ))
    # print("teams:",teams)
    # verify if the teams are in the other events of the other bookmakers
    number_of_bookmakers_in = 0
    temp_events = []
    for list_of_events in all_bets:
      for event in list_of_events:
        if event["odds"][0]["name"] in teams and event["odds"][2]["name"] in teams:
          temp_events.append(event)
          number_of_bookmakers_in+=1
          break
    print("number_of_bookmakers_in:",number_of_bookmakers_in)
    if number_of_bookmakers_in >= 3:
      matches.append(Match(teams[0], teams[1], temp_events))
      # print last matches
      print(matches[-1])
  
  
  print("matches:",([str(m) for m in matches]))
  
  # for each match, get the sure bets
  for match in matches:
    get_sure_bets_from_events(match.events)
  return {
    "msg":"sure bets",
    }
  