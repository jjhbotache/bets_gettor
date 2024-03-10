def calc_amounts_to_bet(total_bet, bet):
    """
    total_bet: the total amount of money that is going to be bet
    bet: the sb_bet dict that contains the amount of money that is going to be bet
    """

    inverses_sum = bet["info"]["sum"]

    percentages = [
        o["prob_impl"]/inverses_sum for o in bet["options"]
    ]
    amounts = [
        total_bet*p for p in percentages
    ]
        
    print(f"""
    for: {total_bet}
    bet to
    { 
        "                    ".join([f'option {i} (odd:{bet["options"][i]["odd"]}) : {amounts[i]}' for i in range(3)])
    }
    """)

    return amounts
