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
		this.confTime 	= 500;

		this.maxValue 	= options.max;					// установка макс. значения
		this.minValue 	= options.min;					// установка минимального значения
		this.element  	= $('#' + options.element);		// текущий элемент
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
		*/
		setValue: function(val, act1) {
			this.currValue = parseInt(val);

			if ( 'object' == typeof this.realElement ) {
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
		getStartPosition: function() {
			var startPosition = 0;

			for( 
				var i =  this.getMin(); 
					i <  this.getValue(); 
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

