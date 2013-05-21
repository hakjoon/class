import os
import shelve
import itertools
from time import sleep
from bottle import Bottle, run, template, static_file, request
from bottle import redirect


app_path = os.path.dirname(os.path.realpath(__file__))
shelf_file = os.path.join(app_path, 'shelf')
static_root = os.path.join(app_path, 'static')

app = Bottle()

@app.get('/')
def index():
    db = shelve.open(shelf_file)
    entries = dict(db)
    entry_list = EntryList(entries)
    db.close()
    success = u'Congratulations! You have things to do.'
    return template('index.html', entries=entry_list, success=success, has_entries=True)

@app.post('/')
def add_entry():
    entry = request.forms.entry
    if not entry:
        error = u'Blank entries are not supported'
        return template('index.html', error=error)
    db = shelve.open(shelf_file)
    new_entry = Entry(entry)
    db[id] = new_entry
    db.close()
    sleep(5)
    redirect('/')

@app.post('/complete')
def complete():
    task_ids = request.forms.getall('task')
    db = shelve.open(shelf_file)
    for id in task_ids:
        tsk = db[id]
        tsk.complete = True
        db[id] = tsk
    db.close()
    sleep(5)
    redirect('/')

@app.route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root=static_root)

class EntryList(object):
    def __init__(self, entries):
        self.entries = entries
        self.groups = {}
        grouped = itertools.groupby(entries.values(), lambda x: x.status)
        for k, g in grouped:
            self.groups[k] = list(g)

    @property
    def pending(self):
        return self.groups.get('Pending', [])

    @property
    def complete(self):
        return self.groups.get('Complete', [])

    def __len__(self):
        return len(self.entries)

class Entry(object):
    complete = False
    message = u''
    complete = False

    @property
    def status(self):
        if self.complete:
            return u'Complete'
        else:
            return u'Pending'

    def __init__(self, text, id):
        self.message = text
    
    @property
    def id(self):
        return "-".join(self.message.split())
        
    def __unicode__(self):
        return self.message


run(app, host='localhost', port=8080, debug=True, reloader=True)
