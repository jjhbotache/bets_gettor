from bs4 import BeautifulSoup
from .getters import *
from .helper_functions import *
import sqlite3
from .consts import bookmakers, data_folder
import os
from .classes import Option

# Function to get sure bets
def sure_bets(ids_to_also_get=[]):
    info = get_sure_bets(ids_to_also_get)
    return info

# Function to get data from a specific bookmaker
def get_data_from_bookmaker(bookmaker_id=0):
    # if the bookmaker_id is not given, then it will be 0
    # then it will return all the bookmakers
    response = {
        "msg": "no info",
        "bookmaker_id": bookmaker_id,
        "bookmaker_name": bookmakers[bookmaker_id],
    }
    response["response"] = scrape_page(bookmaker_id)[0]
    response["msg"] = f"here is the info from the bookmaker {bookmaker_id}"
    return response

# Function to manage sure bets from the database
def manage_surebet(method_from_function="GET",data_from_function=None):
    print("manage_surebets")
    dir_path = os.path.dirname(__file__)
    
    # Connect to the SQLite database
    conn = sqlite3.connect(os.path.join(dir_path,data_folder,"surebets.db"))
    c = conn.cursor()
    
    # Get the columns of the surebets table
    c.execute("PRAGMA table_info(surebets)")
    columns = c.fetchall()
    columns = [column[1] for column in columns]
    
    # Get the methodz
    method = method_from_function
    print("method:",method)
    
    if method == "GET":
        # Get all the surebets
        c.execute("SELECT * FROM surebets")
        surebets = c.fetchall()
        
        # Create a list of dictionaries with the columns and the values
        surebets = [
            {columns[i]:surebet[i] for i in range(len(columns))}
            for surebet in surebets
        ]
        
        print("done successfully")
        return surebets
    
    elif method == "POST":
        # Save a surebet
        # Get the data
        data = data_from_function
        
        # Save the data to the database
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
        
        print("done successfully")
        return data
    
    elif method == "PUT":
        # Update a surebet
        # Get the data
        data = data_from_function
        
        # Update the data in the database
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
        
        data = [data_from_function]
        data = [
            {columns[i]:surebet[i] for i in range(len(columns))}
            for surebet in data
        ]
        
        print("done successfully")
        return data
    
    elif method == "DELETE":
        # Delete a surebet
        # Get the data
        data = data_from_function
        
        # Delete the data from the database
        c.execute(f"""
            DELETE FROM surebets
            WHERE id = {data["id"]}
        """)
        conn.commit()
        
        print("done successfully")
        return data

# Function to get JavaScript code
def get_js_code(id_bookmaker,name,price):
    return Option.get_js_code(
        id_bookmaker,
        name,
        price
    )[0]
