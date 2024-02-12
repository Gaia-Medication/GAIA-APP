import pandas as pd
from dataManager import DataManager

url="https://annuaire.sante.fr/web/site-pro/extractions-publiques?p_p_id=abonnementportlet_WAR_Inscriptionportlet_INSTANCE_gGMT6fhOPMYV&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&_abonnementportlet_WAR_Inscriptionportlet_INSTANCE_gGMT6fhOPMYV_nomFichier=PS_LibreAcces_202402120942.zip"
dataManager = DataManager(url)
files = dataManager.getMedicFile()
dfPersonel = pd.read_csv("data/PS_LibreAcces_Personne_activite_202402120843.txt", sep="|", header=0,low_memory=False, encoding="latin1")

dfPersonel = dfPersonel[dfPersonel["Code profession"] == 10]
dfPersonel = dfPersonel.iloc[:, [ 1, 7, 8, 16 ,28, 31,32, 35 ,37 ,45 , 40 ,43]]
dfPersonel=dfPersonel.sort_values(by='Identifiant PP')


#datas=dfPersonel.astype(str)

# listPP=[]
# for index, row in dfPersonel.iterrows():
#     if listPP==[]:
#         listPP.append(row.iloc[0])
#     elif row.iloc[0]==listPP[0]:
#         listPP.append(row.iloc[0])
#     else:
#         listPP=[row.iloc[0]]
#     print(listPP)


# dfPersonel.to_json('out/personnel.json', orient="records", indent=4)
dfPersonel.to_csv('out/personnel.csv', index=False)
