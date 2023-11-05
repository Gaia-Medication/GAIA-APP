from dataManager import DataManager
import pandas as pd
import numpy as np
from text_to_num import text2num

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



date=[
    ['data/CIS_InfoImportantes.txt'],
    [[1,3]],
    ["y-m-d"]
]

dictionnary={
    "produit":["plaquette","kit","conditionnement","bande","poudre","générateur","distributeur","flacon","tube","ampoule","pilulier","sachet","pot","seringue","stylo","spray","sachet","bouteille","récipient","film","boite","boîte","poche","inhalateur","cartouche","vaporateur","dispositif","enveloppe","applicateur"],
    "quantité":["mL","L","l","ml","mg","g","G","mG","comprimé","gélule","sachet","dose"],
    "matière":['pvdc','aluminium','pvc','polyamide','polyéthylène','papier','thermoformée',"en verre","acier","polypropylène"]
}

# INITIALISATION
dataManager = DataManager(url, params)

#files = dataManager.getFiles()


# LECTURE DES FICHIERS
def lecture_base(bd):
    return pd.read_csv(bd, sep="\t", header=None, encoding="latin1")


def has_number(string):
    return any(char.isdigit() for char in string)

def is_in_dictionnary(substring_to_check:str,category):             # SERT A REGARDER SI LE STRING EN ENTREE FAIT PARTIE D'UN MOT DE LA CATEGORIE DONNEE
    if any(string in substring_to_check for string in dictionnary[category]):return True    # EX: mot="produit"  substring_to_check="pro"  return True
    else: return False                                                                      # EST UTILE UNIQUEMENT POUR LES MOTS QU'ON SAIT DANS LE DICTIONNAIRE
                                                                                            # CELA EVITE DE VERIFIER LES PLURIELS DE CHAQUE MOTS
    
def is_convertible_to_number(s):
    try:
        return text2num(s,"fr")
    except ValueError:
        return False

 # NETTOYAGE DES DONNEES
def missing_value_count():
    tab_ms_values =""
    for i in params:
        table=lecture_base("data/"+i+".txt")
        missing_values=table.isnull().values
        
        tab_ms_values+=f"{i} : {np.sum(missing_values, axis=0)} \n \n"
    return tab_ms_values



def clean_date():
    for i in range(len(date[0])):
        data=pd.read_csv(date[0][i], sep="\t", header=None, encoding="latin1").iloc[:,date[1][i][0]:date[1][i][1]]
        
        if date[2][i]=='y-m-d':
            print("Colone 1  :   \n",data.iloc[:,0].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))
            print("Colone 2  :   \n",data.iloc[:,1].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))
        





brut_data = lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3].values[:,0]
string_data = brut_data.astype(str)
all_desciption = np.char.split(string_data) # split les strings en array de string


liste_no_de = []
data_df={"quantité":[],"produit":[],"matière":[], "quantité produit 2":[],"produit 2":[]}
df_description = pd.DataFrame(data_df)



for description in all_desciption:
    
    produit_1=""
    produit_2=""
    matiere=""
    quantité_1=""
    quantité_2=""
    
    if len(description) not in liste_no_de:
        liste_no_de.append(len(description))
    # if len(description)==4:
    #     print(description)
    
    if len(description)<5:
        if has_number(description[0]):
            quantité_1=description[0]
            if is_in_dictionnary(description[1].lower(),"produit"):
                produit_1=description[1]
            if len(description)==4 and description[3]=="verre":
                matiere=description[3]
            if len(description)>2 and is_in_dictionnary(description[2].lower(),"matière"):
                matiere=description[2]
        elif is_convertible_to_number(description[0]):
            quantité_1=str(text2num(description[0],"fr"))
            if is_in_dictionnary(description[1].lower(),"produit"):
                produit_1=description[1]
            if is_in_dictionnary(description[2].lower(),"matière"):
                matiere=description[2]
        elif len(description)==4:
            produit_1=description[0]
            quantité_2=description[2]
            produit_2=description[3]
        if produit_1=="" and quantité_1=="" and matiere=="":
            print(description)
        temp_df = pd.DataFrame({"quantité":quantité_1,"produit":produit_1,  "matière":matiere,"quantité produit 2":quantité_2,"produit 2":produit_2}, index=[0])
        df_description=pd.concat([df_description,temp_df],ignore_index=True)
        # else:
        #     produit=description[0]
        #     if  not  is_in_dictionnary(produit.lower(),"produit"):
        #         print(produit,description[0:])
        
    
    
print(df_description.shape)
liste_no_de.sort()
#print(liste_no_de)

