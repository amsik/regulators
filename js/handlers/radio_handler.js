function RadioHandler(el, params) {

	var that = this;

	params.extend(this, params);


	this.listen();



};

RadioHandler.prototype = {

	listen: function() {

		var that = this;

		this.element.on('mousewheel.range', function(e, delta){
			e.preventDefault();
			c(5)



		});

	}


}


function c(cc) {
	console.log(cc);
}