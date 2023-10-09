from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from getters import *
from helper_functions import *
from flask_cors import CORS
from waitress import serve
import sqlite3







app = Flask(__name__)

cors = CORS(app)

@app.route('/', methods=['GET'])            
def main():
    return "Hello World!"

@app.route('/sure_bets', methods=['GET'])
def sureBets():
    info = get_sure_bets()
    return jsonify(info)   

# ------------------------------------------------------------
# V2

bookmakers = [
    # "all",
    "wplay",
    "betplay",
    "codere",
    # "betjuego",
    # "rushbet",
    # "zamba",
    # "betfair",
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
    
    #     response["msg"] = f"here is the info from the bookmaker {bookmaker_id}"
    #     response["response"] = scrape_page(bookmaker_id)
    # except Exception as e:
        # response["msg"] = "bookmaker not found"
        # response["error"] = str(e)
    
@app.route('/manage_surebets', methods=['POST','GET','PUT','DELETE'])
def manage_surebet():
    conn = sqlite3.connect('surebets.db')
    c = conn.cursor()
    c.execute("PRAGMA table_info(surebets)")
    columns = c.fetchall()
    columns = [column[1] for column in columns]
    # for each method, do something
    # get the method
    method = request.method
    if method == "GET":
        # get all the surebets
        c.execute("SELECT * FROM surebets")
        surebets = c.fetchall()
        
        # get the columns from de DB
        
        
        # create a list of dicts with the columns and the values
        surebets = [
            {columns[i]:surebet[i] for i in range(len(columns))}
            for surebet in surebets
        ]
        
        print("done succesfully")
        return jsonify(surebets)
    elif method == "POST":
        # save a surebet
        # get the data
        data = request.json
        # save the data
        c.execute(f"""
            INSERT INTO surebets (
                code,
                team1,
                odd1,
                team2,
                odd2,
                odd3,
                profit,
                match_time_minutes,
                bookmaker1_id,
                bookmaker2_id,
                bookmakerDraw_id,
                period
            ) VALUES (
                '{data["info"]["id"]}',
                '{data["options"][0]["name"]}',
                {data["options"][0]["odd"]},
                '{data["options"][2]["name"]}',
                {data["options"][2]["odd"]},
                {data["options"][1]["odd"]},
                {data["info"]["profit"]},
                {format_str_to_minutes(data["info"]["time"])},
                {data["options"][0]["bookmaker"]["id"]},
                {data["options"][1]["bookmaker"]["id"]},
                {data["options"][2]["bookmaker"]["id"]},
                '{data["period"]}'
            )
        """)
        conn.commit()
        # get the result
        
            
        print("done succesfully")
        return jsonify(data)
    elif method == "PUT":
        # update a surebet
        # get the data
        data = request.json
        # save the data
        c.execute(f"""
            UPDATE surebets SET
                code = '{data["info"]["id"]}',
                team1 = '{data["options"][0]["name"]}',
                odd1 = {data["options"][0]["odd"]},
                team2 = '{data["options"][2]["name"]}',
                odd2 = {data["options"][2]["odd"]},
                odd3 = {data["options"][1]["odd"]},
                profit = {data["info"]["profit"]},
                match_time_minutes = {format_str_to_minutes(data["info"]["time"])},
                bookmaker_1id = {data["options"][0]["bookmaker"]["id"]},
                bookmaker_2id = {data["options"][1]["bookmaker"]["id"]},
                bookmaker_Drawid = {data["options"][2]["bookmaker"]["id"]},
                period = '{data["period"]}'
                
            WHERE id = {data["id"]}
        """)
        conn.commit()
        data = [request.json]
        data = [
            {columns[i]:surebet[i] for i in range(len(columns))}
            for surebet in data
        ]
        print("done succesfully")
        return jsonify(data)
    elif method == "DELETE":
        # delete a surebet
        # get the data
        data = request.json
        # save the data
        c.execute(f"""
            DELETE FROM surebets
            WHERE id = {data["id"]}
        """)
        conn.commit()
        print("done succesfully")
        return jsonify(data)
# # ------------------------------------------------------------
# if __name__ == '__main__':app.run(debug=True)
if __name__ == '__main__':serve(app, host='0.0.0.0', port=1000)