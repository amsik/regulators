	/**
	* Область работы скрипта. 
	* Значения:
	*	0. web - веб
	*	1. air - Adobe AIR
	*
	*	Объекты для записи в файл
	*/ 
	var 
		area 		= 'web',
		targetsConf = {},
		temp 		= null,
		selectStart = false;		// Отмена выделения документа


	var exitsingEvents = "blur focus focusin focusout load resize scroll unload click dblclick " +
						"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
						"change select submit keydown keypress keyup error contextmenu";

	var ev = exitsingEvents.split(" ");

	/**
	* Активность кнопок 
	* Для того, чтобы работала только 1 кнопка 
	*/ 
	$.activity = 0;

	// -------------   Работа с файлами в Adobe AIR  -------------
	function AIRFile() {	

		// Читаем или записываем из файла
		this.fileName = air.File.applicationStorageDirectory.resolvePath('params_buttons1.ini');	

		if ( !this.fileName.exists ) {
			this.writeToFile('');
		}

		var config = this.readFromFile();

		config = this.parseConfig(config);

		// создаем объект из имен кнопок
		for( var i in config ) {

			targetsConf[i] = { 
				'value' 	: config[i]['value'], 
				'activity' 	: config[i]['activity'] 
			};

		}

	}

	AIRFile.prototype = {

		// запись в файл
		writeToFile: function(content, mode) {
			mode = mode || 'WRITE';

			var stream 	= new air.FileStream();
			
			stream.open( this.fileName, air.FileMode[mode] );
			stream.writeMultiByte( content, air.File.systemCharset );
			stream.close();
		},

		// чтение из файла
		readFromFile: function() {
			var content = null;														  
			var stream 	= new air.FileStream();
			
			stream.open( this.fileName, air.FileMode.READ );
			content = stream.readMultiByte( stream.bytesAvailable, air.File.systemCharset );
			stream.close();	

			return content;		
		},

		// разбор конфига на объект
		parseConfig: function (content) {
			var elements, values = {};

			elements = content.split(';');

			for( var i = 0; i < elements.length; i++ ) {

				var 
					elOnce = elements[i].split(":"),
					params;

				if ("" == elOnce[0]) {
					continue;
				}


				params = elOnce[1].split(',');

				values[elOnce[0]] = { 
					'value' 	: params[0], 
					'activity' 	: params[1] 
				};
			}

			return values;
		},

		// перевод объекта в строку для конфига
		toStr: function(obj) {
			var str = '';

			for( var i in obj ) {
				var activity = obj[i].activity == 0 ? 0 : 1;

				str += i + ":" + obj[i].value + "," + activity + ";";
			}

			return str;
		}
	};
	

	if ( 'air' == area ) {
		temp = new AIRFile();
	}


	function Fader(options) {	

		// таймер для записи в файл
		this.toConf 	= null;

		// через сколько записуем
		//this.confTime 	= 4000;
		this.confTime 	= 1000;

		this.change = options['change'] || function() {};

		this.maxValue 	= options.max;					// установка макс. значения
		this.minValue 	= options.min;					// установка минимального значения

		this.element  	= ('object' == typeof options.element) 
							? options.element
							: $('#' + options.element);		

		this.calc		= options.calc;					// настройки спрайтов

		this.remember   = options.remember === 0 ? 0 : 1;

		this.shifts 	 = [this.calc.sprite.h, this.calc.sprite.w];		// Смещение спрайта
		this.typeElement = this.element.data('type'); 						// тип кнопки

		var
			conf 			= targetsConf[options.element] || {},
			defaultValue 	= conf['value'] || options['default'];


		if ( options.activity === 0 ) {
			this.activity = 0;	
		} else {
			this.activity = conf.activity == 0 ? 0 : 1;
		}


		this['callback'] = options['callback'] || function() {};
		this['event'] 	 = options['event'];


		this.setDispatch();

		// значение по умолчанию
		this.setDefault(defaultValue);			
		this.setValue(this.getDefault(), 1);	

		return this.getHandler();
	}


	Fader.prototype = {

		/**
		* Функции для разных типов кнопок. 
		* Устанавливаются в аттрибуте "data-type"
		*/
		types: {
			'range' 	: RangeHandler,			// Кнопка типа "Range"  (регулятор)
			'button' 	: ButtonHandler,		// Кнопка типа "Button" (микрик)
			'checkbox'	: CheckBoxHandler,		// Кнопка типа "Range"  (с фиксацией)
			'radio'		: RadioHandler			// Кнопка типа "Range"  (переключатель)
		},

		getHandler: function(that) {
			var 
				obj 	= null,
				handler = this.types[this.typeElement];

			if ( 'function' !== typeof handler ) {
				air.trace(1);
				return;
			}

			return new handler(this.element, this);
		},


		setDispatch: function() {
			if ( this['event'] && typeof this['callback'] == 'function' ) {
				var t = this;

				this.change = function() {
					t.element.trigger(t['event']);

					t['callback'].apply(t);
				};
			}

		},


		/**
		* Установка максимального значения
		*/
		setMax: function(val) {
			this.maxValue = parseInt(val);
		},

		/**
		* Возвращает максимальное значение
		* @return integer
		*/
		getMax: function() {
			return this.maxValue;
		},


		/**
		* Установка минимального значения
		*/
		setMin: function(val) {
			this.minValue = parseInt(val);
		},

		/**
		* Минимальное значение
		* @return integer
		*/
		getMin: function() {
			return this.minValue;
		},


		/**
		* Возвращает текущее значение
		* @return integer
		*/
		getValue: function() {
			return this.currValue;
		},

		/**
		* Установка значения
		* @param val  - значение
		* @param act1 - активность по умолчанию
		* @param keyReal - запускать ф-ю установки знач. для станд. инпута
		*/
		setValue: function(val, act1, keyReal) {
			this.currValue = parseInt(val);

			this.change.apply(this);

			keyReal = keyReal || false;

			if ( 'object' == typeof this.realElement && !keyReal ) {
				this.setRealVal();
			}

			if ( 'air' != area || 0 == this.remember) {
				return;
			}

			var 
				key = this.element.attr('id'),
				act = act1 == 1 ? 1 : (this.isActive() ? 1 : 0);

			clearTimeout(this.toConf);

			if (typeof targetsConf[key] == 'undefined') {
				targetsConf[key] = {
					'value'    : this.currValue,
					'activity' : act ? 1 : 0
				};
			}

			this.toConf = setTimeout(function() {

				targetsConf[key]['value'] 		= val;
				targetsConf[key]['activity'] 	= targetsConf[key]['activity'] || act;

				var config = temp.toStr(targetsConf);

				temp.writeToFile(config);

			}, this.confTime);			
		},


		/**
		* Значение по умолчанию
		* @return integer
		*/
		getDefault: function() {
			return this.defaultValue;
		},		

		/**
		* Установка значения по умолчанию
		*/
		setDefault: function(val) {
			val = parseInt(val);

			this.defaultValue = this.checkVal(val);
		},


		/**
		* Объединяем 2 объекта
		* @return Object
		*/
		extend: function (a, b) {
			for ( var prop in b ) {
				if ( b[prop] === undefined ) {
					delete a[prop];
				} else {
					a[prop] = b[prop];
				}
			}

			return a;
		},


		/**
		* Проверка значения. 
		* Чтобы не заходило за границы максимального и минимального
		* @return integer
		*/
		checkVal: function(val) {

			val =  
				( val < this.minValue || val > this.maxValue || isNaN(val) )	
				? ( val > this.getMax() ? this.getMax() : this.getMin() )
				: val;

			return val;
		},


		// Установка слайда
		setSlide: function(pos) {
			var p = -pos.x + "px -" + pos.y + "px";

			this.element.css({
				'backgroundPosition' : p
			});		
		},


		/**
		* установка положения спрайта (позиции)
		* Отсчет начинается с 0
		* @param n 		- номер позиции
		* @param axis	- ось
		*/ 
		setPosition: function(n, axis) {
			var tltVals;	

			axis 	= axis || 'x';
			tltVals = ( 'x' == axis ) ? 'w' : 'h';

			if ( n >= this.getTotalVals(tltVals) || n < 0 ) {
				return;
			}

			if ( 'x' == axis ) {
				this.activePosition.x = this.shifts[1] * n;	
			} else {
				this.activePosition.y = this.shifts[0] * n;
			}

			this.setSlide(this.activePosition);
		},


		// получание стартовой позиции
		getStartPosition: function(type) {

			type = type || 'all';

			var 
				startPosition 	= 0,
				value 			= type == 'all' ? this.getValue() : this.getMax();

			for( 
				var i =  this.getMin(); 
					i <  value; 
					i += 1, startPosition += 1 
			);

			return startPosition;
		},



		// общая сумма спрайтов
		getTotalVals: function(type) {
			type = type || 'h';

			if ( 'h' == type ) {
				return Math.ceil(this.calc.img.h / this.shifts[0]);	
			} else {
				return Math.ceil(this.calc.img.w / this.shifts[1]);	
			}

		},

		// получение св-ва Offset
		getOffset: function(event, what) {

			what = what || 'all';

			var offset = {
				'x' : (typeof event.offsetX != 'undefined') ? event.offsetX : event.originalEvent.layerX,
				'y' : (typeof event.offsetY != 'undefined') ? event.offsetY : event.originalEvent.layerY
			}

			return 'all' == what ? offset : offset[what];

		},

	};


(function($) {

	// настройки кнопок
	$.faderSettings = {};

	var exitsingEvents = "blur focus focusin focusout load resize scroll unload click dblclick " +
						"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
						"change select submit keydown keypress keyup error contextmenu";

	var ev = exitsingEvents.split(" ");


	$.fn.KFaders = function(params) {

		params['element'] = this;

		var key = this.attr('id');

		$.faderSettings[key] = {};
		$.faderSettings[key]['params'] 	 = params;
		$.faderSettings[key]['dispatch'] = {};

		var callback, assigment, actParam;

		function bindEvent(eventName, fn) {
			this.bind(eventName + ".dispatch", fn);
		};

		for ( var i in params['dispatch'] ) {

			actParam = params['dispatch'][i];
			callback = actParam['callback'] || function() {};

			$.faderSettings[key]['dispatch'][i] = callback;

			assigment = ('undefined' == typeof actParam['assigment'] || actParam['assigment'] == true) ? true : false;

			if (assigment && 0 <= ev.indexOf(i)) {
				bindEvent.call(this, i, callback);
			}

		}

		return this.each(function() {
			$.faderSettings[key]['handler'] = new Fader(params);

			if ( $(this).data('type') == 'radio' ) {
				var h = $.faderSettings[key]['handler'];

				$(this).find(':radio').on('change.change_radio', function() {
					h.setValue( $(this).val(), 0, true );
				});
			}
		});

	};


	$.fn.KDispatch = function(event) {

		var 
			key 			= this.attr('id'),
			currentObj		= $.faderSettings[key];


		// стандартные методы кнопки
		var 
			sEvents  = ['lock', 'isActive', 'unlock'],	
			sMethods = {
				'lock' 		: 'lockButton',
				'isActive' 	: 'isActive',
				'unlock' 	: 'unlockButton'
			} 

		// запускаем стандартные методы
		if ( -1 != sEvents.indexOf(event) ) {
			var actEvent = currentObj.handler[sMethods[event]];			
			return actEvent.call(currentObj.handler);
		}

		// вызываем добавленный обработчик
		if ( 0 <= ev.indexOf(event) ) {
			this.bind(event, currentObj['dispatch'][event]);
			return this;
			
		// созданное событие	
		} else if (currentObj['dispatch'][event]) {						
			return currentObj['dispatch'][event].apply(
				currentObj.handler
			);
		}

		return this;

	}


})(jQuery);



function _c(log) {
	console.log(log);
}