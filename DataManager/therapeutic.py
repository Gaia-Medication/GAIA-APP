from dataManager import DataManager

class Therapeutic():
    
    def getTherapeuticDatas(self, url, listOfCis):
        dm = DataManager(url)
        list_of_th = []
        for cis in listOfCis:
            list_of_th.append(dm.getTherapeutics(cis))
        return list_of_th

    def getATCDatas(self, url, listOfCis, listOfNames):
        dm = DataManager(url)
        list_of_atc = []
        for i in range(len(listOfCis)):
            try:
                list_of_atc.append(dm.getATC(listOfNames[i], listOfCis[i]))
            except Exception as e:
                print(f"An error occurred: {e} {listOfNames[i]} {listOfCis[i]}")
        return list_of_atc
