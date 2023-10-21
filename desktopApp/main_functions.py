from python.classes import *
import time
import pyautogui as pya
import pyperclip as pypc
from plyer import notification
import csv

def create_notification(titulo,mensaje,duracion=2):
  titulo = str(titulo)
  mensaje = str(mensaje)
  notification.notify(
    title=titulo,
    message=mensaje,
    timeout=duracion
  )
  
def copy_to_clipboard(text=""):
  text = str(text)
  # create_notificati on("Copied to clipboard",text)
  pypc.copy(text)
  
  
