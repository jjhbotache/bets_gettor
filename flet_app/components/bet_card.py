from flet import *

class Bet_card(UserControl):
    def __init__(self, page, title, profit):
        super().__init__()
        self.page = page
        self.title = title
        self.profit = profit

    def build(self):
        return Card(Container(
            Column([
                Text(self.title,size=20),
                FilledButton(f"Profit: {self.profit} %")
            ],
              spacing=10,alignment=alignment.center,horizontal_alignment="center"),
            padding=padding.all(10),
            width=float("inf"),
        ))