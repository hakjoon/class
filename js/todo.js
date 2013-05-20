var Todo = window.Todo || {};



Todo.List = function (addForm, itemsForm, bindListeners) {
	this.addForm = document.getElementById(addForm);
	this.itemsForm = document.getElementById(itemsForm);
	if (bindListeners) {
		this.bindListeners();
	}
	console.log(addForm);
};

Todo.List.prototype.bindListeners = function () {
	this.addForm.addEventListener('submit', this.bindAsListener(this.addItem, this), false);
};

Todo.List.prototype.addItem = function (evt) {
	evt.preventDefault();
	var entry = document.getElementById('entry');
	if (entry && entry.value) {
		var item = this.buildItem(entry.value);
	}
	this.itemsForm.appendChild(item);
	item.addEventListener('click', this.bindAsListener(this.complete, this), false);
};

Todo.List.prototype.buildItem = function (entry) {
	var container = this.el('div');
	var label = this.el('label', {
		'class': 'checkbox'
	});
	var input = this.el('input', {
		'type':'checkbox'
	});
	var entryNode = document.createTextNode(entry);
	label.appendChild(input);
	label.appendChild(entryNode);
	container.appendChild(label);
	return container;
	
};

Todo.List.prototype.el = function (name, attrs) {
	var el = document.createElement(name);
	for (var att in attrs) {
		el.setAttribute(att, attrs[att]);
	}
	return el;
};

Todo.List.prototype.has = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

Todo.List.prototype.bindAsListener = function (fn, scope) {
	return function () {
		return fn.apply(scope, arguments);
	};
};

Todo.List.prototype.complete = function (evt) {
	console.log(evt.target.matches('label'));
};

var findPrefixed = function (fn) {
	var vendorPrefixes = ['webkit', 'moz', 'ms', 'o'];
	var el = document.createElement('div');
	for (var i=0; i< vendorPrefixes.length; i++) {
		var prefixed = vendorPrefixes[i] + fn;
		if (el[prefixed]) {
			return el[prefixed];
		}
	}
}

new Todo.List('add-form', 'items-form', true);
