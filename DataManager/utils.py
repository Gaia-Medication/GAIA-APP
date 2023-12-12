import re
import unicodedata
import pandas as pd
import numpy as np




# LECTURE DES FICHIERS
def lecture_base(bd):
    return pd.read_csv(bd, sep="\t", header=None, encoding="latin1")


def has_number(string):
    return any(char.isdigit() for char in string)



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
            if category=="product":
                regex_dict[category].append(fr"\b([0-9]*(\.|,)?[0-9]*)(\s*){word}(\(s\)|s)?\b")
            if category=="second_product":
                regex_dict[category].append(fr"\b(de\s)([0-9]+(\.|,)?[0-9]*)(\s+){word}(\(s\)|s)?\b")
            elif category=="quantity":
                regex_dict[category].append(fr"\b(de\s)?([0-9]*(\.|,)?[0-9]*)(\s*){word}\b")
    return regex_dict