import pandas as pd
import numpy as np
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs
from tqdm import tqdm
import zipfile
import os


BOLD = '\033[1m' # ACTIONS
BLUE = '\033[94m' # ACTIONS
class DataManager :
    def __init__(self, url, filesNames=None) -> None:
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
    
    def getPharmacyFile(self):
        try:
            response = requests.get(self.url)
        except Exception as e:
            print(f"An error occurred: {e}")

        with open('data/pharmacies.csv', 'wb') as f:
            f.write(response.content)
        return True
    
    def getMedicFile(self):
        try:
            response = requests.get(self.url)
        except Exception as e:
            print(f"An error occurred: {e}")
            
        with open('data/medic.zip', 'wb') as f:
            f.write(response.content)

        chemin_archive_zip = 'data/medic.zip'
        chemin_destination = 'data'
        with zipfile.ZipFile(chemin_archive_zip, 'r') as zip_ref:
            zip_ref.extractall(chemin_destination)
        print("L'archive a été décompressée.")
        
        chemin_dossier = 'data'
        for nom in os.listdir(chemin_dossier):
            chemin_complet = os.path.join(chemin_dossier, nom)
            if os.path.isfile(chemin_complet):
                if nom.startswith('PS_LibreAcces_Dipl_AutExerc') or nom.startswith("PS_LibreAcces_SavoirFaire") or nom.endswith('.zip'):
                    os.remove(chemin_complet)
        return True
    
    def getFiles(self):
        urls = self.getUrls()
        validUrls = [url for url in urls if any(param in url for param in self.filesNames)]
        progress_bar = tqdm(total=len(validUrls), desc=f"{BOLD}{BLUE}Écriture des fichiers")
        for url in validUrls:
            try:
                response = requests.get(url)
            except Exception as e:
                print(f"An error occurred: {e}")

            a = parse_qs(urlparse(url).query)['fichier'][0]
            with open('data/'+a, 'wb') as f:
                f.write(response.content)
            progress_bar.update(1)

    

