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
			'range' :  new Fader({
				'element' 	: 'range',
				'max' 		: 5,
				'min' 		: -4,
				'default' 	: 1,
				'calc'		: {
					'sprite' 	: { 'h' : 48,  'w' : 42	}, 
					'img' 		: { 'h' : 480, 'w' : 168 }
				}
			}),
			'range1' :  new Fader({
				'element' 	: 'range1',
				'max' 		: 5,
				'min' 		: -4,
				'default' 	: -555,
				'calc'		: {
					'sprite' 	: { 'h' : 48,  'w' : 42	}, 
					'img' 		: { 'h' : 480, 'w' : 168 }
				}
			}),			
			/*
			'button' : new Fader({
				'element' 	: 'button',
				'max' 		: 15,
				'min' 		: -10,
				'default' 	: 55				
			})
			*/
		}
	});


	function Fader(options) {	
		
		this.maxValue 	= options.max;					// установка макс. значения
		this.minValue 	= options.min;					// установка минимального значения
		this.element  	= $('#' + options.element);		// текущий элемент
		this.calc		= options.calc;					// настройки спрайтов

		this.typeElement = this.element.data('type'); 	// тип кнопки

		this.setDefault(options['default']);			// значение по умолчанию
		this.setValue(this.getDefault());	

		return this.getHandler();
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
				obj 	= null,
				handler = this.types[this.typeElement];

			if ( 'function' !== typeof handler ) {
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
		setValue: function(val) {
			this.currValue = parseInt(val);
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
		}
	}

}(window.jQuery);