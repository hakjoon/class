(function (global, d) {
	var Util = global.Util = global.Util || {};

	Util.$ = function (k) { return d.getElementById.call(d, k); };
	Util.$A = function (arrayLike) {
		return Array.prototype.slice.call(arrayLike, 0);
	};

	Util.has = function (obj, prop) {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	};

	Util.bindAsListener = function (fn, scope) {
		return function () {
			return fn.apply(scope, arguments);
		};
	};

	Util.el = function (name, attrs) {
		var el = d.createElement(name);
		for (var att in attrs) {
			if (Object.prototype.hasOwnProperty.call(attrs, att)) {
				el.setAttribute(att, attrs[att]);
			}
		}
		return el;
	};

	var findPrefixed = function (fn) {
		var vendorPrefixes = ['webkit', 'moz', 'ms', 'o'];
		var e = Util.el('div');
		for (var i=0; i< vendorPrefixes.length; i++) {
			var prefixed = vendorPrefixes[i] + fn;
			if (e[prefixed]) {
				return e[prefixed];
			}
		}
		return null;
	};

	Util.matches = function(element, selector) {
		var matchFn = findPrefixed('MatchesSelector');
		return matchFn.call(element, selector);
	};

	Util.txt = function(text) {
		return d.createTextNode(text);
	};

	Util.addClass = function (element, theClass) {
		var classes = element.getAttribute('class').split(" ");
		classes.concat(theClass);
		element.setAttribute('class', classes.join(" "));
	};

	Util.removeClass = function (element, theClass) {
		var classes = element.getAttribute('class').split(" ");
		var index = classes.indexOf(theClass);
		if (index !== -1) {
			classes.splice(index, 1);
		}
		element.setAttribute('class', classes.join(" "));
	};

	Util.extend = function(defaults, overrides) {
		if (!overrides) {
			return defaults;
		}
		for (var property in overrides) {
			defaults[property] = overrides[property];
		}
		return defaults;
	};

	Util.cloneObject = function (object) {
		return Util.extend({}, object);
	};

	Util.inString = function (str, match) {
		var includes = str.indexOf(match);
		return includes !== -1;
	};

	Util.ajax = function (url, kwargs) {
		var defaults = {
			method: 'get',
			success: function () {},
			error: function () {}
		};
		var options = Util.extend(defaults, kwargs);
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
})(window, document);
