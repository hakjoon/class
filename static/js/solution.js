

(function (global, d) {

// -- TODO List 
var todo = global.Todo = global.Todo || {};
var util = global.Util;

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
	this.addForm.addEventListener('submit', util.bindAsListener(this.addItem, this), false);
	var inputs = document.getElementsByTagName('input');
	util.$A(inputs).forEach(function (input, i, arr) {
		if (input.type == 'checkbox' && !input.checked) {
			input.addEventListener('click', util.bindAsListener(this.complete, this), false);
		}
	}, this);
};

List.prototype.addItem = function (evt) {
	evt.preventDefault();
	var item, form = evt.target;
	var entry = document.getElementById('entry');
	if (entry && entry.value) {
		item = this.buildItem(entry.value);
	}
	var fieldset = this.itemsForm.children[0];
	fieldset.insertBefore(item, fieldset.firstChild);
	item.addEventListener('click', util.bindAsListener(this.complete, this), false);
	form.reset();
};

List.prototype.buildItem = function (entry) {
	var container = util.el('div');
	var label = util.el('label', {
		'class': 'checkbox'
	});
	var input = util.el('input', {
		'type':'checkbox'
	});
	var entryNode = util.txt(entry);
	label.appendChild(input);
	label.appendChild(entryNode);
	container.appendChild(label);
	util.ajax('/?ajax=True', {
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
	var strike = util.el('strike');
	strike.appendChild(util.txt(text));
	new_label.removeChild(label.lastChild);
	new_label.appendChild(strike);
	new_label.parentNode.parentNode.appendChild(new_label);
	util.ajax('/complete', {
		params: input.name + '=' + input.value,
		method:'post'
	});
};


todo.List = List;

})(window, document);


new Todo.List('add-form', 'items-form', true);

