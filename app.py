import os
from bottle import Bottle, run, template, static_file


app_path = os.path.dirname(os.path.realpath(__file__))

app = Bottle()

@app.get('/')
def index():
    return template('index.html')

@app.post('/')
def submit_entry():
    return 'A Post'

@app.route('/static/<filename:path>')
def send_static(filename):
    static_root = os.path.join(app_path, 'static')
    return static_file(filename, root=static_root)

run(app, host='localhost', port=8080, debug=True, reloader=True)