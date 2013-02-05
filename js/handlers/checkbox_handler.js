function CheckBoxHandler(el, params) {

	params.extend(this, params);

	this.activePosition = {												// Стартовая позиция спрайта
		'x' : 0,
		'y' : 0
	}; 

	this.optionsState = {
		'mouseUp' : {
			'active' : 5, 'notActive' : 1
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

	this.listen();

};

CheckBoxHandler.prototype = {

	active: 0,

	setState: function( params ) {

		var key = this.isActive() ? 'active' : 'notActive';
		
		this.setValue( this.checkVal(this.isActive()) );
		this.setPosition( params[key] );
	},

	listen: function() {

		var 
			that 	= this,
			el 		= this.element;


		el.on('mousedown.checkbox', function() {
			that.setPosition(2);
			that.active = that.isActive() ? 0 : 1;
		});


		el.on('mouseup.checkbox', function(e) {

			if ( e.target.id == that.element.attr('id') ) {
				that.setState( that.optionsState.mouseUp );
			}

		});


		el.hover(function() {
			that.setState( that.optionsState.hoverStart );
		}, function() {
			that.setState( that.optionsState.hoverEnd );
		});

	},

	isActive: function() {
		return this.active;
	},

	lockButton: function() {

		this.setState( this.optionsState.lock );

		this.element.unbind();
		this.element.on('mousewheel.not_scroll', function(e, delta){
			e.preventDefault();
		});		
		
	},

	unlockButton: function() {
		this.setState( this.optionsState.unlock );
		this.listen();
		this.element.off('.not_scroll');
	}
}
