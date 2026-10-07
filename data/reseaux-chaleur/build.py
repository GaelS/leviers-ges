import csv
import sys
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

sources = Path(sys.argv[1])
destination = Path(sys.argv[2])

QUANTUM = Decimal('1e-12')

CITY_BY_DISTRICT_RANGE = (
    (range(75101, 75121), '75056'),
    (range(69381, 69390), '69123'),
    (range(13201, 13217), '13055'),
)


def plain(value: Decimal) -> str:
    return format(value.normalize(), 'f')


def rounded(text: str) -> str:
    return plain(Decimal(text).quantize(QUANTUM, rounding=ROUND_HALF_UP))


def city_of(commune_code: str) -> str:
    for district_range, city in CITY_BY_DISTRICT_RANGE:
        if commune_code.isdigit() and int(commune_code) in district_range:
            return city
    return commune_code


with open(sources / 'batiments-machines-agricoles' / 'sdes-chaleur-commune-2024.csv', encoding='utf-8-sig', newline='') as handle:
    sdes = list(csv.DictReader(handle, delimiter=';'))

with open(sources / 'decarbonation-reseaux-chaleur' / 'fcu-reseaux-chaleur.csv', encoding='utf-8', newline='') as handle:
    fcu = {row['identifiant_reseau']: row for row in csv.DictReader(handle) if row['identifiant_reseau']}

records = []
secret_count = 0
for row in sorted(sdes, key=lambda r: r['ID']):
    if row['CONSOTOT'] == 'secret':
        secret_count += 1
        continue
    france_chaleur_urbaine = fcu.get(row['ID'])
    if france_chaleur_urbaine is not None and france_chaleur_urbaine['contenu_co2_kgco2_kwh'] != '':
        factor, factor_source = rounded(france_chaleur_urbaine['contenu_co2_kgco2_kwh']), 'fcu'
    else:
        factor, factor_source = rounded(row['CONTENU_EN_CO2']), 'sdes'
    records.append((row['ID'], city_of(row['COMMUNE_CODE']), rounded(row['CONSOTOT']), factor, factor_source))

destination.parent.mkdir(parents=True, exist_ok=True)
with open(destination, 'w', encoding='utf-8', newline='') as handle:
    writer = csv.writer(handle, lineterminator='\n')
    writer.writerow(['network_id', 'commune_code', 'delivered_mwh', 'emission_factor_kg_per_kwh', 'emission_factor_source'])
    writer.writerows(records)

total = sum(Decimal(record[2]) for record in records)
print('rows', len(records), 'secret', secret_count, 'total_mwh', plain(total))
