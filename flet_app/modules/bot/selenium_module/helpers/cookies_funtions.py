import json

# Asumiendo que 'driver' es tu instancia de webdriver

def get_cookies_from_url(urls:list):
  total_cookie = {}
  for url in urls:
    with open(url, 'r') as f:
        cookies = json.load(f)
        for cookie in cookies:
          total_cookie = {**total_cookie, **cookie}
  return total_cookie
      
  