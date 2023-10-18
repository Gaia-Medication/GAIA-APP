import pandas as pd
import numpy as np
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs

class DataManager :
    def __init__(self, url, filesNames) -> None:
        self.url = url
        self.filesNames = filesNames
    
    def getUrls(self):
        response = requests.get(self.url)
        response = response.text
        soup = BeautifulSoup(response, 'html.parser')
        file_links = []

        # Find all anchor tags with href attributes
        for anchor in soup.find_all('a', href=True):
            file_url = urljoin(self.url, anchor['href'])
            file_links.append(file_url)

        return file_links
    
    def getFiles(self):
        urls = self.getUrls()
        validUrls = [url for url in urls if any(param in url for param in self.filesNames)]
        for url in validUrls:
            response = requests.get(url)
            a = parse_qs(urlparse(url).query)['fichier'][0]
            with open('data/'+a, 'wb') as f:
                f.write(response.content)

    

