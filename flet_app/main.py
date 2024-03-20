from flet import *
from pages.main_page import Main_page
from pages.settings import Settings
from pages.execute_manager import Execute_manager
from os import system


bots={
    "selenium": None,
    "manual": None,
}

def main(page: Page):
    system("cls")
    print(("\n"*10))
        
    def on_route_change(route):
        if page.route == "/":
            if len(page.views) == 1:
                page.views.clear()
                page.views.append(View("/", [Main_page(page)]))
            else:
                page.views.pop()
        elif page.route == "/settings":
            page.views.clear()
            page.views.append(
                View(
                    "/settings",
                    [
                        Settings(page)
                        
                    ]
                )
            )
        elif page.route == "/execute_manager":
            page.views.append(
                View(
                    "/execute_manager",
                    [
                        Execute_manager(page)
                    ]
                )
            )
            
            
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
