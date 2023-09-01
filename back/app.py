from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from getters import *
from helper_functions import *



app = Flask(__name__)

            

@app.route('/sure_bets', methods=['GET'])
def sureBets():
    info = get_sure_bets()
    return jsonify(info)   

# ------------------------------------------------------------
# V2

bookmakers = [
    "all",
    "wplay",
    "betplay",
    "codere",
    "betjuego",
    "rushbet",
    "zamba",
    "betfair",
]

@app.route('/get_data_from_bookmaker', methods=['GET'])
@app.route('/get_data_from_bookmaker/<int:bookmaker_id>', methods=['GET'])
def get_data_from_bookmaker(bookmaker_id=0):
    response = {
        "msg": "no info",
        "bookmaker_id": bookmaker_id,
        "bookmaker_name": bookmakers[bookmaker_id],
    }
    
    response["response"] = scrape_page(bookmaker_id)[0]
    response["msg"] = f"here is the info from the bookmaker {bookmaker_id}"
    
    # try:
    #     response["msg"] = f"here is the info from the bookmaker {bookmaker_id}"
    #     response["response"] = scrape_page(bookmaker_id)
    # except Exception as e:
        # response["msg"] = "bookmaker not found"
        # response["error"] = str(e)
  
    return jsonify(response)
    

# ------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
