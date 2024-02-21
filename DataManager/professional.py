import pandas as pd
from dataManager import DataManager
import datetime
import time
import os

BOLD = '\033[1m' # ACTIONS
BLUE = '\033[94m' # ACTIONS
RESET = '\033[0m'
RED = '\033[91m' # ERRORS
GREEN = '\033[92m' # SUCCESS
YELLOW = '\033[93m' # INFORMATIONS

def get_file():
    date=datetime.datetime.now().strftime("%Y%m%d")
    for hour in range(0,24):
        for minute in range(0,60):
            try:
                name=date+str(hour).zfill(2)+str(minute).zfill(2)
                url="https://annuaire.sante.fr/web/site-pro/extractions-publiques?p_p_id=abonnementportlet_WAR_Inscriptionportlet_INSTANCE_gGMT6fhOPMYV&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&_abonnementportlet_WAR_Inscriptionportlet_INSTANCE_gGMT6fhOPMYV_nomFichier=PS_LibreAcces_"+name+".zip"
                start_time=time.time()
                dataManager = DataManager(url)
                dataManager.getMedicFile()
                end_time=time.time()
                if(end_time-start_time>5):
                    return
            except:
                print(RED,"error",name,RESET)
            

#get_file()
file_name = ""
for f in os.listdir('data'):
    if f.startswith('PS_LibreAcces_Personne_activite'):
        file_name =f
        break


dfPersonel = pd.read_csv("./data/"+file_name, sep="|", header=0,low_memory=False, encoding="latin1")

dfPersonel = dfPersonel[dfPersonel["Code profession"] == 10]
dfPersonel = dfPersonel.iloc[:, [ 1, 7, 8, 16 ,28, 31,32, 35 ,37 ,45 , 40 ,43]]
dfPersonel=dfPersonel.sort_values(by='Identifiant PP')

columns_to_drop=dfPersonel.columns[[2,3,4,5,6,8,9]]
dfPersonel=dfPersonel.drop(columns_to_drop, axis='columns')



datas=dfPersonel.astype(str)

def critere_de_tri(element):
    poids_code_postal = 0 if pd.notnull(element['Code postal (coord. structure)']) else 1
    poids_telephone = 0 if pd.notnull(element['TÃ©lÃ©phone (coord. structure)']) else 1
    poids_email = 0 if pd.notnull(element['Adresse e-mail (coord. structure)']) else 1
    return (poids_code_postal, poids_telephone, poids_email)

returned_list=[]
listPP=[]
for _, row in dfPersonel.iterrows():
    if listPP==[] or row.iloc[0]==listPP[0][0]:
        listPP.append(row)
    else:
        listPP_triee = sorted(listPP, key=critere_de_tri)
        returned_list.append(listPP_triee[0])
        listPP=[row]
dfPersonel = pd.DataFrame(returned_list, columns=datas.columns)

# dfPersonel.to_json('out/personnel.json', orient="records", indent=4)
dfPersonel.to_csv('out/personnel.csv', index=False)
dfPersonel.to_json('out/personnel.json', orient='records')
