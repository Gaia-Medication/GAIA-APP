import json
from dataManager import DataManager
import pandas as pd
import numpy as np
import re
from utils import has_number, replace_accents, lecture_base, create_regex_from_dictionnary
from export import Export

###################################################################
###################################################################
###########################  UTILS  ###############################
###################################################################
###################################################################


BOLD = '\033[1m' # ACTIONS
BLUE = '\033[94m' # ACTIONS
RESET = '\033[0m'
RED = '\033[91m' # ERRORS
GREEN = '\033[92m' # SUCCESS
YELLOW = '\033[93m' # INFORMATIONS


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

# DOWNLOAD FILES
files = dataManager.getFiles()


########################################################################################
########################################################################################
###########################  CREATION DES DICTIONNAIRES  ###############################
########################################################################################
########################################################################################
print(BOLD,YELLOW,"\n\n##########################################################\n############### Création des dictionnaires ###############\n##########################################################",RESET,'\n\n')


# LOCALISATION DES DATES A CONVERTIR
date=[
    ['data/CIS_InfoImportantes.txt'],
    [[1,3]],
    ["y-m-d"]
]


dictionnary={
    "product":['plaquette', 'tube','éponge', 'recipient', 'flacon', 'ampoule',"sachetspolyterephtalate", 'pilulier', 'sachet', 'dose', 'seringue', 'bouteille', 'pot', 'film', 'evaporateur', 'poche', 'stylo',"applicateur", 'generateur', 'inhalateur', 'dispositif','enveloppe', 'sac', 'conditionnement', 'bande', 'comprime', 'kit', 'gelule', 'boite', 'cartouche', 'fut'],
    "word_wo_um":["plaquette",'eponge',"bâton","gobelet doseur","ovule","kit","dose","comprime","gomme","gelule","pastille","lyophilisat","sachetspolyterephtalate","capsule","suppositoire","distributeur journalier","conditionnement","bande","générateur","flacon","tube","applicateur","ampoule","pilulier","sachet","pot","seringue","stylo","spray","bouteille","récipient","film","boite","boite","poche","inhalateur","cartouche","evaporateur","dispositif","enveloppe","fut","sac"],
    "second_product":[fr"\bl\b",fr"\bml\b",fr"\bmg\b",fr"\bg\b",fr"\bkg\b","litre","litres",fr"\bui\b",fr"\bu\b","plaquette",'eponge',"bâton","gobelet doseur","ovule","kit","dose","comprime","gomme","gelule","pastille","lyophilisat","sachetspolyterephtalate","capsule","suppositoire","distributeur journalier","conditionnement","bande","générateur","flacon","tube","applicateur","ampoule","pilulier","sachet","pot","seringue","stylo","spray","bouteille","récipient","film","boite","boite","poche","inhalateur","cartouche","evaporateur","dispositif","enveloppe","fut","sac"]
}
dictionnary=create_regex_from_dictionnary(dictionnary)
brut_data = lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3].values[:,0]
string_data = brut_data.astype(str)
all_dict=[]
for description in string_data:
    list_str_meds=[]
    low_descript = description.lower()
    no_acc_descript = replace_accents(low_descript)
    no_dbspace_descript=no_acc_descript.replace("  "," ")
    descript = no_dbspace_descript.split(" ")
    if has_number(descript):
        bracket_flag=False
        for w_index in range (0,len(descript)-1):
            if re.search(fr"[0-9]+,", descript[w_index]) and descript[w_index+1].isdigit():
                descript[w_index+1]=re.search(fr"[0-9]+,", descript[w_index]).group()+descript[w_index+1]
                descript[w_index]=""
                descript[w_index+1]=descript[w_index+1].replace(" ","")
                
            for category, regex in dictionnary.items():
                for reg in regex:
                    pflag=False
                    if descript[w_index] !="":
                        if descript[w_index][0]=="(":
                            bracket_flag=True
                        if descript[w_index][-1]==")":
                            bracket_flag=False         
                    if w_index+1<len(descript) and has_number(descript[w_index]) and re.search(reg, descript[w_index+1]) and bracket_flag==False:
                        if "de" in descript[w_index-2]:
                            descript[w_index]=descript[w_index].replace("de","de ")
                            
                    if descript[w_index]=="de" and category=="second_product":
                        if w_index+1<len(descript) and has_number(descript[w_index+1]):
                            number="".join([caractere for caractere in descript[w_index+1] if caractere.isdigit()])
                            if w_index+2<len(descript) and re.search(reg,descript[w_index+2]) and bracket_flag==False:
                                word=re.search(reg,descript[w_index+2]).group()
                                if w_index+3<len(descript) and re.search(fr"(blanc|noir|bleu|rouge|vert|jaune|orange|violet|rose|gris|beige|marron)",descript[w_index+3]):
                                    color=re.search(fr"(blanc|noir|bleu|rouge|vert|jaune|orange|violet|rose|gris|beige|marron)",descript[w_index+3]).group()
                                    descript[w_index]="de "+number+" "+word+" "+color
                                    list_str_meds.append(descript[w_index])
                                    descript[w_index+1]=""
                                    descript[w_index+2]=""
                                    descript[w_index+3]=""
                                else:
                                    descript[w_index]="de "+number+" "+word
                                    list_str_meds.append(descript[w_index])
                                    descript[w_index+1]=""
                                    descript[w_index+2]=""
                                    
                    if has_number(descript[w_index]) and category=="word_wo_um" and bracket_flag==False:
                        number="".join([caractere for caractere in descript[w_index] if caractere.isdigit()])
                        if w_index+1<len(descript) and re.search(reg,descript[w_index+1]):
                            word=re.search(reg,descript[w_index+1]).group()
                            if w_index+2<len(descript) and re.search(fr"(blanc|noir|bleu|rouge|vert|jaune|orange|violet|rose|gris|beige|marron)",descript[w_index+2]):
                                color=re.search(fr"(blanc|noir|bleu|rouge|vert|jaune|orange|violet|rose|gris|beige|marron)",descript[w_index+2]).group()
                                descript[w_index]=number+" "+word+" "+color
                                list_str_meds.append(descript[w_index])
                                descript[w_index+1]=""
                                descript[w_index+2]=""
                            else:
                                descript[w_index]=number+" "+word
                                list_str_meds.append(descript[w_index])
                                descript[w_index+1]=""
                                
                    elif category=="product" and re.search(reg, descript[w_index]) and bracket_flag==False:
                        word=re.search(reg, descript[w_index]).group()
                        list_str_meds.append(word)
                            
    all_dict.append(list_str_meds)


########################################################################################
########################################################################################
############################  CREATION DES DATAFRAMES  #################################
########################################################################################
########################################################################################

print(BOLD,YELLOW,"\n\n##########################################################\n################# Création des dataframes ################\n##########################################################",RESET,'\n\n')


def group_by_cis(group):
    return group.to_dict(orient='records')



########################################
##########  INFO IMPORTANTES  ##########
########################################

dfInformation = pd.read_csv("data/CIS_InfoImportantes.txt", sep="\t", header=None, encoding="latin1")
dfInformation.columns = [
    'CIS', #0
    'dateDebut', #1
    'dateFin', #2
    'Important_informations', #1
]


########################################
##############  GENERIQUE  #############
########################################

dfGener = pd.read_csv("data/CIS_GENER_bdpm.txt", sep="\t", header=None, encoding="latin1")
dfGener = dfGener.drop([0], axis=1)
dfGener = dfGener.drop([3], axis=1)
dfGener = dfGener.drop([4], axis=1)
dfGener = dfGener.drop([5], axis=1) 
dfGener.columns = [
    'Generique', #1
    'CIS', #2
]

########################################
#############  COMPOSITION  ############
########################################

dfCompo =lecture_base("data/CIS_COMPO_bdpm.txt")
dfCompo.columns=[
    "CIS",
    "type",
    "IDPA",
    "Principe actif",
    "Dosage", 
    "Quantité",
    "SA/FT",
    "ID SA/FT",
    "?"
]
dfCompo.drop(columns=["IDPA","?"], inplace=True)

def aggregate_as_list(series):
    return sorted(series.dropna().unique(), key=lambda x: (x != 'SA', x))

dfCompo = dfCompo.groupby(['CIS', 'ID SA/FT'])

dfCompo = dfCompo.agg({
    'type': aggregate_as_list,
    'Principe actif': aggregate_as_list,
    'Dosage': aggregate_as_list,
    'Quantité': aggregate_as_list,
    'SA/FT': aggregate_as_list
}).reset_index()

dfCompo = dfCompo.groupby('CIS')
result = [{
    "CIS": int(cis),
    "Composition": group.drop(columns='CIS').to_dict(orient='records')
} for cis, group in dfCompo]

dfCompo = pd.DataFrame(result)


########################################
#############  DESCRIPTION  ############
########################################

dfDescription= pd.DataFrame(columns=["CIP","Description"])
dfDescription["CIP"]=lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,1:2]
dfDescription["Quantity"]=all_dict
dfDescription=dfDescription.drop(columns=["Description"])
dfDescription.name="Quantity"

########################################
############  PRESCRIPTION  ############
########################################

dfPrescription = pd.read_csv("data/CIS_CPD_bdpm.txt", sep="\t", header=None, encoding="latin1")
dfPrescription.columns = [
    'CIS', #0
    'Prescription_conditions', #1
]
dfPrescription = dfPrescription.groupby('CIS')
dfPrescription = dfPrescription['Prescription_conditions'].agg(', '.join)

########################################
############  PRESENTATION  ############
########################################


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
dfPresentation=dfPresentation.merge(dfDescription, on='CIP', how='inner')
dfPresentation = dfPresentation.sort_values(by=['CIS'])
actCIS = dfPresentation.iloc[0,0]
dfPresentation = dfPresentation.groupby('CIS').apply(group_by_cis)
dfPresentation = pd.DataFrame({'CIS': dfPresentation.index, 'Values': dfPresentation.values})
dfPresentation.reset_index(drop=True, inplace=True)


######################################################
###########               ATC            #############
###########  INDICATIONS THERAPEUTIQUES  #############
######################################################

print(BOLD,YELLOW,"\n\n##########################################################\n################# Création des ATC & TH #################\n##########################################################",RESET,'\n\n')
filename = 'therapeutic.py'
with open(filename, 'r') as file:
    exec(file.read())
    
with open('out/atc.json', 'r') as file:
    data = json.load(file)

dfATC = pd.DataFrame(data)
dfATC=dfATC.drop(columns=["name"])


######################################################
#############  MERGE & FINAL DF CREATION  ############
######################################################
print(BOLD,YELLOW,"\n\n##########################################################\n################# Création du dataframe final #############\n##########################################################",RESET,'\n\n')
dfMedication = pd.read_csv("data/CIS_bdpm.txt", sep="\t", header=None, encoding="latin1")
dfMedication = dfMedication.drop([5,7,9], axis=1)
dfMedication.columns = [
    'CIS', #0
    'Name', #1
    'Shape', #2
    'Administration_way', #3
    'Authorization',#4
    'Marketed', #6
    'Stock', #8
    'Titulaire', #10
    'Warning' #11 
]

dfInformation = dfInformation[dfInformation['CIS'].isin(dfMedication['CIS'])]
dfInformation = dfInformation.groupby('CIS').apply(group_by_cis)
dfInformation = pd.DataFrame({'CIS': dfInformation.index, 'infos': dfInformation.values})
dfInformation.reset_index(drop=True, inplace=True)


dfMedication = dfMedication.merge(dfATC, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfGener, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfPrescription, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfInformation, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfPresentation, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfCompo, on='CIS', how='outer')
dfMedication.dropna(subset=['Name'], inplace=True)


########################################################################################
########################################################################################
################################## JSON CONVERTION #####################################
########################################################################################
########################################################################################

print(BOLD,YELLOW,"\n\n##########################################################\n################### Conversion en JSON ###################\n##########################################################",RESET,'\n\n')

jsonMedication = dfMedication.to_json('out/medication.json', orient="records", indent=4)
dfMedication.to_csv('out/medication.csv', index=False)

print(BOLD,GREEN,"\n\n##########################################################\n########################## DONE ##########################\n##########################################################",RESET,'\n\n')

# export=Export("out/medication.json", "dbMedication", "medication")
# try:
#     export.export_json()
# except Exception as e:
#     print(BOLD,RED,"Error: ",RESET,e)