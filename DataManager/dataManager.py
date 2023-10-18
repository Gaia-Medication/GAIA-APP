import pandas as pd
import numpy as np
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs
from tqdm import tqdm

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
        progress_bar = tqdm(total=len(validUrls), desc="Écriture des fichiers")
        for url in validUrls:
            try:
                response = requests.get(url)
            except Exception as e:
                print(f"An error occurred: {e}")

            a = parse_qs(urlparse(url).query)['fichier'][0]
            with open('data/'+a, 'wb') as f:
                f.write(response.content)
            progress_bar.update(1)

    

