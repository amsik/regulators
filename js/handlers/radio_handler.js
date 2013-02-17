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


	if ( 0 === this.activity ) {
		this.lockButton();
	}

	// создаем инпуты
	this.createInput();	

};

RadioHandler.prototype = {

	access	: true,			// доступ к значению
	hovered	: false,
	timer	: null,
	dragged	: 0,
	active 	: true,

	listen: function() {

		var 
			that		= this,
			startPos 	= 0,
			mouseDown 	= 0;


		this.element.hover(function() {

			if (1 == $.activity) {
				return false;
			}

			that.setPosition(1);
			that.hovered = true;

		}, function() {
			that.setPosition(0);
			that.hovered = false;
		});


		this.element.on('mousedown.radio', function(e) {
			startPos  = e.pageX;
			mouseDown = that.getOffset(e, 'x');

			that.dragStart(startPos, e);
			that.setPosition(2);

			$.activity = 1;
		});


		$(document).on('mouseup.' + this.element.attr('id'), function(e) {

			e.target.getAttribute('id') == that.element.attr('id') 
				? that.setPosition(1)
				: that.setPosition(0);
		
			$(document).off('.drag_radio');

			if (mouseDown == that.getOffset(e, 'x')) {
				that.onClick(e);
			}

			$.activity = 0;
		});


		this.element.on('mousewheel.radio', function(e, delta) {
			e.preventDefault();

			clearTimeout(that.timer);

			var setHover = function(){
				if (0 == that.hovered) {
					return;
				}

				that.setPosition(1);
			};

			that.timer = setTimeout(setHover, 1000);	

			delta = ( delta >= 1 ) ? 1 : -1;

			if ( that.checkBorder(delta) ) {
				return;
			}

			that.setVal(delta);

		});
	},

	createInput: function() {

		var 
			that = this,
			name = this.element.attr('id'), 
			rndVal, radio, label;

		for( var i = this.getMin(); i <= this.getMax(); i++ ) {

			rndVal = name + "_" + Math.round( Math.random() * 100000);

			label = $('<label for="'+ rndVal +'">'+ i +'</label>')
						.css('color', '#fff')
						.addClass('cloth');

			radio = $('<input/>', {
				type: 'radio',
				name: name,
				value: i,
				id: rndVal
			})
			.appendTo(label);

			if ( this.getValue() == i ) {
				radio.attr('checked', 'checked');
			}			

			this.element.append(label);

		}

		radio = $('input[name=' + name + ']');

		radio.change(function() {
			that.setValue($(this).val(), 0, true);
		});

		this.realElement = radio;

	},

	setRealVal: function() {

		var val = this.getValue();

		this.realElement.removeAttr('checked').each(function() {
			if ( val == $(this).val() ) {
				$(this).attr('checked', 'checked').click();
			}
		});
	},


	dragStart: function(startPos) {

		var 
			that 	= this,
			sh 		= this.calc.sprite.w / this.getTotalVals('h'),
			party, accPos = startPos;

		$(document).on("mousemove.drag_radio", function(e){

			this.dragged = 1;

			party  = ( e.pageX >= startPos ) ? 1 : -1;

			if (that.checkBorder(party)) {
				return;
			}

			// листаем вправо
			if ( party == 1 && ((e.pageX >= accPos) && e.pageX >= (accPos + sh)) )	{ 
				that.setVal(party);	
				accPos = e.pageX;
			}

			// листаем влево
			if (party == -1 && ((e.pageX <= accPos) && e.pageX <= (accPos - sh)) ) {
				that.setVal(party);		
				accPos = e.pageX;
			}

		});
	},

	// при клике
	onClick: function(e) {

		var 
			e 		= e || window.event;
			that	= this,
			part 	= that.shifts[1] / that.getTotalVals(),
			val  	= Math.ceil(that.getOffset(e, 'x') / part) - 1,
			pos  	= [ Math.min(val, that.getStartPosition()),  Math.max(val, that.getStartPosition()) ],
			party 	= that.getStartPosition() > val ? -1 : 1;


		var timer, i = pos[0];

		timer = setInterval(nextSlide, 20);	

		function nextSlide() {
			i++;
			
			that.setVal(party);

			if ( i >= pos[1] ) {
				clearInterval(timer);
			}

		};	
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


	// Проверка границ, чтобы не заходило за макс или мин
	checkBorder: function(derection) {

		var g = (derection > 0) 
					? this.getValue() == this.getMax()
					: this.getValue() == this.getMin()
					
		return g;
	},

	isActive: function() {
		return this.active;
	},

	lockButton: function() {

		this.active = false;

		var ea = this.element.attr('id');

		if ( undefined !== targetsConf[ea] ) {
			targetsConf[ea]['activity'] = 0;
			this.setValue( this.getValue() );
		}

		this.element.unbind();
		this.element.off('.radio').off('.drag_radio');
		$(document).off("." + this.element.attr('id'));

		this.element.on('mousewheel.not_scroll', function(e, delta){
			e.preventDefault();
		});			

		this.setPosition(3);
	},

	unlockButton: function() {

		this.active = true;
		
		var ea = this.element.attr('id');

		if ( undefined !== targetsConf[ea] ) {
			targetsConf[ea]['activity'] = 1;
			this.setValue( this.getValue() );
		}

		this.setPosition(0);
		this.listen();

		this.element.off('.not_scroll');		
	}

}