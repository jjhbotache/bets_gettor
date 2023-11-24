from python.classes import *
import clipboard
from plyer import notification
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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
  
def send_mail(title="hi",body="hi"):
  # Configuración 
  smtp_server = 'smtp.gmail.com'
  smtp_port = 587
  smtp_username = 'sapohpta4@gmail.com'
  smtp_password = 'nkog fltn qifl gofn'

  # Crear un objeto SMTP
  smtp = smtplib.SMTP(smtp_server, smtp_port)
  smtp.starttls()
  smtp.login(smtp_username, smtp_password)

  # Componer el correo
  message = MIMEMultipart()
  message['From'] = smtp_username
  message['To'] = 'jjhuertasbotache@gmail.com'
  message['Subject'] = title
  message.attach(MIMEText(body, 'plain'))

  # Enviar el correo
  smtp.sendmail(smtp_username, message['To'], message.as_string())

  # Cerrar la conexión SMTP
  smtp.quit()
  