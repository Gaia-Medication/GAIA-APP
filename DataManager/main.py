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
    'CIS_HAS_ASMR_bdpm',
    'CIS_CPD_bdpm',
    'CIS_HAS_SMR_bdpm',
    'HAS_LiensPageCT_bdpm'
])

# LECTURE DES FICHIERS
def lecture_base(bd):
    return pd.read_csv(bd, sep="\t", header=None, encoding="latin1")


date=[
    ['data/CIS_InfoImportantes.txt',"data/CIS_CIP_Dispo_Spec.txt","data/CIS_CIP_bdpm.txt","data/CIS_bdpm.txt","data/CIS_HAS_SMR_bdpm.txt","data/CIS_HAS_ASMR_bdpm.txt"],
    [[1,3],[4,6],[5,6],[7,8],[3,4],[3,4]],
    ["d-m-y","d/m/y","d/m/y","d/m/y","ymd","ymd"]
]


# INITIALISATION
dataManager = DataManager(url, params)

#files = dataManager.getFiles()

 # NETTOYAGE DES DONNEES
def clear_data():
    tab_ms_values =""
    for i in params:
        table=lecture_base("data/"+i+".txt")
        missing_values=table.isnull().values
        
        tab_ms_values+=f"{i} : {np.sum(missing_values, axis=0)} \n \n"
    return tab_ms_values
    
    
    
for i in range(6):
    data=pd.read_csv(date[0][i], sep="\t", header=None, encoding="latin1").iloc[:,date[1][i][0]:date[1][i][1]]
    
    if date[2][i]=='d-m-y':
        for row in range(data.shape[0]):
            data.values[row][0]=data.values[row][0].replace('-','/')
            data.values[row][1]=data.values[row][0].replace('-','/')
    if date[2][i]=='ymd':
        for row in range(data.shape[0]):
            dstr=str(data.values[row][0])
            y=dstr[0:4]
            m=dstr[4:6]
            d=dstr[6:8]             #problème de type
            data.astype(str)
            data.values[row][0]=int(f"{d}/{m}/{y}")
    



#Code CIS    Code CIP7   Libellé de la présentation  Statut administratif de la présentk,jation Etat de commercialisation
# Date de la déclaration de commercialisation Code CIP13  Agrément aux collectivités  Taux de remboursement   
# Prix du médicament en euro  Indications ouvrant droit au remboursement

