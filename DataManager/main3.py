import pandas as pd


dfPersonel = pd.read_csv("data/PS_LibreAcces_Personne_activite_202402090834.txt", sep="|", header=0,low_memory=False, encoding="latin1")

dfPersonel = dfPersonel[dfPersonel["Code profession"] == 10]
dfPersonel = dfPersonel.iloc[:, [ 1, 7, 8, 16 ,28, 31,32, 35 ,37 ,45 , 40 ,43]]
# dfPersonel.to_json('out/personnel.json', orient="records", indent=4)
dfPersonel.to_csv('out/personnel.csv', index=False)
