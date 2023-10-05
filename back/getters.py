import requests
from bs4 import BeautifulSoup
from helper_functions import *
from classes import *
from app import bookmakers
import threading

  
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
    
    # clock ticking clock_mode_forward first_half first_half
    # Loop through each button and extract the team name and odds
    events = []

    button_indices = range(len(buttons))  # Crear una lista de índices de botones
    for button_idx in button_indices:
        print("-" * 60)
        time = divs[button_idx].find("span", {"class": "clock"}).text.strip()
        
        new_event = []
        button = buttons[button_idx]  # Obtener el botón actual utilizando el índice
        classes = button[0]["class"]
        code = classes[-1].split("-")[-1]
        # https://apuestas.wplay.co/es/e/19637325
        link = "https://apuestas.wplay.co/es/e/" + code
        print(link)
        for opt in button:
            name = opt.find("span", {"class": "seln-label"}).text.strip()
            odd = float(opt.find("span", {"class": "price dec"}).text.strip())
            new_event.append({"name": name, "odd": odd})
        
        new_event = Event(new_event[0], new_event[2], new_event[1]["odd"], bookmaker_dict, link=link, time=time)
        events.append(new_event)

    response = [e.get_dict() for e in events]
    data_usable = events
  elif id==2:
    response = {"msg":"succesfully"}
    
    api_route = 'https://na-offering-api.kambicdn.net/offering/v2018/betplay/event/live/open.json?channel_id=1&lang=es_CO&market=CO'
    api_response = requests.get(api_route)
    api_response = api_response.json()
    # en "liveEvents", por cada evento, se busca el "mainBetOffer" de donde se sacan las "outcomes" y se imprimien
    raw_events = api_response["liveEvents"]
    events = list(filter(lambda event : 
      event["event"]["path"][0]["englishName"].lower() == "football"
      , raw_events))
    
    # https://betplay.com.co/apuestas#event/live/1019952772
    
    
    def get_mainBetOffer(event):
      output = None
      link = ""
      try:
        # print(event)
        # https://betplay.com.co/apuestas#filter/football/all/all/kuopion_palloseura__w_
        team = event["event"]["name"].split(" - ")[0]
        print("event:",team)
        link = " https://betplay.com.co/apuestas#filter/football/all/all/"+generar_segunda_string(team)
        # link = f"https://betplay.com.co/apuestas#event/live/1020077375{event['event']['id']}"
        # link = f"https://betplay.com.co/apuestas#event/live/1020077375{event['event']['id']}"
        
        output = event["mainBetOffer"]["outcomes"]
      except Exception as e:
        print("error, couldnt get the mainBetOffer of the event:",e)
        print(event["event"]["name"])
      return output,link
    
    events = list(map(get_mainBetOffer, events))
    print("len events:",len(events))
    events_objs = []
    event_indices = range(len(events))  # Crear una lista de índices de eventos

    for event_idx in event_indices:
        clock = raw_events[event_idx]["liveData"]["matchClock"]
        time = f"{'0' if len(str(clock['minute']))==1 else ''}{clock['minute']}:{'0' if len(str(clock['second']))==1 else ''}{clock['second']}"
      
        event_data = events[event_idx]  # Obtener los datos del evento actual utilizando el índice
        event = event_data[0]
        link = event_data[1]
        try:
            events_objs.append(
                Event(
                    {
                        "name": event[0]["participant"],
                        "odd": event[0]["odds"] / 1000
                    },
                    {
                        "name": event[2]["participant"],
                        "odd": event[2]["odds"] / 1000
                    },
                    event[1]["odds"] / 1000,
                    bookmaker_dict,
                    link,
                    time
                )
            )
            print(events_objs[-1])
            print("-" * 60)
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
        time = event["liveData"]["MatchTime"]
        time_str = f" {'0' if time<10 else ''}{time}:00"
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
              bookmaker_dict,
              f"{results[0]['Name']} - {results[2]['Name']}",
              time_str
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
    
    thread_list = []
    
    all_answers = []
    # Función para ejecutar la tarea y almacenar el resultado
    def task_fn(fn,args, result_var):
      result = fn(args)
      result_var.append(result)
      
    for bookmaker_id in range(1,len(bookmakers)):
      try:
        thread_list.append(threading.Thread(target=task_fn, args=(scrape_page,id_to_scrape,all_answers)))
        id_to_scrape+=1
        
        
      except IndexError as e:
        break
      except Exception as e:
        print("error:",e)
        raise e
        break
        
    for thread in thread_list:
      print("()()()(()()()()()(using "+str(get_memory_used_mb())+" mb of memory)()()()(()()()()()")
      memory_per_process = get_memory_used_mb()/len(thread_list) + 10
      if get_memory_used_mb()+memory_per_process > 512:
        for thread in thread_list:
          thread.join()
          # delete the thread
          thread_list = []
          
      thread.start()

    for thread in thread_list:
      thread.join()
      
    for answer in all_answers:
      response.append(answer[0])
      data_usable.append(answer[1]) 
      
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