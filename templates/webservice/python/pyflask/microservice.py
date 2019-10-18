from flask import Flask, request
from flask_restful import Resource, Api

# Flask Restful
app = Flask(__name__)
api = Api(app)

# root path of webservice. Or pull from config file?
root = '/'

# Python webservice template
# Template Version 0.1a
# Python3 & Flask/FlaskRestful skeleton with jenkins, docker, and DART infrastructure tie-ins
#
# Flask info:
# https://flask.palletsprojects.com/en/1.1.x/tutorial/
# https://github.com/pallets/flask/tree/master/examples/tutorial

##
## =======================================================================================
## standard handlers
## 

class AutoSuccess(Resource):
    def get(Self):
        return {"status":"success", "message":"auto-succeed"}


class AutoFail(Resource):
    def get(Self):
        return {"status":"fail", "message":"auto-fail"}

##
## =======================================================================================
## helper funcs
## 

def combine_url_safe(one, two):
    output = one
    if !output.endswith('/'):
        output += '/'
    output += two.lstrip('/')
    return output

# helper func to add a webservice endpoint to flask
def add_route(path, handler_class):
    api.add_resource(combine_url_safe(root, path), handler_class)

   
##
## =======================================================================================
## Set up webservice endpoints
##        

# DART standards
add_route('/', RootHandler)

add_route('/health', AutoSuccess)
add_route('/health/succeed', AutoSuccess)
add_route('/health/fail', AutoFail)
add_route('/test', AutoSuccess)
add_route('/admin', AutoSuccess)

# Custom endpoints (or call your initializer from __main__ section below)


## 
## =======================================================================================
## Main Webservice initialization
## 
if __name__ == '__main__':
    # perform other initialization here

    # app.run documentation can be found here- http://flask.pocoo.org/docs/1.0/api/#flask.Flask.run
    # other params: use_reloader=False - if ws reloading is disrupting things
    #               debug=True / debug=False
    # todo: move to standard yaml config file
    app.run(host='0.0.0.0', port=2048, debug=True)  
