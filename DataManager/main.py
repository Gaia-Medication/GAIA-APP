from dataManager import DataManager
import pandas as pd
import numpy as np
from text_to_num import text2num
import re
import spacy
from spacy.matcher import Matcher

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
    "product":["plaquette","kit","comprimé","gélule","dose","pastille","lyophilisat","capsule","suppositoire","conditionnement","bande","poudre","générateur","distributeur","flacon","tube","ampoule","pilulier","sachet","pot","seringue","stylo","spray","bouteille","récipient","film","boite","boite","poche","inhalateur","cartouche","evaporateur","dispositif","enveloppe","applicateur","sac"],
    "quantity":["l","ml","mg","g","litre"],
    "material":['pvdc','aluminium','pvc','polyamide','polyéthylène','papier','thermoformée',"verre","acier","polypropylène"]
}
dictionnary=create_regex_from_dictionnary(dictionnary)

# def missing_value_count():
#     tab_ms_values =""
#     for i in params:
#         table=lecture_base("data/"+i+".txt")
#         missing_values=table.isnull().values
        
#         tab_ms_values+=f"{i} : {np.sum(missing_values, axis=0)} \n \n"
#     return tab_ms_values



def date_format(date): #return the date format et l'implémenter dans le dataframe
    for i in range(len(date[0])):
        data=pd.read_csv(date[0][i], sep="\t", header=None, encoding="latin1").iloc[:,date[1][i][0]:date[1][i][1]]
        print("Colone 1  :   \n",data.iloc[:,0].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))
        print("Colone 2  :   \n",data.iloc[:,1].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))


brut_data = lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3].values[:,0]
string_data = brut_data.astype(str)
all_desciption = np.char.split(string_data) # split les strings en array de string
s=str(string_data)







# #############################################  CREATION DES DATAFRAMES  #############################################

def group_by_cis(group):
    return group.to_dict(orient='records')
# ######### Importantes informations

dfInformation = pd.read_csv("data/CIS_InfoImportantes.txt", sep="\t", header=None, encoding="latin1")
dfInformation.columns = [
    'CIS', #0
    'dateDebut', #1
    'dateFin', #2
    'Important_informations', #1
]
print(dfInformation.shape)
# Group the DataFrame by 'Category'



print(dfInformation)


# ######### PrescriptionConditions
dfPrescription = pd.read_csv("data/CIS_CPD_bdpm.txt", sep="\t", header=None, encoding="latin1")
dfPrescription.columns = [
    'CIS', #0
    'Prescription_conditions', #1
]
# Group the DataFrame by 'Category'
dfPrescription = dfPrescription.groupby('CIS')
# Concatenate the string values in 'Value' for each category
dfPrescription = dfPrescription['Prescription_conditions'].agg(', '.join)
# Display the result
#print(dfPrescription)

# ######### Presentation
dfPresentation = pd.read_csv("data/CIS_CIP_bdpm.txt", sep="\t", header=None, encoding="latin1")
dfPresentation = dfPresentation.drop([3,4,5,6,7,11], axis=1)
dfPresentation.columns = [
    'CIS', #0
    'CIP', #1
    'Denomination', #2
    'Remboursement', #8
    'Price_without_taxes', #9-
    'Price_with_taxes', #10-
    'Infos_remboursement',#12
]
dfPresentation = dfPresentation.sort_values(by=['CIS'])
actCIS = dfPresentation.iloc[0,0]

# Group the DataFrame by 'CIS' and apply the custom function
dfPresentation = dfPresentation.groupby('CIS').apply(group_by_cis)

# Create a new DataFrame from the grouped data
dfPresentation = pd.DataFrame({'CIS': dfPresentation.index, 'Values': dfPresentation.values})

# Reset the index if needed
dfPresentation.reset_index(drop=True, inplace=True)
        
#print(dfPresentation)

# ######### Medication
dfMedication = pd.read_csv("data/CIS_bdpm.txt", sep="\t", header=None, encoding="latin1")
dfMedication = dfMedication.drop([5,7,9,10], axis=1)
dfMedication.columns = [
    'CIS', #0
    'Name', #1
    'Shape', #2
    'Administration_way', #3
    'Authorization',#4
    'Marketed', #6
    'Stock', #8
    'Warning', #11 
    #'Important_informations', 
]

dfInformation = dfInformation[dfInformation['CIS'].isin(dfMedication['CIS'])]

dfInformation = dfInformation.groupby('CIS').apply(group_by_cis)

# Create a new DataFrame from the grouped data
dfInformation = pd.DataFrame({'CIS': dfInformation.index, 'infos': dfInformation.values})

# Reset the index if needed
dfInformation.reset_index(drop=True, inplace=True)



dfMedication = dfMedication.merge(dfPrescription, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfInformation, on='CIS', how='outer')
## DEUX ENREGISTREMENTS EN TROP
dfMedication = dfMedication.merge(dfPresentation, on='CIS', how='outer')

print(dfMedication.sort_values(by=['CIS']))
jsonMedication = dfMedication.to_json(orient="records")
#print(jsonMedication)

# n=0
# for description in string_data:
#     #print(description)
#     product=[]
#     quantity=[]
#     material=[]
#     description=description.lower()
#     description=replace_accents(description)
#     for category, regex in dictionnary.items():
#         for reg in regex:
#             if re.search(reg,description):
#                 word=re.search(reg,description).group()
#                 if category=="product":
#                     product.append(word)
#                 if category=="quantity":
#                     quantity.append(word)
#                 if category=="material":
#                     material.append(word)

                #print(product,quantity) 
    # if len(quantity)==0:
    #     n+=1
    #     print(n,"ERROR quantity :", description)
    # if len(product)==0 and len(quantity)==0 :
    #     print("ERROR product :", description)



# print(string_data[0],string_data[1394])

# nlp = spacy.load("fr_core_news_lg")

# doc = nlp("plaquette(s) PVC PVDC aluminium de 30 comprimé(s) 1 pilulier(s) polypropylène de 30 comprimé(s)")

# # Crée des spans pour "super restaurant" et "bar vraiment sympa"
# span1 = doc[0:7]
# span2 = doc[8:13]

# # Obtiens la similarité entre les spans
# similarity = span1.similarity(span2)
# print(similarity)


# nlp = spacy.load("fr_core_news_sm")
# matcher=Matcher(nlp.vocab)

# doc=nlp(s)
# pattern = [
#     {"LOWER": {"IN": ["plaquette", "tube", "récipient", "flacon"]}},  # Packaging type
#     {"IS_PUNCT": True, "OP": "?"},  # Optional punctuation
#     {"LOWER": {"IN": ["pvc", "polypropylène", "polyéthylène", "aluminium", "pvdc"]}, "OP": "?"},  # Material (optional)
#     {"IS_PUNCT": True, "OP": "?"},  # Optional punctuation
#     {"LIKE_NUM": True},  # Quantity
#     {"LOWER": {"IN": ["comprimé", "ml", "g", "kg"]}}  # Unit
# ]

# matcher.add("PACKAGING_PATTERN", [pattern])
# matches=matcher(doc)
# for match_id, start, end in matches:
#     span=doc[start:end]
#     print(span.text)




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
