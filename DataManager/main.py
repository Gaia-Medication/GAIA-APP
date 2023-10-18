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
    'CIS_HAS_ASMR',
    'CIS_CPD_bdpm',
    'CIS_HAS_SMR',
    'HAS_LiensPageCT_bdpm'
])

# INITIALISATION
dataManager = DataManager(url, params)

#files = dataManager.getFiles()


fichier='data/CIS_CIP_bdpm.txt'
with open(fichier,"r", encoding='latin-1') as f:
    data=f.read()
    print(data)

def lecture_base(bd):
    df=pd.read_csv(bd, sep="\t", header=None)
    return df




#Code CIS    Code CIP7   Libellé de la présentation  Statut administratif de la présentk,jation Etat de commercialisation
# Date de la déclaration de commercialisation Code CIP13  Agrément aux collectivités  Taux de remboursement   
# Prix du médicament en euro  Indications ouvrant droit au remboursement

