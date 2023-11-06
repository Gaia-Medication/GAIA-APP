import re
import unicodedata
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

def replace_accents(chaine):
    chaine_sans_accents = ''.join(
        unidecode(caractere) if unicodedata.combining(caractere) else caractere
        for caractere in chaine
    )
    return chaine_sans_accents

# for expression in dictionnary["produit"]:
#     expression=replace_accents(expression)
#     expression=f"{expression}|{expression}"

pattern=r"plaquette($(\(s\))|$s)"
t1="plaquette"
t2="plaquettes"
t3="plaquette(s)"
t4="plaq"


if re.search(pattern,t3):
    print("oui")