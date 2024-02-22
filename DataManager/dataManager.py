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
RESET = '\033[0m'
GREEN = '\033[92m' # SUCCESS
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

    def getTherapeutics(self, cis):
        response = None
        try:
            response = requests.get(self.url + cis)
        except Exception as e:
            print(f"An error occurred: {e}")

        response = response.text
        soup = BeautifulSoup(response, 'html.parser')

        # Find all anchor tags with href attributes
        for title2 in soup.find_all('h2'):
            if title2.text == "Indications thérapeutiques":
               print(f"{BOLD}{GREEN}Indications thérapeutiques de {cis} trouvées{RESET}")
               return title2.next_sibling.next_sibling.text
            
    def getATC(self, name, cis):
        response = None
        try:
            response = requests.get(self.url + name + "--" + cis)
        except Exception as e:
            print(f"An error occurred: {e}")

        response = response.text
        soup = BeautifulSoup(response, 'html.parser')

        # Find all anchor tags with href attributes
        for title4 in soup.find_all('h4'):
            if title4.text == "Carte d'identité du médicament":
               #print(title4.next_sibling.contents)
               for sibling in title4.next_sibling.contents:
                     if sibling.name == "p":
                          if "ATC" in sibling.text:
                            content = sibling.text.split(" ")
                            for i in range(len(content)):
                                if content[i] == "ATC":
                                    print(f"{BOLD}{GREEN}ATC de {name} est : {content[i+2]}{RESET}", sibling.text)
                                    return(content[i+2])

    

