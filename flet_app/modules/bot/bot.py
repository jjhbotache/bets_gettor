import pywinauto
import pyautogui
import pyperclip
from time import sleep

def get_open_windows():
    # Obtiene una lista de todas las ventanas abiertas
    windows = pywinauto.Desktop().windows()
    # filter out the windows without titles and those that are not visible
    windows = [window for window in windows if window.window_text() and window.is_visible()]
    return windows

def display_windows(windows):
    # Muestra una lista de las ventanas al usuario
    print("list of windows:")
    for i, ventana in enumerate(windows):
        print(f"{i + 1}) {ventana.window_text()}")

def user_select_window(windows):
    # Pide al usuario que elija una ventana
    indice_ventana = int(input("Elige una ventana (introduce el número): "))
    return windows[indice_ventana - 1]

def focus_window(window):
    # Activa la ventana
    window.SetFocus()
    print(f"Se ha cambiado a la ventana '{window.window_text()}'.")
    
def main():
    windows = get_open_windows()
    # filter the windows by the one that contains wplay
    windows = [window for window in windows if 'wplay' in window.window_text().lower()]
    display_windows(windows)
    if len(windows) == 0:
        print("No se encontró ninguna ventana de wplay.")
        return
    elif len(windows) == 1:
        chosen_window = windows[0]
    else:
        chosen_window = user_select_window(windows)
        
    focus_window(chosen_window)
    pyautogui.press("f12")
    # paste text
    sleep(2)
    with open('login_wplay_js_script.js', 'r') as file:
        data = file.read()
        data = data.replace('USERNAME', 'jjhuertasbotache@gmail.com')
        data = data.replace('PASSWORD', 'J1234567890j')
        pyperclip.copy(data)
        pyautogui.hotkey('ctrl', 'v')
        pyautogui.press('enter')
    sleep(4)
    pyautogui.press("f12")

if __name__ == "__main__":
    main()