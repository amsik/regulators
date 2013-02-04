function RangeHandler(el, params) {

	var 
		that = this;

	// типо наследование от Fader
	params.extend(this, params);

	this.element 		= el;											// Текущая кнопка
	this.totalVals		= this.getTotalVals();							// Считаем общее число спрайтов

	this.step 			= 5;											// шаг для счетчика

	this.activePosition = {												// Стартовая позиция спрайта
		'x' : 0,
		'y' : this.getStartPosition() * this.shifts[0]
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


	listen: function() {
		
		var 
			that 		= this,
			startPos 	= 0,
			hovered 	= function(pos, timer) {
				
				if (!that.started) {
					that.setPosition(pos);
				}
					
				that.hovered = pos;

				if (timer) {
					that.timer = null;
				}
			};


		this.element.on('mousewheel.range', function(e, delta){
			e.preventDefault();

			clearTimeout(that.timer);

			var setHover = function(){
				if (0 == that.hovered) {
					return;
				}

				that.setPosition(1);
			};

			// чистим дельту для аира
			delta = ( delta >= 1 ) ? 1 : -1;

			that.setPosition(2);
			that.setVal(delta);

			that.timer = setTimeout(setHover, 1000);

		});


		this.element.hover(function(){

			if (1 == $.activity.range) {
				return false;
			}

			hovered(1, false);

		}, function() {
			hovered(0, true);
		});


		this.element.on('mousedown.range', function(e) {
			
			startPos 		 = e.pageY;
			that.started 	 = 1;
			$.activity.range = 1;

			that.dragStart(startPos);
			that.setPosition(2);
		});


		$(document).on('mouseup.range', function(e) {

			if ( that.isActive() ) {
				var id = e.target.id;

				if ( id == that.element.attr('id')) {
					that.setPosition(1);
				} else {
					that.setPosition(0);					
				}
			}

			$(document).off('.drag_range');

			that.started 		= 0;
			$.activity.range 	= 0;
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


	// Проверка на активность кнопки
	isActive: function() {
		return this.activeButton;
	},


	// Заблокировать кнопку
	lockButton: function() {
		var 
			calc = this.calc, pos;

		this.activeButton = false;

		// Ставим позицию на последнюю
		pos = (calc.img.w / calc.sprite.w) - 1;
		this.setPosition(pos, 'x');
		
		this.element.off('.range').off('.drag_range');
		this.element.unbind();

		this.element.on('mousewheel.not_scroll', function(e, delta){
			e.preventDefault();
		});		
	},


	// разблокировать кнопку
	unlockButton: function() {
		this.setPosition(0);
		this.listen();
		this.activeButton = true;

		this.element.off('.not_scroll');
	}

}