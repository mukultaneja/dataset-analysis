
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

    if kwargs['country'] != 'all':
        data = data[data['country_txt'] == kwargs['country']]
        cols.append('country_txt')

    if kwargs['region'] != 'all':
        data = data[data['region_txt'] == kwargs['region']]
        cols.append('region_txt')

    return data.groupby(cols, as_index=False).sum()


def get_unique_years():
    '''
    Function:
    '''
    return TERRORISM_DATA['year'].unique().tolist()


def get_unique_country():
    '''
    Function:
    '''
    return TERRORISM_DATA['country_txt'].unique().tolist()


def get_unique_region(country):
    '''
    Function:
    '''
    data = TERRORISM_DATA[TERRORISM_DATA['country_txt'] == country]
    return data['region_txt'].unique().tolist()
