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
  
def copy_to_clipboard(text="",notification=True):
  # cut the text to 256 characters
  if len(text)>256:
    print("text too long, cutting it to 256 characters")
    text = text[:256]
    
  print("copied to clipboard:",text)
  text = str(text)
  create_notification("Copied to clipboard",text) if notification else None
  pypc.copy(text)
  
  
