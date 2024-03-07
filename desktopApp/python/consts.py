import os

data_folder = "data"

# import a js file and get it as a string
def import_js_file(file_name):
    file = open(os.path.join(os.path.dirname(__file__),data_folder,"js_codes",file_name),"r")
    code = file.read()
    file.close()
    return str(code)

JS_CODES = [
    {
        "bm_id":0,
        "code": import_js_file("wPlayCode.js"),
    },
    {
        "bm_id":1,
        "code": import_js_file("betPlayCode.js"),
    },
    {
        "bm_id":2,
        "code": import_js_file("codereCode.js"),
    },
]



MAX_RAM_MEMORY = 1024 #in mb 

bookmakers = [
    {
        "id":0,
        "name":"wplay",
        "icon":"https://static.wplay.co/apuestas/web_static/R_MultiOp_4_49_1/desktop/wplay/image/icon.png"
    },
    {
        "id":1,
        "name":"betplay",
        "icon":"https://betplay.com.co/favicon.ico?v=1.1.0"
    },
    {
        "id":2,
        "name":"codere",
        "icon":"https://m.codere.com.co/deportescolombia/apple-touch-icon-120x120.png"
    }
]
