from dataManager import DataManager
import pandas as pd
import numpy as np
import re
from utils import has_number, replace_accents, lecture_base, create_regex_from_dictionnary


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
#files = dataManager.getFiles()


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
    "product":['plaquette', 'tube','éponge', 'recipient', 'flacon', 'ampoule',"sachetspolyterephtalate", 'pilulier', 'sachet', 'dose', 'seringue', 'bouteille', 'pot', 'film', 'evaporateur', 'poche', 'stylo',"applicateur", 'generateur', 'inhalateur', 'dispositif','enveloppe', 'sac', 'conditionnement', 'bande', 'comprime', 'poudre','kit', 'gelule', 'boite', 'cartouche', 'fut'],
    "second_product":["plaquette",'éponge',"bâton","gobelet doseur","ovule","kit","dose","comprimé","gomme","gélule","pastille","lyophilisat","sachetspolyterephtalate","capsule","suppositoire","distributeur journalier","conditionnement","bande","poudre","générateur","flacon","tube","applicateur","ampoule","pilulier","sachet","pot","seringue","stylo","spray","bouteille","récipient","film","boite","boite","poche","inhalateur","cartouche","evaporateur","dispositif","enveloppe","fut","sac"],
    "basic_product":["plaquette",'éponge',"bâton","gobelet doseur","ovule","kit","dose","comprimé","gomme","gélule","pastille","lyophilisat","sachetspolyterephtalate","capsule","suppositoire","distributeur journalier","conditionnement","bande","poudre","générateur","flacon","tube","applicateur","ampoule","pilulier","sachet","pot","seringue","stylo","spray","bouteille","récipient","film","boite","boite","poche","inhalateur","cartouche","evaporateur","dispositif","enveloppe","fut","sac"],
    "quantity":["l","ml","mg","g","kg","litre","litres","ui","u"]
}
dictionnary=create_regex_from_dictionnary(dictionnary)
brut_data = lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3].values[:,0]
string_data = brut_data.astype(str)
all_dict=[]
for description in string_data:
    description = description.lower()
    description = replace_accents(description)
    description=description.replace("  "," ")
    description = description.split(" ")
    if has_number(description):
        bracket_flag=False
        for w_index in range (0,len(description)-1):
            if re.search(fr"[0-9]+,", description[w_index]) and description[w_index+1].isdigit():
                description[w_index+1]=re.search(fr"[0-9]+,", description[w_index]).group()+description[w_index+1]
                description[w_index]=""
                description[w_index+1]=description[w_index+1].replace(" ","")
                
            for category, regex in dictionnary.items():
                for reg in regex:
                    if w_index < len(description)-1:
                        if description[w_index] !="":
                            if description[w_index][0]=="(":
                                bracket_flag=True
                            if description[w_index][-1]==")":
                                bracket_flag=False
                                     
                        if has_number(description[w_index]) and re.search(reg, description[w_index + 1]) and bracket_flag==False:
                            if "de" in description[w_index]:
                                description[w_index]=description[w_index].replace("de","de ")
                            if description[w_index -1]=='de' :
                                description[w_index -1] = description[w_index -1] + " " + description[w_index] + " " + description[w_index + 1]
                                description[w_index + 1]=""
                                description[w_index]=""
                            else:
                                description[w_index] = description[w_index] + " " + description[w_index + 1]
                                description[w_index + 1]=""

    list_str_meds=[]
    pflag=False
    for i_word in range (0,len(description)-1):
        for category, regex in dictionnary.items():
            for reg in regex:
                if re.search(reg,description[i_word]):
                    w=re.search(reg,description[i_word]).group()
                    if category=="product" and pflag==False:
                        p_index=i_word
                        pflag=True
                        list_str_meds.append(w)
                    if category=="second_product":
                        if p_index!=i_word:
                            list_str_meds.append(w)
                    if category=="quantity" and pflag==True:
                        list_str_meds.append(w)
    # nbr=0
    # deter='sdfqsfqsfqsdf'
    # deter_index=-1
    # pop_index=[]
    # nbr_index=-1
    # for wi in range(0,len(list_str_meds)):        
    #     split_w=list_str_meds[wi].split(" ")
    #     if split_w[0]=="de":
    #         deter_index=wi
    #         deter=split_w[2]
    #         for s in range(0,len(split_w)):
    #             if split_w[s].isdigit():
    #                 nbr_index=s
    #                 nbr=int(split_w[s])
                    
    #     if deter in list_str_meds[wi] and "de" not in list_str_meds[wi]:
    #         pop_index.append(wi)
    #         for s in split_w:
    #             if s.isdigit():
    #                 nbr+=int(s)
            
    # split_w=list_str_meds[deter_index].split(" ")
    # for s in split_w:
    #     if s.isdigit():
    #         s=nbr
    # if nbr_index>0 and deter_index>=0:
    #     list_str_meds[deter_index]=list_str_meds[deter_index].replace(split_w[nbr_index],str(nbr))
    # pop_index.sort(reverse=True)
    # for p in pop_index:
    #     list_str_meds.pop(p)
        
        
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
#############  MERGE & FINAL DF CREATION  ############
######################################################

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
]

dfInformation = dfInformation[dfInformation['CIS'].isin(dfMedication['CIS'])]
dfInformation = dfInformation.groupby('CIS').apply(group_by_cis)
dfInformation = pd.DataFrame({'CIS': dfInformation.index, 'infos': dfInformation.values})
dfInformation.reset_index(drop=True, inplace=True)


dfMedication = dfMedication.merge(dfGener, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfPrescription, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfInformation, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfPresentation, on='CIS', how='outer')
dfMedication = dfMedication.merge(dfCompo, on='CIS', how='outer')
dfMedication.dropna(subset=['Name'], inplace=True)


########################################################################################
########################################################################################
################################  CONVERTION EN JSON ###################################
########################################################################################
########################################################################################

print(BOLD,YELLOW,"\n\n##########################################################\n################### Conversion en JSON ###################\n##########################################################",RESET,'\n\n')

jsonMedication = dfMedication.to_json('out/medication.json', orient="records", indent=4)
