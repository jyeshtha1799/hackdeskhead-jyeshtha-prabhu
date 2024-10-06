import requests
from bs4 import BeautifulSoup

def scrape_economic_calendar():
    # URL of the economic calendar
    url = 'https://www.fxstreet.com/economic-calendar'

    # Send a GET request
    response = requests.get(url)

    soup = BeautifulSoup(response.content, 'html.parser')

    # Parse the data (adjust selectors based on actual page structure)
    events = soup.find_all('h3', class_='fxs_entryHeadline')

    event_list = []
    for event in events:
        event_name = event.get_text(strip=True)
        event_link = event.find('a')['href']
        event_list.append({'event_name': event_name, 'event_link': event_link})

    return event_list
# Call the function
print(scrape_economic_calendar())