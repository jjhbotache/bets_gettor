from flet import *
from pages.main_page import Main_page
from os import system


def main(page: Page):
    system("cls")
    print(("\n"*10))
        
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
        print(page.views[0])
        page.update()

    page.auto_scroll = True
    page.title = "Bets_gettor"
    # page.window_full_screen = True
    # page.window_resizable = False
    page.on_route_change = on_route_change
    page.go("/")


app(
    target=main,
    # route_url_strategy="hash",
)
