from dataManager import DataManager
import pandas as pd
import numpy as np

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

# LECTURE DES FICHIERS
def lecture_base(bd):
    return pd.read_csv(bd, sep="\t", header=None, encoding="latin1")


date=[
    ['data/CIS_InfoImportantes.txt'],
    [[1,3]],
    ["y-m-d"]
]

meds={
    "contenant":["plaquette","flacon","tube","ampoule","pilullier","sachet","pot","seringue","stylo","spray","sachet","bouteille","récipient","film","boite","boîte","poche","inhalateur","cartouche","vaporateur","disposit","enveloppe","applicateur"],
    "quantité":["mL","L","l","ml","mg","g","G","mG","comprimé","gélule","sachet","dose"],
    "matière":[]
}



# INITIALISATION
dataManager = DataManager(url, params)

#files = dataManager.getFiles()

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
        



for i in range (0,len(lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3])):
    print(lecture_base("data/CIS_CIP_bdpm.txt").iloc[:,2:3].values[i][0])


#Code CIS    Code CIP7   Libellé de la présentation  Statut administratif de la présentk,jation Etat de commercialisation
# Date de la déclaration de commercialisation Code CIP13  Agrément aux collectivités  Taux de remboursement   
# Prix du médicament en euro  Indications ouvrant droit au remboursement

