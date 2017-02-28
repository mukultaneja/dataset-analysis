import json
import pandas as pd
import numpy as np

try:
    TERRORISM_DATA = pd.read_csv('global-terror-data.csv', index_col=0)
    TERRORISM_DATA = TERRORISM_DATA[
        (TERRORISM_DATA.iyear >= 2000) & (TERRORISM_DATA.iyear <= 2015)]
except Exception as error:
    print error.__str__()


def get_sunburst_data(kwargs):
    '''
    Function to compute data by year
    '''
    data = TERRORISM_DATA
    cols = ['iyear', 'month', 'region_txt', 'country_txt', 'city']

    years = kwargs['year'].split('-')
    st_year = int(years[0])
    en_year = int(years[1])

    data = data[(data['iyear'] >= st_year) & (data['iyear'] <= en_year)]

    if kwargs['month'] != 'all':
        data = data[data['month'] == kwargs['month']]

    if kwargs['region'] != 'all':
        data = data[data['region_txt'] == kwargs['region']]

    if kwargs['country'] != 'all':
        data = data[data['country_txt'] == kwargs['country']]

    if kwargs['city'] != 'all':
        data = data[data['city'] == kwargs['city']]

    return data.groupby(cols, as_index=False).sum().fillna('NA')


def get_trend_line_data(kwargs):
    '''
    Function:
    '''
    data = TERRORISM_DATA
    years = kwargs['year'].split('-')
    st_year = int(years[0])
    en_year = int(years[1])
    cols = ['iyear', 'region_txt']
    data = data[(data['iyear'] >= st_year) & (data['iyear'] <= en_year)]
    data = data[data['region_txt'] == kwargs['region']]

    if kwargs['country'] != 'all':
        data = data[data['country_txt'] == kwargs['country']]
        cols.append('country_txt')

    if kwargs['city'] != 'all':
        data = data[data['city'] == kwargs['city']]
        cols.append('city')

    if kwargs['check'] == 'suicide':
        return data.groupby(cols, as_index=False).agg({'suicide': np.sum})

    return data.groupby(cols, as_index=False).agg({'success': np.sum})


def get_sunburst_trendline_data(kwargs):
    '''
    Function:
    '''
    data = TERRORISM_DATA
    year = int(kwargs['year'])
    month = kwargs['month']
    region = kwargs['region']
    country = kwargs['country']
    checktype = kwargs['check']

    cols = []

    if year and month and region and country:
        data = data[data['iyear'] == year]
        data = data[data['month'] == month]
        data = data[data['region_txt'] == region]
        data = data[data['country_txt'] == country]
        cols.append('city')
    elif year and month and region:
        data = data[data['iyear'] == year]
        data = data[data['month'] == month]
        data = data[data['region_txt'] == region]
        cols.append('country_txt')
    elif year and month:
        data = data[data['iyear'] == year]
        data = data[data['month'] == month]
        cols.append('region_txt')
    else:
        data = data[data['iyear'] == year]
        cols.append('month')

    if checktype == 'suicide':
        return data.groupby(cols, as_index=False).agg({'suicide': np.sum})

    return data.groupby(cols, as_index=False).agg({'success': np.sum})


def get_options(col, region, country):
    '''
    Function:
    '''
    if col == 'year':
        data = get_unique_years()
    elif col == 'region':
        data = get_unique_regions()
    elif col == 'country':
        region = region.replace('|', '&')
        data = get_unique_countries(region)
    else:
        region = region.replace('|', '&')
        data = get_unique_cities(region, country)

    return json.dumps(data)


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
    data = TERRORISM_DATA[TERRORISM_DATA['region_txt'] == region]
    data = data[data['country_txt'] == country]
    return data['city'].fillna('NA').unique().tolist()

