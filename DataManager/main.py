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

BOLD = '\033[1m' # ACTIONS
BLUE = '\033[94m' # ACTIONS
RESET = '\033[0m'
RED = '\033[91m' # ERRORS
GREEN = '\033[92m' # SUCCESS
YELLOW = '\033[93m' # INFORMATIONS

# INITIALISATION
dataManager = DataManager(url, params)

files = dataManager.getFiles()

from utils import is_convertible_to_number, has_number, replace_accents, lecture_base, create_regex_from_dictionnary

date=[
    ['data/CIS_InfoImportantes.txt'],
    [[1,3]],
    ["y-m-d"]
]


dictionnary={
    "second_product":["plaquette","kit","dose","comprimé","gélule","pastille","lyophilisat","sachetspolyterephtalate","capsule","suppositoire","distributeur journalier","conditionnement","bande","poudre","générateur","flacon","tube","applicateur","ampoule","pilulier","sachet","pot","seringue","stylo","spray","bouteille","récipient","film","boite","boite","poche","inhalateur","cartouche","evaporateur","dispositif","enveloppe","fut","sac"],
    "product":['plaquette', 'tube', 'recipient', 'flacon', 'ampoule',"sachetspolyterephtalate", 'pilulier', 'sachet', 'dose', 'seringue', 'bouteille', 'pot', 'film', 'evaporateur', 'poche', 'stylo',"applicateur", 'generateur', 'inhalateur', 'dispositif','enveloppe', 'sac', 'conditionnement', 'bande', 'comprime', 'poudre','kit', 'gelule', 'boite', 'cartouche', 'fut'],
    "quantity":["l","ml","mg","g","litre","ui","u"]
}
dictionnary=create_regex_from_dictionnary(dictionnary)




def date_format(date): #return the date format et l'implémenter dans le dataframe
    for i in range(len(date[0])):
        data=pd.read_csv(date[0][i], sep="\t", header=None, encoding="latin1").iloc[:,date[1][i][0]:date[1][i][1]]
        print("Colone 1  :   \n",data.iloc[:,0].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))
        print("Colone 2  :   \n",data.iloc[:,1].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))


brut_data = lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3].values[:,0]
string_data = brut_data.astype(str)
all_desciption = np.char.split(string_data) # split les strings en array de string

all_dict=[]
P_error=0
P=0
SP=0
Q=0
P_SP=0
P_Q=0
P_SP_Q=0
index=0
for description in string_data:
    
    return_dict = {
        "product":[],
        "second_product":[],
        "quantity":[],
        "description":[description]
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
    
    all_dict.append(return_dict)

    if len(product)==1 and len(second_product)==0 and len(quantity)==0:
        P+=1
    elif len(product)==1 and len(second_product)==1 and len(quantity)==0:
        P_SP+=1
    elif len(product)==1 and len(second_product)==0 and len(quantity)==1:
        P_Q+=1
    elif len(product)==1 and len(second_product)==1 and len(quantity)==1:
        P_SP_Q+=1
    elif len(product)==0 and len(second_product)==1 and len(quantity)==0:
        print(RED,"ERROR product :", description,"\n",RESET)
    elif len(product)>1:
        P_error+=1
    index+=1


print(len(all_dict))
print(GREEN,"Produit seul : ",P,"\nProduit + Second produit : ",P_SP,"\nProduit + Quantité : ",P_Q,"\nProduit + Second produit + Quantité : ",P_SP_Q,"\nProduit error : ",P_error,"\n",RESET)







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





########################################################################################
########################################################################################
############################  CREATION DES DATAFRAMES  #################################
########################################################################################
########################################################################################

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
#print(dfInformation.shape)
# Group the DataFrame by 'Category'



#print(dfInformation)


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
    'Warning' #11 
    #'Important_informations', 
]
dfMedication["Description"] = string_data
# dfMedication["Product"]=
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

#print(dfMedication.sort_values(by=['CIS']))
jsonMedication = dfMedication.to_json('out/medication.json', orient="records")
#print(jsonMedication)