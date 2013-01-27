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

	this.step 			= 5;											// шаг для счетчика

	this.activePosition = {												// Стартовая позиция спрайта
		'x' : 0,
		'y' : startPosition * this.shifts[0]
	}; 

	// поставим кнопку по умолчанию
	this.setSlide(this.activePosition);

	// ставим события на кнопку
	this.listen();
};

RangeHandler.prototype = {

	started		 : 0,				// начало драга
	hovered		 : 0,				// наведен
	timer		 : null,
	activeButton : true,


	getStartPosition: function() {
		var startPosition = 0;

		for( 
			var i =  this.getMin(); 
				i <  this.getValue(); 
				i += 1, startPosition += 1 
		);

		return startPosition;
	},


	listen: function() {
		
		var 
			that 		= this,
			startPos 	= 0;

		this.element.on('mousewheel.range', function(e, delta){
			e.preventDefault();

			// чистим дельту для аира
			delta = ( delta >= 1 ) ? 1 : -1;
			
			that.setPosition(2);
			that.setVal(delta);

			if ( typeof that.timer != 'number' ) {
				that.timer = setTimeout(function(){

					if (0 == that.hovered) {
						return;
					}

					that.setPosition(1);
					that.timer = null;
				}, 1000);
			}
		});

		this.element.hover(function(){
			
			if (!that.started) {
				that.setPosition(1);
			}
				
			that.hovered = 1;

		}, function() {

			if (!that.started) {
				that.setPosition(0);
			}

			that.hovered 	= 0;
			that.timer 		= null;
		});


		this.element.on('mousedown.range', function(e) {
			
			startPos 		= e.pageY;
			that.started 	= 1;

			that.dragStart(startPos);
			that.setPosition(2);
		});

		$(document).on('mouseup.range', function(e) {
			
			if ( that.isActive() ) {
				if (e.toElement.getAttribute('id') == that.element.attr('id')) {
					that.setPosition(1);
				} else {
					that.setPosition(0);					
				}
			}

			$(document).off('.drag_range');
			that.started = 0;
		});

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
				minus = startPos;

				if (plus > e.pageY && (plus - 5) < e.pageY ) {
					plus -= that.step;
					that.setVal(1);
				}
			} else {
				plus = startPos - 10;

				if (minus < e.pageY) {
					minus += that.step;
					that.setVal(-1);
				}
			}

		});

	},


	// Установка значения по умолчанию + замена спрайта
	setVal: function(sign) {
		var 
			value = this.checkVal( this.getValue() + sign );

		this.setPosition(this.getStartPosition() + sign, 'y');
		this.setValue(value);
	},


	// общая сумма спрайтов
	getTotalVals: function() {
		return Math.ceil(this.calc.img.h / this.shifts[0]);
	},


	// Проверка на активность кнопки
	isActive: function() {
		return this.activeButton;
	},


	// Заблокировать кнопку
	lockButton: function() {
		var 
			calc = this.calc,
			pos;

		this.activeButton = false;

		// Ставим позицию на последнюю
		pos = (calc.img.w / calc.sprite.w) - 1;
		this.setPosition(pos, 'x');
		
		this.element.off('.range').off('.drag_range');
		this.element.unbind();
	},


	// разблокировать кнопку
	unlockButton: function() {
		this.setPosition(0);
		this.listen();
		this.activeButton = true;
	}

}

function c(cc) {
	console.log(cc);
}