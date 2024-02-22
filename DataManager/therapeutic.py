from dataManager import DataManager

urlTherapeutic = 'https://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid='
urlAtc = "https://observatoiredumedicament.cyrilcoquilleau.com/medicament/"
listOfCis = ["69489216", "65160248"]
listOfNames = ["fentanyl-biogaran-100-microgrammes", "euphon"]

class Therapeutic():
    
    def getTherapeuticDatas(self, url, listOfCis):
        dm = DataManager(url)
        for cis in listOfCis:
            dm.getTherapeutics(cis)

    def getATCDatas(self, url, listOfCis):
        dm = DataManager(url)
        for i in range(len(listOfCis)):
            dm.getATC(listOfNames[i], listOfCis[i])

th = Therapeutic()
th.getTherapeuticDatas(urlTherapeutic, listOfCis)
th.getATCDatas(urlAtc, listOfCis)