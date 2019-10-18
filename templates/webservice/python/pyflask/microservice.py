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
    def get(self):
        return {"status":"success", "message":"auto-succeed"}


class AutoFail(Resource):
    def get(self):
        return {"status":"fail", "message":"auto-fail"}
        
class AutoEcho(Resource):
    def get(self):
        return {"status":"success", "message":"POST to endpoint to receive your message back"}
    def post(self):
        return {"status":"success", "message":request.get_data().decode('utf-8')}

class DefaultHandler(Resource):
    def get(self):
        return {"status":"success", "message":"auto-succeed", "details": "need real server status details as appropriate"}

##
## =======================================================================================
## helper funcs
## 

def combine_url_safe(one, two):
    output = one
    if not output.endswith('/'):
        output += '/'
    output += two.lstrip('/')
    return output

   
##
## =======================================================================================
## Set up webservice endpoints
##        

# DART standard infrastructure endpoints: admin, health, test integration points
# note: for real REST pattern, flask errors if same class is used for multiple resource definitions. 
#       Assign a custom endpoint="unique-name" value to work around it if appropriate.
api.add_resource(AutoSuccess, combine_url_safe(root, '/health'), endpoint="health")
api.add_resource(AutoSuccess, combine_url_safe(root, '/health/succeed'))
api.add_resource(AutoFail,    combine_url_safe(root, '/health/fail'))
api.add_resource(AutoSuccess, combine_url_safe(root, '/test'), endpoint="test")
api.add_resource(AutoSuccess, combine_url_safe(root, '/admin'), endpoint="admin")
api.add_resource(AutoEcho,    combine_url_safe(root, '/admin/echo'))

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



# todo: setup standard config file pattern (yaml, I think)
# todo: build in db libs to the template? Or is that a different template?
# todo: metrics integration
# todo: text translation integration
# todo: auth/security pattern