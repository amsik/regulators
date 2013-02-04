function RadioHandler(el, params) {

	params.extend(this, params);

	var that 			= this,
		startPosition 	= this.getStartPosition(),
		settings		= {};


	this.element 		= el;											// Текущая кнопка
	this.activePosition = {												// Стартовая позиция спрайта
		'x' : 0,
		'y' : startPosition * this.shifts[0]
	}; 

	// поставим кнопку по умолчанию
	this.setSlide(this.activePosition);

	// настройки
	this.settings = {
		'nextSlide' : 10
	};

	this.listen();
};

RadioHandler.prototype = {

	access: true,			// доступ к значению

	listen: function() {

		var 
			that		= this,
			startPos 	= 0;

		this.element.on('mousedown.radio', function(e) {
			startPos = e.pageX;

			that.dragStart(startPos);
			that.setPosition(2);
		});


		$(document).on('mouseup.radio', function(e) {

			that.setPosition(1);
			$(document).off('.drag_radio');
		});
	},

	dragStart: function(startPos) {

		var 
			that 	= this,
			sh 		= this.calc.sprite.w / this.getTotalVals('h'),
			party, accPos;


		$(document).on("mousemove.drag_radio", function(e){

			party  = ( e.pageX >= startPos ) ? 1 : -1;
			accPos = (party == 1)
					? (that.getStartPosition() + 2) * sh
					: that.getStartPosition() * sh;

			// листаем вправо
			if ( party == 1 && ((e.pageX >= accPos) && e.pageX <= (accPos + sh)) )	{ 

				if ( that.getValue() == that.getMax() ) {
					return;
				}

				that.setVal(party);	
			}


			// листаем влево
			if (party == -1 && ((e.pageX <= accPos) && e.pageX >= (accPos - sh)) ) {

				if ( that.getValue() == that.getMin() ) {
					return;
				}

				that.setVal(party);	
			}
		});
	},


	// Установка значения по умолчанию + замена спрайта
	setVal: function(sign) {

		var 
			that	= this,
			value 	= this.checkVal( this.getValue() + sign ),
			lastPos = this.getTotalVals('w') - 1,
			shift 	= (sign < 0) 
						? this.getStartPosition() - 1 	// налево
						: this.getStartPosition();		// направо

		// картинка сдвига
		this.setPosition(lastPos);
		this.setPosition(shift, 'y');

		setTimeout(function() {

			that.setValue(value);
			that.setPosition(2);	
			that.setPosition(that.getStartPosition(), 'y');	

		}, this.settings.nextSlide);

		// если последнее значение - остановим
		if (value >= this.getMax()) {
			this.access = false;
			return;
		} else {
			this.access = true;			
		}
	},


}


function c(cc) {
	console.log(cc);
}