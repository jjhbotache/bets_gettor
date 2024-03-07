from flet import *

class Bet_viewer(UserControl):
    def __init__(self, page,bet:dict={}):
        super().__init__()
        self.page = page
        self.bet = bet

    def build(self):
        return Container(Column([
         Row([Text("Bet Amount"),TextField("0.00",height=32)]),   
         Text("Bet title",size=40),
         Text("xx segs"),

         Divider(color=colors.BLUE_ACCENT),

         ResponsiveRow([
            Text("xx:xx",col=4),
            ElevatedButton("profit",col=4),
            Container(col=4),
         ],width=float("inf")),   

         Divider(color=colors.BLUE_ACCENT),

         Column([
            ResponsiveRow([
                Text("Team",col=5,size=20),
                Text("odd",col=3,size=20),
                Text("BM",col=2,size=20),
                Text("Code",col=2,size=20),
            ]),
            ResponsiveRow([
                Text("Team1",col=5),
                Text("12",col=3),
                IconButton(icons.DELETE,col=2),
                IconButton(icons.CODE,col=2),
            ],vertical_alignment=CrossAxisAlignment.CENTER),
            ResponsiveRow([
                Text("draw",col=5),
                Text("2",col=3),
                IconButton(icons.DELETE,col=2),
                IconButton(icons.CODE,col=2),
            ],vertical_alignment=CrossAxisAlignment.CENTER),
            ResponsiveRow([
                Text("Team2",col=5),
                Text("0.1",col=3),
                IconButton(icons.DELETE,col=2),
                IconButton(icons.CODE,col=2),
            ],vertical_alignment=CrossAxisAlignment.CENTER),
         ],width=float("inf"),spacing=1,),
         
         Divider(color=colors.BLUE_ACCENT),

         Text("Bets info",size=20),
         Column([
             ResponsiveRow([
                 Column([
                    IconButton(icons.GAMEPAD),
                    Text("000"),
                 ],col=4,horizontal_alignment=CrossAxisAlignment.CENTER),
                 Text("➡️",col=4),
                 Text("0000",col=4),
             ],vertical_alignment=CrossAxisAlignment.CENTER,alignment=alignment.center),
             ResponsiveRow([
                 Column([
                    IconButton(icons.GAMEPAD),
                    Text("000"),
                 ],col=4,horizontal_alignment=CrossAxisAlignment.CENTER),
                 Text("➡️",col=4),
                 Text("0000",col=4),
             ],vertical_alignment=CrossAxisAlignment.CENTER,alignment=alignment.center),
             ResponsiveRow([
                 Column([
                    IconButton(icons.GAMEPAD),
                    Text("000"),
                 ],col=4,horizontal_alignment=CrossAxisAlignment.CENTER),
                 Text("➡️",col=4),
                 Text("0000",col=4),
             ],vertical_alignment=CrossAxisAlignment.CENTER,alignment=alignment.center),
         ],spacing=1,),
          
         Divider(color=colors.BLUE_ACCENT),

         Text("Total Bet: 0000",size=20), 
         Text("Total Profit: 0000",size=20), 
        ],
        expand=1,
        horizontal_alignment=CrossAxisAlignment.CENTER,
        width=float("inf"),
        spacing=1,
        ),
        height=self.page.height,
        bgcolor=colors.GREEN_900,
        padding=padding.all(10),
        )