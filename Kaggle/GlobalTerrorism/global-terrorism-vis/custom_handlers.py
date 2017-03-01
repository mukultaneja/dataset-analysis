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


def get_sunburst_bulletchart_data(kwargs):
    '''
    Function:
    '''
    data = TERRORISM_DATA
    year = int(kwargs['year'])
    month = kwargs['month']
    region = kwargs['region']
    country = kwargs['country']
    checktype = kwargs['check']
    key = 'iyear'

    if year and month and region and country:
        data = data[data['iyear'] == year]
        data = data[data['month'] == month]
        data = data[data['region_txt'] == region]
        data = data[data['country_txt'] == country]
        key = 'city'
    elif year and month and region:
        data = data[data['iyear'] == year]
        data = data[data['month'] == month]
        data = data[data['region_txt'] == region]
        data = data[data['country_txt'] == country]
        key = 'country_txt'
    elif year and month:
        data = data[data['iyear'] == year]
        data = data[data['month'] == month]
        data = data[data['region_txt'] == region]
        key = 'region_txt'
    else:
        data = data[data['iyear'] == year]
        data = data[data['month'] == month]
        key = 'month'

    if checktype == 'success':
        data = data[[key, 'status', 'success']]

        data = pd.pivot_table(data, index=[key],
                              columns=['status'],
                              aggfunc=np.size).fillna(0)

        data['total'] = data['success']['successful'] + \
            data['success']['unsuccessful']

        data = pd.DataFrame([data.success.successful,
                             data.total]).transpose().reset_index()
    else:
        data = data[[key, 'suicidestatus', 'suicide']]

        data = pd.pivot_table(data, index=[key],
                              columns=['suicidestatus'],
                              aggfunc=np.size).fillna(0)

        data['total'] = data['suicide'][
            'suicide'] + data['suicide']['nosuicide']

        data = pd.DataFrame([data.suicide.suicide,
                             data.total]).transpose().reset_index()

    data.columns = ['iyear', 'measure', 'total']

    return data


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


def get_tree_map_data(kwargs):
    '''
    Function:
    '''
    year = int(kwargs['year'])
    data = TERRORISM_DATA[TERRORISM_DATA['iyear'] == year]
    data = TERRORISM_DATA
    return pd.pivot_table(data, index=['iyear'],
                          columns=[kwargs['col']],
                          values=['success', 'suicide'],
                          aggfunc=np.sum)


def get_bullet_chart_data(kwargs):
    '''
    Function:
    '''
    data = TERRORISM_DATA
    years = kwargs['year'].split('-')
    st_year = int(years[0])
    en_year = int(years[1])

    data = data[(data['iyear'] >= st_year) & (data['iyear'] <= en_year)]
    data = data[data['region_txt'] == kwargs['region']]

    if kwargs['country'] != 'all':
        data = data[data['country_txt'] == kwargs['country']]

    if kwargs['city'] != 'all':
        data = data[data['city'] == kwargs['city']]

    data = data[(data['iyear'] >= st_year) & (data['iyear'] <= en_year)]

    if kwargs['check'] == 'success':
        data = data[['iyear', 'status', 'success']]

        data = pd.pivot_table(data, index=['iyear'],
                              columns=['status'],
                              aggfunc=np.size).fillna(0)

        data['total'] = data['success']['successful'] + \
            data['success']['unsuccessful']

        data = pd.DataFrame([data.success.successful,
                             data.total]).transpose().reset_index()
    else:
        data = data[['iyear', 'suicidestatus', 'suicide']]

        data = pd.pivot_table(data, index=['iyear'],
                              columns=['suicidestatus'],
                              aggfunc=np.size).fillna(0)

        data['total'] = data['suicide'][
            'suicide'] + data['suicide']['nosuicide']

        data = pd.DataFrame([data.suicide.suicide,
                             data.total]).transpose().reset_index()

    data.columns = ['iyear', 'measure', 'total']

    return data
