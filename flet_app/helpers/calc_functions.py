def calc_amounts_to_bet(total_bet, bet):
    """
    total_bet: the total amount of money that is going to be bet
    bet: the sb_bet dict that contains the amount of money that is going to be bet
    """
    # print(f"bet: {bet}")
    if bet == None: return [0,0,0]

    inverses_sum = bet["info"]["sum"]

    percentages = [
        o["prob_impl"]/inverses_sum for o in bet["options"]
    ]
    amounts = [
        int(total_bet)*p for p in percentages
    ]
        
    return amounts
