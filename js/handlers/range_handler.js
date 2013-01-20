function RangeHandler(el, params) {

	var 
		that 			= this,
		startPosition 	= 0;

	// типо наследование от Fader
	params.extend(this, params);

	// стартовый сдвиг, в зависимости от значения по умолчанию
	startPosition = this.getStartPosition();


	this.element 		= el;											// Текущая кнопка
	this.shifts 		= [this.calc.sprite.h, this.calc.sprite.w];		// Смещение спрайта
	this.totalVals		= this.getTotalVals();							// Считаем общее число спрайтов


	this.activePosition = {												// Стартовая позиция спрайта
		'x' : 0,
		'y' : startPosition * this.shifts[0]
	}; 

	// поставим кнопку по умолчанию
	this.setSlide(this.activePosition);

	// ставим события на кнопку
	this.listen();

	document.ondragstart = function() {
		$(this).css('cursor', 'pointer');
		return false;
	};

};

RangeHandler.prototype = {

	started: 0,				// начало драга


	getStartPosition: function() {
		var startPosition = 0;

		for( 
			var i =  this.getMin(); 
				i <  this.getDefault(); 
				i += 1, startPosition += 1 
		);

		return startPosition;
	},


	listen: function() {
		
		var 
			that = this;

		this.element.hover(function(){
			
			if (!that.started)
				that.setPosition(1);

		}, function() {

			if (!that.started)
				that.setPosition(0);

		});


		this.element.on('mousedown', function(e) {
			
			var startPos = e.pageY;

			that.dragStart(startPos);
			that.setPosition(2);

			that.started = 1;
		});


		$(document).on('mouseup', function() {
			
			that.setPosition(0);

			$(document).off('.drag_range');
			that.started = 0;
		});

	},

	setVal: function() {

	},

	/**
	* установка положения спрайта (позиции)
	* Отсчет начинается с 0
	* @param n 		- номер позиции
	* @param axis	- ось
	*/ 
	setPosition: function(n, axis) {
		axis = axis || 'x';

		if ( n >= this.getTotalVals() || n < 0 ) {
			return;
		}

		if ( 'x' == axis ) {
			this.activePosition.x = this.shifts[1] * n;	
		} else {
			this.activePosition.y = this.shifts[0] * n;
		}

		this.setSlide(this.activePosition);
	},

	// Начало перемещения
	dragStart: function(startPos) {
		var 
			that    = this,
			plus	= startPos - 10,
			minus	= startPos,
			party;

		$(document).on('mousemove.drag_range', function(e) {
			party 	= startPos > e.pageY;

			// тянем вверх
			if (party) {
				if (plus > e.pageY && (plus - 5) < e.pageY ) {
					plus -= 5;
					that.setPosition(that.getStartPosition() + 1, 'y');
					that.setDefault(that.getDefault() + 1);
				}
			} else {
				if (minus < e.pageY) {
					minus += 5;
					that.setPosition(that.getStartPosition() - 1, 'y');
					that.setDefault(that.getDefault() - 1);
				}
			}

		});


	},


	// общая сумма спрайтов
	getTotalVals: function() {
		return Math.ceil(this.calc.img.h / this.shifts[0]);
	},


	// Установка слайда
	setSlide: function(pos) {
		var p = -pos.x + "px -" + pos.y + "px";

		this.element.css({
			'backgroundPosition' : p
		});		
	}
}

function c(cc) {
	console.log(cc);
}