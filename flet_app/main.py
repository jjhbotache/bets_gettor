from flet import *
from pages.main_page import Main_page


def main(page: Page):
    def on_route_change(route):
        page.views.clear()
        if page.route == "/":
            page.views.append(
                View(
                    "/",
                    [
                          Main_page(page)  
                    ]
                )
            )
        print(page.views)
        page.update()
            


    page.auto_scroll = True
    page.title = "Bets_gettor"
    page.window_full_screen = True
    page.window_resizable = False
    page.on_route_change = on_route_change

    page.go("/")


app(main)
