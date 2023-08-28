from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from getters import *
from helper_functions import *



app = Flask(__name__)

@app.route('/scrape', methods=['GET'])
@app.route('/scrape/<int:page_id>', methods=['GET'])
def scrape(page_id=0):
    try:
        return jsonify(
            get_data_from_bookmaker(page_id)
        )   
            
    except Exception as e:
        print('An exception occurred')
        return jsonify({'error': e}), 500

@app.route('/sureBets', methods=['GET'])
def sureBets():
    info = {}
    info = {"response":get_sure_bets()}
    """ try:
        info = {"response":get_sure_bets()}
    except Exception as error:
        print("error: ", error)
        info = {"error":str(error)}
     """    
    return jsonify(info)   

@app.route('/get_closest_name/<string:name>', methods=['GET'])
def get_closest_name(name):
    return jsonify(
        {"team":find_closest_team(name)}
    )

# ------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)
