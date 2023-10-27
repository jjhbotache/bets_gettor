from python.classes import *
import clipboard
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
    
  try:
    print("copied to clipboard:",text)
    text = str(text)
    create_notification("Copied to clipboard",text[:256]) if notification else None
    # pypc.copy(text)
    clipboard.copy(text)
  except Exception as e:
    print(e)
    print(traceback.format_exc())
  
  
