import time

def old_bets_register_manager(old_bets_register_list:list, new_bets_list:list):
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
  print("old_bets_register_list: ",old_bets_register_list)
  new_old_bets_register_list = old_bets_register_list

  old_bets_ids = [old_bet["id"] for old_bet in old_bets_register_list]
  new_bets_ids = [new_bet["info"]["id"] for new_bet in new_bets_list]

  # for each new surebet, check if it is in the old surebets list
  for new_bet in new_bets_list:
    if new_bet["info"]["id"] in old_bets_ids:# if the new bet is in the old bets list, do nothing
      pass
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
      # set the end time of the old bet
      old_bet["end_time"] = time.time()

    else: # if the old bet is in the new bets list
      pass          
  return new_old_bets_register_list
    

