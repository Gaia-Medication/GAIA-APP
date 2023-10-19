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

files = dataManager.getFiles()

def lecture_base(bd):
    return pd.read_csv(bd, sep="\t", header=None, encoding="latin1")


print(lecture_base("data/CIS_bdpm.txt"))


#Code CIS    Code CIP7   Libellé de la présentation  Statut administratif de la présentk,jation Etat de commercialisation
# Date de la déclaration de commercialisation Code CIP13  Agrément aux collectivités  Taux de remboursement   
# Prix du médicament en euro  Indications ouvrant droit au remboursement

