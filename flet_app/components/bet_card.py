from flet import *

class Bet_card(UserControl):
    def __init__(self, page, surebet, on_open_surebet):
        super().__init__()
        self.page = page
        self.surebet = surebet  
        self.on_open_surebet = on_open_surebet

        self.title = surebet["options"][0]["name"] + " vs " + surebet["options"][2]["name"]
        self.profit = round(surebet["info"]["profit"],3)

    def open_surebet(self):
        self.on_open_surebet(self.surebet)
        

    def build(self):
        return Card(
            Container(
            Column(
                [
                Text(self.title,size=20),
                FilledButton(f"Profit: {self.profit} %")
                ],
                spacing=10,alignment=alignment.center,horizontal_alignment="center"
            ),
            padding=padding.all(10),
            width=float("inf"),
            on_click=lambda _ : self.open_surebet(),
            ),
        )