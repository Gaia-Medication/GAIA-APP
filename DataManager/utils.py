import re
import unicodedata
from text_to_num import text2num
import pandas as pd
import numpy as np




# LECTURE DES FICHIERS
def lecture_base(bd):
    return pd.read_csv(bd, sep="\t", header=None, encoding="latin1")


def has_number(string):
    return any(char.isdigit() for char in string)




def is_convertible_to_number(s):
    try:
        return text2num(s,"fr")
    except ValueError:
        return False

def replace_accents(chaine):
    chaine_sans_accents = ''.join(
        unicodedata.normalize('NFD', caractere).encode('ascii', 'ignore').decode('utf-8')
        if unicodedata.category(caractere) != 'Mn'
        else caractere
        for caractere in chaine
    )
    return chaine_sans_accents




# CREATION DES DICTIONNAIRES

def create_regex_from_dictionnary(dictionnary):
    regex_dict={}
    for category in dictionnary:
        regex_dict[category]=[]
        for word in dictionnary[category]:
            word=word.lower()
            word=replace_accents(word)
            regex_dict[category].append(fr"\b{word}(\(s\)|s)?\b")
    return regex_dict





# ANALYSE DES DONNEES


autorisation = lecture_base("data/CIS_bdpm.txt").iloc[:,4:5].values[:,0]
l_autorisation=[]
result_autorisation=""
for i in l_autorisation:
    result_autorisation+=i+"\n"
with open("data/autorisation.txt","w") as f:
    f.write(result_autorisation)

forme = lecture_base("data/CIS_bdpm.txt").iloc[:,2:3].values[:,0]
l_forme=[]
for i in forme:
    i=replace_accents(i)
    s=i.split(" et")
    for y in s:
        y = y[:3].replace(" ", "") + y[3:]
        if y not in l_forme:
            l_forme.append(y)
result=""
for i in l_forme:
    result+=i+"\n"
with open("data/forme.txt","w") as f:
    f.write(result)
    
voie = lecture_base("data/CIS_bdpm.txt").iloc[:,3:4].values[:,0]
l_voie=[]
for i in voie:    
    i=replace_accents(i)
    s=i.split(";")
    for y in s:
        if y not in l_voie:
            l_voie.append(y)
result_voie=""
for i in l_voie:
    result_voie+=i+"\n"
with open("data/voie.txt","w") as f:
    f.write(result_voie)
