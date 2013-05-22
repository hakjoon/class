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
    print entries
    entry_list = EntryList(entries)
    print entry_list.complete
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
    id = str(len(db))
    new_entry = Entry(entry, id)
    db[new_entry.id] = new_entry
    db.close()
    #sleep(5)
    if request.query.ajax:
        return new_entry.id
    else:
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
    #sleep(5)
    redirect('/')

@app.route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root=static_root)

class EntryList(object):
    def __init__(self, entries):
        self.entries = entries
        self.groups = {
            'pending':[v for v in entries.values() if not v.complete],
            'complete':[v for v in entries.values() if v.complete]
        }

    @property
    def pending(self):
        lst = self.groups.get('pending', [])
        lst = sorted(lst, key=lambda x: x.id)
        lst.reverse()
        return lst

    @property
    def complete(self):
        lst = self.groups.get('complete', [])
        lst = sorted(lst, key=lambda x: x.id)
        lst.reverse()
        return lst

    def __len__(self):
        return len(self.entries)

class Entry(object):
    complete = False
    message = u''
    complete = False
    id = None

    def __init__(self, text, id):
        self.message = text
        self.id = id

    @property
    def slug(self):
        return "-".join(self.message.split())

    def __unicode__(self):
        return self.message

    def __repr__(self):
        return self.message


run(app, host='localhost', port=8080, debug=True, reloader=True)
