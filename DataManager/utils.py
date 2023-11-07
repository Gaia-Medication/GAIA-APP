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

def is_in_dictionnary(substring_to_check:str,category):             # SERT A REGARDER SI LE STRING EN ENTREE FAIT PARTIE D'UN MOT DE LA CATEGORIE DONNEE
    if any(string in substring_to_check for string in dictionnary[category]):return True    # EX: mot="produit"  substring_to_check="pro"  return True
    else: return False                                                                      # EST UTILE UNIQUEMENT POUR LES MOTS QU'ON SAIT DANS LE DICTIONNAIRE
                                                                                            # CELA EVITE DE VERIFIER LES PLURIELS DE CHAQUE MOTS
    
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




dictionnary={
    "produit":["plaquette","kit","conditionnement","bande","poudre","générateur","distributeur","flacon","tube","ampoule","pilulier","sachet","pot","seringue","stylo","spray","sachet","bouteille","récipient","film","boite","boîte","poche","inhalateur","cartouche","vaporateur","dispositif","enveloppe","applicateur"],
    "quantité":["l","ml","mg","g","comprimé","gélule","sachet","dose"],
    "matière":['pvdc','aluminium','pvc','polyamide','polyéthylène','papier','thermoformée',"en verre","acier","polypropylène"]
}

regex_dict={
    "product":[],
    "quantity":[],
    "material":[]
}




# for expression in dictionnary["produit"]:
#     expression=replace_accents(expression)
#     expression=f"{expression}|{expression}"

pattern=r"plaquette($(\(s\))|$s)"
t1="plaquette"
t2="plaquettes"
t3="plaquette(s)"
t4="plaq"


# if re.search(pattern,t3):
#     print("oui")
