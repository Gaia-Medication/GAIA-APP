import excel2json
import os

excel2json.convert_from_file('data/ATC_2023.xls','out')
os.rename('out/2022 05 24.json','out/ATC_2023.json')