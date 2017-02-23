
import pandas as pd

try:
    TERRORISM_DATA = pd.read_csv('global-terror-data.csv', index_col=0)
except Exception as error:
    print error.__str__()


def get_filtered_data(kwargs):
    '''
    Function to compute data by year
    '''
    data = TERRORISM_DATA
    cols = ['iyear', 'month']

    years = kwargs['year'].split('-')
    st_year = int(years[0])
    en_year = int(years[1])

    data = data[(data['iyear'] >= st_year) & (data['iyear'] <= en_year)]

    if kwargs['month'] != 'all':
        data = data[data['month'] == kwargs['month']]

    if kwargs['region'] != 'all':
        data = data[data['region_txt'] == kwargs['region']]
        cols.append('region_txt')

    if kwargs['country'] != 'all':
        data = data[data['country_txt'] == kwargs['country']]
        cols.append('country_txt')

    if kwargs['city'] != 'all':
        data = data[data['city'] == kwargs['city']]
        cols.append('city')

    return data.groupby(cols, as_index=False).sum().fillna('NA')


def get_unique_years():
    '''
    Function:
    '''
    return TERRORISM_DATA['year'].fillna('NA').unique().tolist()


def get_unique_regions():
    '''
    Function:
    '''
    return TERRORISM_DATA['region_txt'].fillna('NA').unique().tolist()


def get_unique_countries(region):
    '''
    Function:
    '''
    data = TERRORISM_DATA[TERRORISM_DATA['region_txt'] == region]
    return data['country_txt'].fillna('NA').unique().tolist()


def get_unique_cities(region, country):
    '''
    Function:
    '''
    print region, country
    data = TERRORISM_DATA[TERRORISM_DATA['region_txt'] == region]
    data = data[data['country_txt'] == country]
    return data['city'].fillna('NA').unique().tolist()
