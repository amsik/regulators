function CheckBoxHandler(el, params) {

	params.extend(this, params);


	this.positions = {

	};

	this.activePosition = {												// Стартовая позиция спрайта
		'x' : 0,
		'y' : 0
	}; 

};

CheckBoxHandler.prototype = {

}


function c(cc) {
	console.log(cc);
}