function ButtonHandler(el, params) {

	params.extend(this, params);

	this.activePosition = {												
		'x' : 0,
		'y' : 0
	}; 

	this.listen();
};

ButtonHandler.prototype = {	

	active : true,

	listen: function() {

		var 
			that = this,
			el   = this.element; 	


		el.hover(function() {
			if (1 == $.activity) {
				return false;
			}

			that.setPosition(1);
		}, function() {
			that.setPosition(0);
		});	


		el.on('mousedown.button', function(e) {
			that.setPosition(2);
			$.activity = 1;
		});

		el.on('mouseup.button', function(e) {

			if ( e.target.getAttribute('id') == el.attr('id') ) {
				that.setPosition(1);
				that.element.trigger(that['event']);
				that['callback'].apply(that);
				return;
			}

			that.setPosition(0);
			$.activity = 0;

		});
	},

	lockButton: function() {
		this.element.unbind();
		this.element.on('mousewheel.not_scroll', function(e, delta){
			e.preventDefault();
		});	

		this.setPosition(3);	
	},

	unlockButton: function() {
		this.setPosition(0);
		this.listen();

		this.element.off('.not_scroll');
	}
};