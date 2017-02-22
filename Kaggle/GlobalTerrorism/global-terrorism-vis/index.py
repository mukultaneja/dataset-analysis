
import os
import json
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options
import tornado.autoreload
from tornado.options import define, options

import custom_handlers

define('port', default=8888, help="describes on which port server is running")


def get_page_handlers():
    '''
        Function combines all the page handlers and retunred
        whenever requires
    '''
    return [(r'/', IndexHandler), (r'/data', FilteredData),
            (r'/options', OptionHandler)]


class IndexHandler(tornado.web.RequestHandler):
    '''
    Pass
    '''

    def get(self):
        '''
        Function which handles get request for index page.
        '''
        self.render('index.html')

    def data_received(self, message):
        '''
        Overridden data_received function
        '''
        pass


class FilteredData(tornado.web.RequestHandler):
    '''
    Pass
    '''

    def get(self):
        '''
        Function which handles get request for data handler.
        '''
        args = self.request_handler()
        data = custom_handlers.get_filtered_data(args)
        if len(data) > 0:
            self.write(data.to_json(orient='records'))
        else:
            self.write(json.dumps({'error': 'No Data is Available'}))

    def data_received(self, message):
        '''
            Overridden data_received function
        '''
        pass

    def request_handler(self):
        '''
            Function to handle request and return parameters
            passed through requests
        '''
        args = dict()
        args['year'] = self.get_argument('year', '1970-1979')
        args['month'] = self.get_argument('month', 'all')
        args['country'] = self.get_argument('country', 'all')
        args['region'] = self.get_argument('region', 'all')
        return args


class OptionHandler(tornado.web.RequestHandler):
    '''
    Class:
    '''

    def get(self):
        '''
        Function :
        '''
        col = self.request_handler()
        if col == 'year':
            data = custom_handlers.get_unique_years()
        elif col == 'country':
            data = custom_handlers.get_unique_country()
        elif col == 'region':
            country = self.get_argument('country')
            data = custom_handlers.get_unique_region(country)
        data = json.dumps(data)
        self.write(data)

    def data_received(self, message):
        '''
            Overridden data_received function
        '''
        pass

    def request_handler(self):
        '''
        Function:
        '''
        col = self.get_argument('col')
        return col


if __name__ == '__main__':
    tornado.options.parse_command_line()

    for f in os.listdir('.'):
        if os.path.isfile(f):
            tornado.autoreload.watch(f)

    APP = tornado.web.Application(
        handlers=get_page_handlers(),
        template_path=os.path.join(os.path.dirname('__FILE__')),
        static_path=os.path.join(os.path.dirname('__FILE__'), 'static'),
        autoreload=True)

    HTTPSERVER = tornado.httpserver.HTTPServer(APP)
    HTTPSERVER.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
