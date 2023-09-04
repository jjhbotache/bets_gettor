import requests
from bs4 import BeautifulSoup
from helper_functions import *
from classes import *
from app import bookmakers

  
def scrape_page(id):
  
  response = {"msg":"no info"}
  data_usable = None
  bookmaker_dict = {"name":bookmakers[id],"id":id}
  if id==1:
    url = "https://apuestas.wplay.co/es"
    
    page_response = requests.get(url)
    html = BeautifulSoup(page_response.text, "html.parser")
    div_container = html.find("div", {"id": "USInplay-tab-FOOT"})
    
    divs = div_container.find_all("div", {"class": "mkt"}) 
    # filter them by the ones that have: in the div with the "markets" class, 3 td's
    divs = list(filter(lambda div : len(div.find_all("td"))>=3, divs))
    
    buttons = list(map(lambda div : div.find_all('button', {'class': 'price'}), 
                  divs))
    

    # Loop through each button and extract the team name and odds
    events = []
    for button in buttons:
      new_event = []
      for opt in button:
        name = opt.find("span", {"class": "seln-label"}).text.strip()
        odd = float( opt.find("span", {"class": "price dec"}).text.strip() )
        new_event.append({"name": name, "odd": odd})
      new_event = Event(new_event[0],new_event[2],new_event[1]["odd"],bookmaker_dict)
      events.append(new_event)
      
    response = [e.get_dict() for e in events]
    data_usable = events
  elif id==2:
    response = {"msg":"succesfully"}
    
    api_route = 'https://na-offering-api.kambicdn.net/offering/v2018/betplay/event/live/open.json?channel_id=1&lang=es_CO&market=CO'
    api_response = requests.get(api_route)
    api_response = api_response.json()
    # en "liveEvents", por cada evento, se busca el "mainBetOffer" de donde se sacan las "outcomes" y se imprimien
    events = api_response["liveEvents"]
    events = list(filter(lambda event : 
      event["event"]["path"][0]["englishName"].lower() == "football"
      , events))
    
    
    def get_mainBetOffer(event):
      output = None
      try:
        output = event["mainBetOffer"]["outcomes"]
      except:
        print("error, couldnt get the mainBetOffer of the event:")
        print(event["event"]["name"])
      return output
    
    events = list(map(get_mainBetOffer, events))
    print("len events:",len(events))
    events_objs = []
    for e in events:
      try:
        events_objs.append(
        Event(
          {
            "name": e[0]["participant"],
            "odd": e[0]["odds"]/1000
          },
          {
            "name": e[2]["participant"],
            "odd": e[2]["odds"]/1000          
          },
          e[1]["odds"]/1000,
          bookmaker_dict
        )
        )
        print(events_objs[-1])
        print("-"*60)
      except:
        pass
    response = [e.get_dict() for e in events_objs]
    data_usable = events_objs
  elif id==3:
    url = "https://m.codere.com.co/NavigationService/Home/GetLiveEventsBySportHandle?sportHandle=soccer&gametypes=1"
    data = requests.get(url)
    data = data.json()  
    # this returns a list of objs with a list of events
    events_objs = []
    for obj in data:
      events = obj["Events"]
      for event in events:
        try:
          results = event["Games"][0]["Results"]
          # print(
          #   f"""{results[0]['Name']}({results[0]['Odd']}) vs {results[2]['Name']}({results[2]['Odd']}))
          #       Draw({results[1]['Odd']})
          #   """
          # )
        
          print("-"*60)
          events_objs.append(
            Event(
              {
                "name": results[0]['Name'],
                "odd": results[0]['Odd']
              },
              {
                "name": results[2]['Name'],
                "odd": results[2]['Odd']          
              },
              results[1]['Odd'],
              bookmaker_dict
            )
          )
          
        except:
          pass
    
    response = [e.get_dict() for e in events_objs]
    data_usable = events_objs
  elif id==0:
    id_to_scrape = 1
    response = []
    data_usable = []
    
    
    while True:
      try:
        scrape = scrape_page(id_to_scrape)
        response.append(scrape[0])
        data_usable.append(scrape[1])
        id_to_scrape+=1
      except IndexError as e:
        break
      except Exception as e:
        print("error:",e)
        raise e
        break
  else:
    raise IndexError("id not found")
    
  return response, data_usable

def get_sure_bets():
  response = {"msg":"no info"}
  """this function gets the sure bets from the data of the bookmakers

  Returns:
      sure_bets: a list with the sure bets
  """
  
  surebets = []
  matches = []
  
  list_of_events = scrape_page(0)[1]
  number_of_bookmakers = len(list_of_events)
  for index in range(number_of_bookmakers):
    for event in list_of_events[index]:
      if any([list_of_matches[0].compare_with_other_event(event) not in [None,False] for list_of_matches in matches]): continue
      
      
      print("analizing event:",event)
      ideal_event_to_compare = None
      same_events = []
      
      for index_to_look_for in range(number_of_bookmakers):
        if index_to_look_for == index: continue
        
        for event_in_question in list_of_events[index_to_look_for]:
          # print("evento en cuestion:",event_in_question)
          base_obj_to_compare = ideal_event_to_compare if ideal_event_to_compare not in [None,False] else event
          result = base_obj_to_compare.compare_with_other_event(event_in_question)
          if result not in [None,False]:
            same_events.append(event_in_question)
            ideal_event_to_compare = result
            break
          
      if len(same_events) > 0:
        same_events.append(event)
        matches.append(same_events)
        
  print("~"*60)
  for lists in matches:
    print("~"*60)
    current_surebet = Surebet(lists)
    print(current_surebet)
    if current_surebet.is_surebet : surebets.append(current_surebet)
    
    
    
  

  return [
    surebet.get_dict() for surebet in surebets
  ]