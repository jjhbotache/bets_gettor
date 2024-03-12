import time
from plyer import notification

def old_bets_register_manager(old_bets_register_list:list, new_bets_list:list, id_in_viewer=None):
  """"
  this function takes a list of old bets, a list of new bets and returns a updated old bets list

  Args:
  old_bets_list (list): list of old bets
  new_bets_list (list): list of new bets 

  """
  # this is how a bet looks like
  # {
  # id: abcdef,
  # start_time: 123456,
  # end_time: 123456,
  # }
  new_old_bets_register_list = old_bets_register_list

  old_bets_ids = [old_bet["id"] for old_bet in old_bets_register_list]
  new_bets_ids = [new_bet["info"]["id"] for new_bet in new_bets_list]

  # for each new surebet, check if it is in the old surebets list
  for new_bet in new_bets_list:
    if new_bet["info"]["id"] in old_bets_ids:# if the new bet is in the old bets list..
      old_bet_register = [old_bet for old_bet in old_bets_register_list if old_bet["id"] == new_bet["info"]["id"]][0]
      if old_bet_register["end_time"]:#if has an end time, means that the bet ended but reappeared
        old_bet_register["start_time"] = time.time()
        old_bet_register["end_time"] = None
    else: # if the new bet is not in the old bets list, add it
      new_old_bets_register_list.append(
        {
          "id": new_bet["info"]["id"],
          "start_time": time.time(),
          "end_time": None
        }
      )


  # for each old surebet, check if stills existing in the new surebets list
  # if not, set the end_time
 
  for old_bet in old_bets_register_list:
    old_bet_id = old_bet["id"]

    if old_bet_id not in new_bets_ids: # if the old bet is not in the news bets list, means that the bet is no longer available
      
      if not old_bet["end_time"]:
        # set the end time of the old bet
        old_bet["end_time"] = time.time()
        
        if old_bet_id == id_in_viewer:
          notification.notify(
          title="Bet no longer available!!",
          message="The bet with id: " + old_bet_id + " is no longer available",
          timeout=10
        )
      else:
        pass

    else: # if the old bet is in the new bets list
      pass          
  return new_old_bets_register_list
    

