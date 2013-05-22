

(function (global, d) {

var $ = function (k) { return d.getElementById.call(d, k); };
var $A = function (arrayLike) {
	return Array.prototype.slice.call(arrayLike, 0);
};

var has = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

var bindAsListener = function (fn, scope) {
	return function () {
		return fn.apply(scope, arguments);
	};
};

var el = function (name, attrs) {
	var el = d.createElement(name);
	for (var att in attrs) {
		el.setAttribute(att, attrs[att]);
	}
	return el;
};

var findPrefixed = function (fn) {
	var vendorPrefixes = ['webkit', 'moz', 'ms', 'o'];
	var e = el('div');
	for (var i=0; i< vendorPrefixes.length; i++) {
		var prefixed = vendorPrefixes[i] + fn;
		if (e[prefixed]) {
			return e[prefixed];
		}
	}
	return null;
};

var matchFn = findPrefixed('MatchesSelector');
var matches = function(element, selector) {
	return matchFn.call(element, selector);
};

var txt = function(text) {
	return d.createTextNode(text);
};

var addClass = function (element, theClass) {
	var classes = element.getAttribute('class').split(" ");
	classes.concat(theClass);
	element.setAttribute('class', classes.join(" "));
};

var removeClass = function (element, theClass) {
	var classes = element.getAttribute('class').split(" ");
	var index = classes.indexOf(theClass);
	if (index != -1) {
		classes.splice(index, 1);
	}
	element.setAttribute('class', classes.join(" "));
};

var extend = function(defaults, overrides) {
	if (!overrides) {
		return defaults;
	}
	for (var property in overrides) {
		defaults[property] = overrides[property];
	}
	return defaults;
};

var cloneObject = function (object) {
	return extend({}, object);
};

var inString = function (str, match) {
	var includes = str.indexOf(match);
	return includes != -1;
};

var ajax = function (url, kwargs) {
	var defaults = {
		method: 'get',
		success: function () {},
		error: function () {}
	};
	options = extend(defaults, kwargs);
	var method = options.method.toLowerCase();
	var params = options.params;
	var request = function () {
		if (global.XMLHttpRequest) { // Mozilla, Safari, ...
			return new XMLHttpRequest();
		} else if (global.ActiveXObject) { // IE 8 and older
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		// I give up
		return false;
	};
	
	var httpRequest = request();
	if (params && method === 'get') {
		url += (inString(url, '?') ? '&' : '?') + params;
	}
	var body = (method === 'post') ? params : null;

	var process = function (process) {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				options.success(httpRequest);
			} else {
				options.error(httpRequest);
			}
			httpRequest.onreadystatechange = function () {};
		}
	};
	
	httpRequest.onreadystatechange = process;
    httpRequest.open(options.method.toUpperCase(), url);
    httpRequest.send(body);
};


// -- TODO List 
var todo = global.Todo = global.Todo || {};

var List = function (addForm, itemsForm, bindListeners) {
	this.addForm = document.getElementById(addForm);
	this.itemsForm = document.getElementById(itemsForm);
	this.itemsHolder = document.getElementById('entry-well');
	this.emptyMessage = document.getElementById('empty-message');
	if (bindListeners) {
		this.bindListeners();
		document.body.setAttribute('class', 'js');
	}
	
};

List.prototype.bindListeners = function () {
	this.addForm.addEventListener('submit', bindAsListener(this.addItem, this), false);
	var inputs = document.getElementsByTagName('input');
	$A(inputs).forEach(function (input, i, arr) {
		if (input.type == 'checkbox' && !input.checked) {
			input.addEventListener('click', bindAsListener(this.complete, this), false);
		}
	}, this);
};

List.prototype.addItem = function (evt) {
	evt.preventDefault();
	var form = evt.target
	var entry = document.getElementById('entry');
	if (entry && entry.value) {
		var item = this.buildItem(entry.value);
	}
	var fieldset = this.itemsForm.children[0];
	fieldset.insertBefore(item, fieldset.firstChild);
	item.addEventListener('click', bindAsListener(this.complete, this), false);
	form.reset();
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
	ajax('/?ajax=True', {
		params:'entry=' + entry,
		method: 'post',
		success: function (response) {
			input.setAttribute('value', response.responseText);
		}
	});
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
	new_label.parentNode.parentNode.appendChild(new_label);
	ajax('/complete', {
		params: input.name + '=' + input.value,
		method:'post'
	});
};


todo.List = List;

})(window, document);


new Todo.List('add-form', 'items-form', true);

