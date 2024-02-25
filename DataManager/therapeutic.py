from dataManager import DataManager
import pandas as pd
from utils import lecture_base
import json
import os
'''
class Therapeutic():
    
    def getTherapeuticDatas(self, url, listOfCis):
        dm = DataManager(url)
        list_of_th = []
        for cis in listOfCis:
            list_of_th.append(dm.getTherapeutics(cis))
        return list_of_th

    def getATCDatas(self, url, listOfCis, listOfNames):
        dm = DataManager(url)
        list_of_atc = []
        for i in range(len(listOfCis)):
            try:
                list_of_atc.append(dm.getATC(listOfNames[i], listOfCis[i]))
            except Exception as e:
                print(f"An error occurred: {e} {listOfNames[i]} {listOfCis[i]}")
        return list_of_atc

'''

urlTherapeutic = 'https://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid='
urlAtc = "https://observatoiredumedicament.cyrilcoquilleau.com/medicament/"

dfATC = pd.DataFrame(columns=["CIS","ATC","Indications_therapeutiques"])

cis=lecture_base("data/CIS_bdpm.txt").iloc[:,0:1]
name=lecture_base("data/CIS_bdpm.txt").iloc[:,1:2]


file_path = 'out/atc.json'

if not os.path.exists(file_path):
    dfATC["CIS"]=cis
    dfATC["name"]=name
    atc_list = [None] * len(cis)
    indications_therapeutiques_list = [None] * len(cis)
    dfATC["ATC"] = atc_list
    dfATC["Indications_therapeutiques"] = indications_therapeutiques_list
    dfATC.to_json('out/atc.json', orient="records", indent=4)
    
    
with open('out/atc.json', 'r') as file:
    data = json.load(file)

dfATC = pd.DataFrame(data)
    
dmTH=DataManager(urlTherapeutic)
dmATC=DataManager(urlAtc)
for row in data:
    if row.get("CIS") not in dfATC["CIS"].values:
        dfATC = dfATC.append(row, ignore_index=True)
    if  row.get("ATC") is None:
        print("Null ATC", row["name"], row["CIS"])
        cis_data = row.get("CIS")
        r=dfATC[dfATC["CIS"]==cis_data]
        i=r.index[0]
        dfATC.loc[i,"ATC"]=dmATC.getATC(row["name"], row["CIS"])
    if row.get("Indications_therapeutiques") is None:
        print("Null therapeutic")
        cis_data = row.get("CIS")
        r=dfATC[dfATC["CIS"]==cis_data]
        i=r.index[0]
        dfATC.loc[i,"Indications_therapeutiques"]=dmTH.getTherapeutics(row["CIS"])
        

dfATC.to_json('out/atc.json', orient="records", indent=4)

print("End of the process therapeutic.py")