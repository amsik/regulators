function CheckBoxHandler(el, params) {

	params.extend(this, params);

	this.activePosition = {												// Стартовая позиция спрайта
		'x' : this.getStartPosition() * this.shifts[0],
		'y' : 0
	}; 

	this.attrId = this.element.attr('id');

	this.optionsState = {
		'mouseUp' : {
			'active' : 1, 'notActive' : 5
		},
		'hoverStart' : {
			'active' : 5, 'notActive' : 1			
		},
		'hoverEnd' : {
			'active' : 4, 'notActive' : 0			
		},
		'lock' : {
			'active' : 6, 'notActive' : 3
		},
		'unlock' : {
			'active' : 4, 'notActive' : 0
		}
	};

	if (this.getValue() >= 1) {
		this.setPosition(5);
	} else {
		this.setPosition(0);
	}


	this.listen();

	if ( 0 === this.activity ) {
		this.lockButton();
	}

	// создаем инпуты
	this.createInput();	
};

CheckBoxHandler.prototype = {

	active: 1,

	setState: function( params, setVal ) {

		setVal = setVal || -1;

		var 
			key = this.getValue() == 1 ? 'active' : 'notActive',
			val = this.getChVal();

		this.setPosition( params[key] );

		if (-1 == setVal) {
			this.setValue( this.checkVal(val) );		
		}
	
	},

	listen: function() {

		var 
			that 	= this,
			el 		= this.element,
			down 	= false;


		el.on('mousedown.checkbox', function() {
			that.setPosition(2);

			down		= true;
			$.activity  = 1;
		});


		el.on('mouseup.checkbox', function(e) {

			if ( e.target.id == that.element.attr('id') ) {
				that.setState( that.optionsState.mouseUp );
			} 

			$.activity 	= 0;
			down		= false;
		});


		el.hover(function() {
			if (1 == $.activity) {
				return false;
			}

			that.setState( that.optionsState.hoverStart, true );
		}, function() {
			
			// если опущена кнопка, но увели курсор за пределы
			if (down) { 
				that.setState( that.optionsState.hoverEnd, true );
			}


			if (1 == $.activity) {
				return false;
			}
			that.setState( that.optionsState.hoverEnd, true );
		});

	},

	createInput: function() {

		var that = this;
		var name = this.element.attr('id');
			
		var	checkbox = $('<input/>', {
			'name'  : name,
			'type'  : 'checkbox',
			'id'	: name + "_el"
		});

		if ( 1 == this.getValue() )	{
			checkbox.click();
		}

		checkbox
			.change(function() {
				that.setValue($(this).is(':checked') == true ? 1 : 0, 0, true);
			})
			.addClass('cloth');

		this.element.append( checkbox );	
		this.realElement = checkbox;
	},

	setRealVal: function() {
		this.realElement.click();
	},

	getChVal: function() {
		return this.getValue() == 1 ? 0 : 1;
	},

	isActive: function() {
		return this.active;
	},

	lockButton: function() {

		this.active = 0;

		this.setState( this.optionsState.lock, true );

		if ( undefined !== targetsConf[this.attrId] ) {
			targetsConf[this.attrId]['activity'] = 0;
			this.setValue( this.getValue() );
		}

		this.element.unbind();
		this.element.on('mousewheel.not_scroll', function(e, delta){
			e.preventDefault();
		});		
				
	},

	unlockButton: function() {

		this.active = 1;

		this.setState( this.optionsState.unlock, true );

		if ( undefined !== targetsConf[this.attrId] ) {
			targetsConf[this.attrId]['activity'] = 1;
			this.setValue( this.getValue() );
		}

		this.listen();
		this.element.off('.not_scroll');

	}
}
