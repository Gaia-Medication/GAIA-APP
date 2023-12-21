from dataManager import DataManager
import pandas as pd
import numpy as np
import pyproj
from tqdm import tqdm

# DATA
url = 'https://www.data.gouv.fr/fr/datasets/r/98f3161f-79ff-4f16-8f6a-6d571a80fea2'

# INITIALISATION
dataManager = DataManager(url)

#files = dataManager.getPharmacyFile()

df = pd.read_csv('data/pharmacies.csv', sep=';', skiprows=[0]) 
new_column_names = [str(i) for i in range(32)]
df.columns = new_column_names

dataTypes = [df['0'].unique()[0], df['0'].unique()[1]]  # Replace with your desired values

# Create an empty dictionary to store separate DataFrames
separated_dfs = {}

# Iterate through specific values and separate the rows
for value in dataTypes:
    mask = df['0'] == value
    separated_dfs[value] = df[mask]

df = separated_dfs['structureet']
dfLoc = separated_dfs['geolocalisation']

dfLoc = dfLoc.drop(columns=[
    '0',
    '4', 
    '5', 
    '6', 
    '7', 
    '8', 
    '9', 
    '10', 
    '11', 
    '12', 
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31'
])
dfLoc.columns = [
    'id',
    'latitude',
    'longitude'
]


df.drop(columns=['0', '2', '5', '6', '10', '11', '12', '13', '14', '17', '18', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '31'], inplace=True)
# 3, 4, 7, 8, 9, 15, 19, 30
df.columns = [
    'id',
    'shortName', 
    'Name',
    'adress1', 
    'adress2',
    'adress3',
    'city',
    'phone',
    'type',
    'date'
]

df = df.merge(dfLoc, on='id', how='inner')
value_counts = df['type'].value_counts()

specific_values = [
    "Pharmacie d'Officine",
    'Pharmacie Mutualiste',
    'Centre Hospitalier (C.H.)',
    'Centre Hospitalier Régional (C.H.R.)',
    'Centre Hospitalier Universitaire (C.H.U.)',
    'Etablissement de Soins Pluridisciplinaire'
]

print(df[df["type"] == "Centre Hospitalier Régional (C.H.R.)"])

mask = df['type'].isin(specific_values)

filtered_df = df[mask]
filtered_df.sort_values(by=['type'], inplace=True)
df = filtered_df

#--------  LAMBERT 93 => WGS 84  ----------#
lambert93 = pyproj.Proj(init='epsg:2154')
wgs84 = pyproj.Proj(init='epsg:4326')
t = tqdm(total=df.shape[0], desc="Conversion LAMBERT 93 => WGS 84")

def convert_coordinates(x, y):
    longitude, latitude = pyproj.transform(lambert93, wgs84, x, y)
    t.update(1)
    return pd.Series({'Latitude': latitude, 'Longitude': longitude})

def format_with_zeros(value):
    if pd.isnull(value):
        return value
    return '{:010d}'.format(int(value))


df['phone'] = df['phone'].apply(format_with_zeros)
df[['latitude', 'longitude']] = df.apply(lambda x: convert_coordinates(x['latitude'], x['longitude']), axis=1)
df.to_json('data/out/pharmacies.json', orient='records')



