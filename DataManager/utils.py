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
    colors="blanc|noir|bleu|rouge|vert|jaune|orange|violet|rose|gris|beige|marron"
    for category in dictionnary:
        regex_dict[category]=[]
        for word in dictionnary[category]:
            word=word.lower()
            word=replace_accents(word)
            if category=="product":
                regex_dict[category].append(fr"\b([0-9]*(\.|,)?[0-9]*)(\s*){word}\b")
            if category=="word_wo_um":
                regex_dict[category].append(fr"{word}")
            if category=="second_product":
                regex_dict[category].append(fr"{word}")
    return regex_dict