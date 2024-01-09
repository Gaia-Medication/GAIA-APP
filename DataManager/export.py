from pymongo import MongoClient
import json

BOLD = '\033[1m' # ACTIONS
BLUE = '\033[94m' # ACTIONS
RESET = '\033[0m'
RED = '\033[91m' # ERRORS
GREEN = '\033[92m' # SUCCESS
YELLOW = '\033[93m' # INFORMATIONS

class Export:
    def __init__(self, json, hostname, portnumber, dbName, collectionName) -> None:
        self.json = json
        self.hostname=hostname
        self.port=portnumber
        self.dbName=dbName
        self.collectionName=collectionName
    
    def export_json(self):
        client = MongoClient("mongodb://root:s5a06a@172.26.82.44:27777/?readPreference=primary&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=test&authMechanism=SCRAM-SHA-256") # Connects to MongoDB server, replace with your server details
        db = client[self.dbName]
        collection = db[self.collectionName]


        with open(self.json, 'r') as file:
            file_data = json.load(file)


        if isinstance(file_data, list):
            collection.insert_many(file_data)  # Use insert_many if it's a list
        else:
            collection.insert_one(file_data)  # Use insert_one if it's a dictionary
        
        print(BOLD,"Data inserted successfully",GREEN,RESET)
