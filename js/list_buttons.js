
/**
*	element - ID тега
*	max 	- максимальное значение
*	min 	- минимальное значение
*	default - Значение по умолчанию. Если не было сохранено ранее - берется от сюда
*	
*	Calc:
*		Sprite:
*			h, w - Высота и ширина спрайта соответственно.
*		Img:
*			h,w - Высота и ширина самой картинки.	
*
*	remember	- Зпоминать в файл или нет
*	activity	- Активность кнопки ( 0 - не ктивна)
*/

$(document).on('ready', function(){

	if ( !selectStart ) {
		document.onselectstart = function() {
			return false;
		}
	}

	document.ondragstart = function() {
		return false;
	};


	$.btns = {

		'volume' :  new Fader({
			'element' 	: 'volume',
			'max' 		: 25,
			'min' 		: 0,
			'default' 	: 5,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 90	}, 
				'img' 		: { 'h' : 1300, 'w' : 360 }
			}
		}),
		'ton' :  new Fader({
			'element' 	: 'ton',
			'max' 		: 25,
			'min' 		: 0,
			'default' 	: 10,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 90	}, 
				'img' 		: { 'h' : 1250, 'w' : 360 }
			}
		}),
		'speed' :  new Fader({
			'element' 	: 'speed',
			'max' 		: 12,
			'min' 		: 0,
			'default' 	: 3,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 90	}, 
				'img' 		: { 'h' : 650, 'w' : 360 }
			}
		}),




		'radio0' : new Fader({
			'element' 	: 'radio0',
			'max' 		: 5,
			'min' 		: 3,
			'default' 	: 5,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 123 }, 
				'img' 		: { 'h' : 150, 'w' : 615 }
			}		
		}),
		'radio1' : new Fader({
			'element' 	: 'radio1',
			'max' 		: 3,
			'min' 		: 1,
			'default' 	: 1,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 123 }, 
				'img' 		: { 'h' : 150, 'w' : 615 }
			}		
		}),
		'radio2' : new Fader({
			'element' 	: 'radio2',
			'max' 		: 3,
			'min' 		: 1,
			'default' 	: 2,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 123 }, 
				'img' 		: { 'h' : 150, 'w' : 615 }
			}			
		}),




		'checkbox0' : new Fader({
			'element' 	: 'checkbox0',
			'max' 		: 1,
			'min' 		: 0,
			'default' 	: 0,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 45 }, 
				'img' 		: { 'h' : 42, 'w' : 315 }
			}				
		}),
		'checkbox1' : new Fader({
			'element' 	: 'checkbox1',
			'max' 		: 1,
			'min' 		: 0,
			'default' 	: 0,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 45 }, 
				'img' 		: { 'h' : 42, 'w' : 315 }
			}				
		}),
		'checkbox2' : new Fader({
			'element' 	: 'checkbox2',
			'max' 		: 1,
			'min' 		: 0,
			'default' 	: 0,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 45 }, 
				'img' 		: { 'h' : 42, 'w' : 315 }
			}					
		}),
		'checkbox3' : new Fader({
			'element' 	: 'checkbox3',
			'max' 		: 1,
			'min' 		: 0,
			'default' 	: 1,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 45 }, 
				'img' 		: { 'h' : 42, 'w' : 315 }
			}				
		}),
		'checkbox4' : new Fader({
			'element' 	: 'checkbox4',
			'max' 		: 1,
			'min' 		: 0,
			'default' 	: 0,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 45 }, 
				'img' 		: { 'h' : 42, 'w' : 315 }
			}					
		}),
		'checkbox5' : new Fader({
			'element' 	: 'checkbox5',
			'max' 		: 1,
			'min' 		: 0,
			'default' 	: 1,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 45 }, 
				'img' 		: { 'h' : 42, 'w' : 315 }
			}				
		}),




		'button0' : new Fader({
			'element' 	: 'button0',
			'max' 		: 1,
			'min' 		: 0,
			'default' 	: 0,
			'calc'		: {
				'sprite' 	: { 'h' : 40,  'w' : 45 }, 
				'img' 		: { 'h' : 42, 'w' : 180 }
			}					
		}),
		'button1' : new Fader({
			'element' 	: 'button1',
			'max' 		: 1,
			'min' 		: 0,	
			'default' 	: 0,
			'calc'		: {
				'sprite' 	: { 'h' : 40,  'w' : 45 }, 
				'img' 		: { 'h' : 42, 'w' : 180 }
			}					
		})

	}
		
});