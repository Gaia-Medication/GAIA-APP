from dataManager import DataManager
import pandas as pd
import numpy as np
from text_to_num import text2num
import re

# DATA
url = 'https://base-donnees-publique.medicaments.gouv.fr/telechargement.php'
params = np.array([
    'CIS_CIP_bdpm',
    'CIS_COMPO_bdpm',
    'CIS_bdpm',
    'CIS_InfoImportantes',
    'CIS_CIP_Dispo_Spec',
    'CIS_GENER_bdpm',
    'CIS_CPD_bdpm',
    'HAS_LiensPageCT_bdpm'
])

# INITIALISATION
dataManager = DataManager(url, params)

#files = dataManager.getFiles()

from utils import is_convertible_to_number, has_number, replace_accents, lecture_base, create_regex_from_dictionnary

date=[
    ['data/CIS_InfoImportantes.txt'],
    [[1,3]],
    ["y-m-d"]
]


dictionnary={
    "product":["plaquette","kit","comprimé","gélule","dose","pastille","lyophilisat","capsule","conditionnement","bande","poudre","générateur","distributeur","flacon","tube","ampoule","pilulier","sachet","pot","seringue","stylo","spray","bouteille","récipient","film","boite","boite","poche","inhalateur","cartouche","evaporateur","dispositif","enveloppe","applicateur","sac"],
    "quantity":["l","ml","mg","g","litre"],
    "material":['pvdc','aluminium','pvc','polyamide','polyéthylène','papier','thermoformée',"verre","acier","polypropylène"]
}
dictionnary=create_regex_from_dictionnary(dictionnary)

def missing_value_count():
    tab_ms_values =""
    for i in params:
        table=lecture_base("data/"+i+".txt")
        missing_values=table.isnull().values
        
        tab_ms_values+=f"{i} : {np.sum(missing_values, axis=0)} \n \n"
    return tab_ms_values




# for i in range(len(date[0])):
#     data=pd.read_csv(date[0][i], sep="\t", header=None, encoding="latin1").iloc[:,date[1][i][0]:date[1][i][1]]
#     print("Colone 1  :   \n",data.iloc[:,0].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))
#     print("Colone 2  :   \n",data.iloc[:,1].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))


brut_data = lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3].values[:,0]
string_data = brut_data.astype(str)
all_desciption = np.char.split(string_data) # split les strings en array de string


liste=[]
n=0
for description in string_data:
    #print(description)
    product=[]
    quantity=[]
    material=[]
    description=description.lower()
    description=replace_accents(description)
    for category, regex in dictionnary.items():
        for reg in regex:
            if re.search(reg,description):
                word=re.search(reg,description).group()
                if category=="product":
                    product.append(word)
                if category=="quantity":
                    quantity.append(word)
                if category=="material":
                    material.append(word)

                #print(product,quantity) 
    if len(quantity)==0:
        n+=1
        print(n,"ERROR quantity :", description)
    if len(product)==0 and len(quantity)==0 :
        print("ERROR product :", description)






########################################################################################
########################################################################################
################################## ANALYSE DES DONNEES #################################
########################################################################################
########################################################################################

# Créer une liste de longueurs et une liste d'occurences
liste_occ = {"longueur":[],"occurence":[]}
for description in all_desciption:    
    if len(description) not in liste_occ["longueur"]:
        liste_occ["longueur"].append(len(description))
        liste_occ["occurence"].append(1)
    elif len(description) in liste_occ["longueur"]:
        for i in range(0,len(liste_occ["longueur"])-1):
            if liste_occ["longueur"][i] == len(description):
                liste_occ["occurence"][i]+=1


# Regrouper les longueurs et occurrences ensemble
grouped_data = list(zip(liste_occ["longueur"], liste_occ["occurence"]))

# Trier en fonction des occurrences
sorted_data = sorted(grouped_data, key=lambda x: x[1], reverse=True)

# Afficher les longueurs triées en fonction des occurrences
sorted_longueurs = [x[0] for x in sorted_data]
sorted_occ=[x[1] for x in sorted_data]
#print("Longueurs : \n",sorted_longueurs,"\n Occurences : \n",sorted_occ)