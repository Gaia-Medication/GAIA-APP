import os
import pandas as pd


data=pd.read_excel('data/ATC_2023.xls')
data=data.drop(columns=["Niveau code","Libellé anglais","Commentaires","Création","Modification","Inactivation"])
data.to_json('out/ATC_2023.json',orient='records',indent=4)