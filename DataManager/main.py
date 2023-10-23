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
    ['data/CIS_InfoImportantes.txt',"data/CIS_HAS_ASMR_bdpm.txt","data/CIS_HAS_SMR_bdpm.txt"],
    [[1,3],[3,4],[3,4]],
    ["y-m-d","ymd","ymd"]
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


    
dates_ASMR=[]
dates_SMR=[]
    
for i in range(len(date[0])):
    data=pd.read_csv(date[0][i], sep="\t", header=None, encoding="latin1").iloc[:,date[1][i][0]:date[1][i][1]]
    
    if date[2][i]=='y-m-d':
        print("Colone 1  :   \n",data.iloc[:,0].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))
        print("Colone 2  :   \n",data.iloc[:,1].str.split('-').apply(lambda x: f"{x[2]}/{x[1]}/{x[0]}"))

    if date[2][i]=='ymd':
        if date[0][i]== "data/CIS_HAS_ASMR_bdpm.txt":
            print('ASMR :  \n',data.iloc[:,0].apply(lambda date_int: f"{date_int % 100:02d}/{date_int // 100 % 100:02d}/{date_int // 10000}"))
        
        if date[0][i]== "data/CIS_HAS_SMR_bdpm.txt":
            print('SMR :  \n',data.iloc[:,0].apply(lambda date_int: f"{date_int % 100:02d}/{date_int // 100 % 100:02d}/{date_int // 10000}"))
        


#Code CIS    Code CIP7   Libellé de la présentation  Statut administratif de la présentk,jation Etat de commercialisation
# Date de la déclaration de commercialisation Code CIP13  Agrément aux collectivités  Taux de remboursement   
# Prix du médicament en euro  Indications ouvrant droit au remboursement

