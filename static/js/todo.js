

;(function (window) {

window.Todo = window.Todo || {};

var has = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

var bindAsListener = function (fn, scope) {
	return function () {
		return fn.apply(scope, arguments);
	};
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
	return null;
};
var matchFn = findPrefixed('MatchesSelector');
var matches = function(element, selector) {
	return matchFn.call(element, selector);
};

var el = function (name, attrs) {
	var el = document.createElement(name);
	for (var att in attrs) {
		el.setAttribute(att, attrs[att]);
	}
	return el;
};

var txt = function(text) {
	return document.createTextNode(text);
};

window.ajax = function (options) {
	var request = function () {
		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
			return new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 8 and older
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		// I give up
		return false;
	};
	
	var httpRequest = request();
	var process = function (process) {
		var httpRequest = process.currentTarget;
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				console.log(httpRequest.responseText);
			} else {
				alert('There was a problem with the request.');
			}
		}
	};

	httpRequest.onreadystatechange = process;
    httpRequest.open('GET', '/');
    httpRequest.send();
};

var List = function (addForm, itemsForm, bindListeners) {
	this.addForm = document.getElementById(addForm);
	this.itemsForm = document.getElementById(itemsForm);
	if (bindListeners) {
		this.bindListeners();
	}
};

List.prototype.bindListeners = function () {
	this.addForm.addEventListener('submit', bindAsListener(this.addItem, this), false);
	var inputs = document.getElementsByTagName('input');
	console.log(inputs.length);
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.type == 'checkbox' && !input.checked) {
			input.addEventListener('click', bindAsListener(this.complete, this), false);
		}
	}
};

List.prototype.addItem = function (evt) {
	evt.preventDefault();
	var entry = document.getElementById('entry');
	if (entry && entry.value) {
		var item = this.buildItem(entry.value);
	}
	this.itemsForm.appendChild(item);
	item.addEventListener('click', bindAsListener(this.complete, this), false);
};

List.prototype.buildItem = function (entry) {
	var container = el('div');
	var label = el('label', {
		'class': 'checkbox'
	});
	var input = el('input', {
		'type':'checkbox'
	});
	var entryNode = txt(entry);
	label.appendChild(input);
	label.appendChild(entryNode);
	container.appendChild(label);
	return container;
	
};

List.prototype.complete = function (evt) {
	var input = evt.target;
	var label = input.parentNode;
	var new_label = label;
	var text = new_label.textContent;
	var strike = el('strike');
	strike.appendChild(txt(text));
	new_label.removeChild(label.lastChild);
	new_label.appendChild(strike);
	var complete = document.getElementById('entries-complete');
	complete.appendChild(new_label);
	//label.parentNode.removeChild(label);
	var pending = document.getElementById('entries-pending');
	console.log(pending.children.length);
	if (pending.children.length < 2) {
		pending.style.display = 'none';
	}
	
};


Todo.List = List;

})(window);


new Todo.List('add-form', 'items-form', true);
document.body.setAttribute('class', 'js');
