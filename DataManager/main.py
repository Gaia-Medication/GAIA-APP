from dataManager import DataManager
import pandas as pd
import numpy as np
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

BOLD = '\033[1m' # ACTIONS
BLUE = '\033[94m' # ACTIONS
RESET = '\033[0m'
RED = '\033[91m' # ERRORS
GREEN = '\033[92m' # SUCCESS
YELLOW = '\033[93m' # INFORMATIONS

# INITIALISATION
dataManager = DataManager(url, params)

#files = dataManager.getFiles()

from utils import has_number, replace_accents, lecture_base, create_regex_from_dictionnary

date=[
    ['data/CIS_InfoImportantes.txt'],
    [[1,3]],
    ["y-m-d"]
]


dictionnary={
    "second_product":["plaquette","kit","dose","comprimé","gomme","gélule","pastille","lyophilisat","sachetspolyterephtalate","capsule","suppositoire","distributeur journalier","conditionnement","bande","poudre","générateur","flacon","tube","applicateur","ampoule","pilulier","sachet","pot","seringue","stylo","spray","bouteille","récipient","film","boite","boite","poche","inhalateur","cartouche","evaporateur","dispositif","enveloppe","fut","sac"],
    "product":['plaquette', 'tube','éponge', 'recipient', 'flacon', 'ampoule',"sachetspolyterephtalate", 'pilulier', 'sachet', 'dose', 'seringue', 'bouteille', 'pot', 'film', 'evaporateur', 'poche', 'stylo',"applicateur", 'generateur', 'inhalateur', 'dispositif','enveloppe', 'sac', 'conditionnement', 'bande', 'comprime', 'poudre','kit', 'gelule', 'boite', 'cartouche', 'fut'],
    "quantity":["l","ml","mg","g","litre","ui","u"]
}
dictionnary=create_regex_from_dictionnary(dictionnary)


brut_data = lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3].values[:,0]
string_data = brut_data.astype(str)

compo=lecture_base("data/CIS_COMPO_bdpm.txt")
compo.columns=["CIS","type","IDPA","Principe actif","Dosage", "Quantité","SA/FT","ID SA/FT","?"]
compo=compo.drop(columns=["IDPA","?"])
compostr=compo.astype(str)

print(BOLD,YELLOW,"\n\n##########################################################\n############### Création des dictionnaires ###############\n##########################################################",RESET,'\n\n')

all_compo=[]
return_compo={
    "CIS":[],
    "type":[],
    "Principe actif":[],
    "Dosage":[],
    "Quantité":[],
    "SA/FT":[],
    "ID SA/FT":[],
}
for row in range(compostr.shape[0]-1):
    cis=compostr['CIS'][row]
    id_sa_ft=compostr['ID SA/FT'][row]
    if return_compo["CIS"]==[]:
        return_compo["CIS"]=cis
        return_compo["type"].append(compostr['type'][row])
        return_compo["Principe actif"].append(compostr['Principe actif'][row])
        return_compo["Dosage"].append(compostr['Dosage'][row])
        return_compo["Quantité"].append(compostr['Quantité'][row])
        return_compo["SA/FT"].append(compostr['SA/FT'][row])
        return_compo["ID SA/FT"].append(id_sa_ft)
    
    if cis==return_compo["CIS"] and id_sa_ft in return_compo["ID SA/FT"] : # tous les id sont split mais SA et FT parfois split
        return_compo["type"].append(compostr['type'][row])
        return_compo["Principe actif"].append(compostr['Principe actif'][row])
        return_compo["Dosage"].append(compostr['Dosage'][row])
        return_compo["Quantité"].append(compostr['Quantité'][row])
        return_compo["SA/FT"].append(compostr['SA/FT'][row])
        return_compo["ID SA/FT"].append(id_sa_ft)
    # for r in range(len(all_compo)-1):
    #     if cis==all_compo[r]["CIS"]:
    #         if id_sa_ft in all_compo[r]["ID SA/FT"]:
    #             if len(all_compo[r]["SA/FT"])==1 and (compostr["SA/FT"][row]=="FT"and "SA" in all_compo[r]["SA/FT"])or (compostr["SA/FT"][row]=="SA" and "FT" in all_compo[r]["SA/FT"]):
    #         #if (id_sa_ft in all_compo[r]["ID SA/FT"]) and ((all_compo[r]["SA/FT"]=="SA" and compostr["SA/FT"][row]=="FT")or(all_compo[r]["SA/FT"]=="FT" and compostr["SA/FT"][row]=="SA")):
    #                 print(all_compo[r]["SA/FT"],compostr["SA/FT"][row],"\n")
        
    
    else:
        all_compo.append(return_compo)
        return_compo={
            "CIS":[],
            "type":[],
            "Principe actif":[],
            "Dosage":[],
            "Quantité":[],
            "SA/FT":[],
            "ID SA/FT":[],
        }
        return_compo["CIS"]=cis
        return_compo["type"].append(compostr['type'][row])
        return_compo["Principe actif"].append(compostr['Principe actif'][row])
        return_compo["Dosage"].append(compostr['Dosage'][row])
        return_compo["Quantité"].append(compostr['Quantité'][row])
        return_compo["SA/FT"].append(compostr['SA/FT'][row])
        return_compo["ID SA/FT"].append(id_sa_ft)
        



all_dict=[]
for description in string_data:
    
    return_dict = {
        "product":[],
        "second_product":[],
        "quantity":[]
    }
    product = []
    second_product = []
    quantity = []   
    description = description.lower()
    description = replace_accents(description)
    description=description.replace("  "," ")
    description = description.split(" ")
    if has_number(description):
        n = 0
        for w_index in range (0,len(description)-1):
            #print(w_index)
            for category, regex in dictionnary.items():
                for reg in regex:
                    if w_index < len(description)-1:
                        if has_number(description[w_index]) and re.search(reg, description[w_index + 1]):
                            if description[w_index -1]=="de":
                                description[w_index -1] = description[w_index -1] + " " + description[w_index] + " " + description[w_index + 1]
                                description.pop(w_index+1)
                                description.pop(w_index)
                            else:                                    
                                description[w_index] = description[w_index] + " " + description[w_index + 1]
                                description.pop(w_index + 1)
                            break
    
    for word in description:
        for category, regex in dictionnary.items():
            for reg in regex:
                if re.search(reg,word):
                    w=re.search(reg,word).group()
                    if category=="product" and return_dict["product"]==[]:
                        return_dict["product"].append(w)
                    if category=="quantity":
                        return_dict["quantity"].append(w)
                    if category=="second_product":
                        return_dict["second_product"].append(w)
    #print(GREEN,index,product,second_product,quantity,"\n",description,"\n",RESET)
    # for i in return_dict["product"]:    
    #     if has_number(i)==False and return_dict["second_product"]==[] and return_dict["quantity"]==[]:
    #         print(RED,description)
    #kit join then regex 
    #conditionnement
    all_dict.append(return_dict)
    


########################################################################################
########################################################################################
############################  CREATION DES DATAFRAMES  #################################
########################################################################################
########################################################################################

print(BOLD,YELLOW,"\n\n##########################################################\n################# Création des dataframes ################\n##########################################################",RESET,'\n\n')


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

dfGener = pd.read_csv("data/CIS_GENER_bdpm.txt", sep="\t", header=None, encoding="latin1")
dfGener = dfGener.drop([0], axis=1)
dfGener = dfGener.drop([3], axis=1)
dfGener = dfGener.drop([4], axis=1)
dfGener = dfGener.drop([5], axis=1) 
dfGener.columns = [
    'Generique', #1
    'CIS', #2
]

dfCompo=pd.DataFrame(all_compo)
dfCompo=dfCompo.groupby('CIS').apply(group_by_cis)
j = dfCompo.to_json('out/compo.json', orient="records", indent=4)

dfDescription= pd.DataFrame(columns=["CIP","Description"])
dfDescription["CIP"]=lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,1:2]
dfDescription["Quantity"]=all_dict
dfDescription=dfDescription.drop(columns=["Description"])
#print(dfDescription[dfDescription['CIS'] == 68948481])

# ######### PrescriptionConditions
dfPrescription = pd.read_csv("data/CIS_CPD_bdpm.txt", sep="\t", header=None, encoding="latin1")
dfPrescription.columns = [
    'CIS', #0
    'Prescription_conditions', #1
]
dfPrescription = dfPrescription.groupby('CIS')
dfPrescription = dfPrescription['Prescription_conditions'].agg(', '.join)

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
dfDescription.name="Quantity"
dfPresentation=dfPresentation.merge(dfDescription, on='CIP', how='inner')
# print(dfPresentation.iloc[0,6:])
dfPresentation = dfPresentation.sort_values(by=['CIS'])
actCIS = dfPresentation.iloc[0,0]

dfPresentation = dfPresentation.groupby('CIS').apply(group_by_cis)

dfPresentation = pd.DataFrame({'CIS': dfPresentation.index, 'Values': dfPresentation.values}) 

# Reset the index if needed
dfPresentation.reset_index(drop=True, inplace=True)
        
# print(dfPresentation)

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
    'Warning' #11 
    #'Important_informations', 
]

dfInformation = dfInformation[dfInformation['CIS'].isin(dfMedication['CIS'])]
dfInformation = dfInformation.groupby('CIS').apply(group_by_cis)
dfInformation = pd.DataFrame({'CIS': dfInformation.index, 'infos': dfInformation.values})

dfInformation.reset_index(drop=True, inplace=True)


dfMedication = dfMedication.merge(dfGener, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfPrescription, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfInformation, on='CIS', how='outer')
## DEUX ENREGISTREMENTS EN TROP
dfMedication = dfMedication.merge(dfPresentation, on='CIS', how='outer')

print(BOLD,YELLOW,"\n\n##########################################################\n################### Conversion en JSON ###################\n##########################################################",RESET,'\n\n')

jsonMedication = dfMedication.to_json('out/medication.json', orient="records", indent=4)
#print(jsonMedication)