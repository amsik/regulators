!function($) {
	"use strict"; 

	/**
	* Область работы скрипта. 
	* Значения:
	*	0. web - веб
	*	1. air - Adobe AIR
	*/ 
	var area = 'web';

	$(document).on('ready', function(){
		$.btns = {
			'fader' :  new Fader({
				'element' 	: 'range',
				'max' 		: 30,
				'min' 		: -10,
				'default' 	: 55
			}),

			'button' : new Fader({
				'element' 	: 'button',
				'max' 		: 15,
				'min' 		: -10,
				'default' 	: 55				
			})
		}
	});


	function Fader(options) {	
		
		this.maxValue = options.max;
		this.minValue = options.min;
		this.element  = $('#' + options.element);

		this.typeElement = this.element.data('type'); 

		this.setDefault(options.default);

		var handler = this.getHandler();

		handler.fafa();

		console.log(handler);
		//handler.fafa();
	}


	Fader.prototype = {

		/**
		* Функции для разных типов кнопок. 
		* Устанавливаются в аттрибуте "data-type"
		*/
		types: {
			'range' 	: RangeHandler,			// Кнопка типа "Range" (регулятор)
			'button' 	: ButtonHandler,		// Кнопка типа "Button" (микрик)
			'checkbox'	: CheckBoxHandler,		// Кнопка типа "Range" (с фиксацией)
			'radio'		: RadioHandler			// Кнопка типа "Range" (переключатель)
		},

		getHandler: function(that) {
			var 
				obj		= null,
				handler = this.types[this.typeElement];

			if ( 'function' !== typeof handler ) {
				return;
			}

			var obj = new handler;

			return this.extend(obj,{
				'element' 	: this.element,
				'max' 		: this.getMax(),
				'min' 		: this.getMin(),
				'default' 	: this.defaultValue,
				'area'		: area || 'web'
			});
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

			this.defaultValue = 
				( val < this.minValue || val > this.maxValue || isNaN(val) )	
				? Math.ceil((this.getMin() + this.getMax()) / 2)
				: val;
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
		}

	}


}(window.jQuery);