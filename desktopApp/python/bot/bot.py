from .manual_bot_module import manual_bot_class as Bot

def bet(bm,option,amount):
    """bets in real bookmakers

    Args:
        bm (str): can be "codere" / "wplay" / "betplay"
        option (_type_): name of the option to bet on (e.g. "jaguares cordoba")
        amount (_type_): amount to bet in COP
    """
    bot=Bot()
    bot.bet_in_bookmaker(
    bookmaker_window=bot.get_bm_window(bm),
    amount=amount,
    option=option
  )