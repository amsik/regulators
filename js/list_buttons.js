
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
*
*
*
*	Стандартные методы для диспатча
*   	0. $(element).KDispatch('lock')		-- заблокировать кнопку
*		1. $(element).KDispatch('unlock')	-- разблокировать кнопку
*		2. $(element).KDispatch('isActive') -- проверка на активность кнопки
*
*	callback  - функция события
*	assigment - установка существующих событий сразу	(Default - true) 
*
*	change - ф-я, которая срабатывает при изменении значения.
*/

$(document).on('ready', function(){

	if ( !selectStart ) {
		if ( typeof document.onselectstart != 'undefined' ) {
			document.onselectstart = function() {
				return false;
			}
		}
		
		if ( typeof document.getElementsByTagName('body')[0].style.MozUserSelect != 'undefined' ) {
			document.getElementsByTagName('body')[0].style.MozUserSelect = 'none';
		}		
		
	}


	$(document).keyup(function(e) {
		//_c(e.keyCode)

		switch( e.keyCode ) {
			case 49:
				$('#volume').KDispatch('unlock');
				break;

			case 50:
				$('#volume').KDispatch('lock');
				break;	

			case 51:
				_c($('#volume').KDispatch('isActive'));
				break;		

			case 52:
				$('#volume').KDispatch('kaban');
				break;

			case 53:
				$('#volume').KDispatch('fazan');
				break;


		}

	});

	document.ondragstart = function() {
		return false;
	};


	$('#volume').KFaders({
		'max' 		: 25,
		'min' 		: 0,
		'default' 	: 5,
		'calc'		: {
			'sprite' 	: { 'h' : 50,  'w' : 90	}, 
			'img' 		: { 'h' : 1300, 'w' : 360 }
		},
		'dispatch': {
			'click' : {
				'callback': function() {
					_c('click111')
				}
			},
			'dblclick' : {
				'callback' : function() {
					_c('DBL!11')
				},
				'assigment': false
			},
			'fazan': {
				'callback' : function() {
					_c(this);
				}
			},
			'kaban': {
				'callback' : function() {
					_c('Собственное событие KABAN')
				} 	
			} 

		},
		'callback' : function() {
			_c("Стандартная: " + this.getValue());
		}

	});

	$('#ton').KFaders({
		'max' 		: 25,
		'min' 		: 0,
		'default' 	: 10,
		'calc'		: {
			'sprite' 	: { 'h' : 50,  'w' : 90	}, 
			'img' 		: { 'h' : 1250, 'w' : 360 }
		}
	});

	$('#speed').KFaders({
		'max' 		: 12,
		'min' 		: 0,
		'default' 	: 3,
		'calc'		: {
			'sprite' 	: { 'h' : 50,  'w' : 90	}, 
			'img' 		: { 'h' : 650, 'w' : 360 }
		}
	});


	$('#radio0').KFaders({
		'max' 		: 5,
		'min' 		: 3,
		'default' 	: 5,
		'calc'		: {
			'sprite' 	: { 'h' : 50,  'w' : 123 }, 
			'img' 		: { 'h' : 150, 'w' : 615 }
		},
		'change' : function() {
			console.log('Радио: ' + this.getValue())
		}		 
	});

	$('#checkbox0').KFaders({
		'max' 		: 1,
		'min' 		: 0,
		'default' 	: 0,
		'calc'		: {
			'sprite' 	: { 'h' : 50,  'w' : 45 }, 
			'img' 		: { 'h' : 42, 'w' : 315 }
		},
		'change' : function() {
			console.log('Чекбокс: ' +  this.getValue() )
		}				
	});



	$.btns = {

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
			'max' 		: -5,
			'min' 		: -7,
			'default' 	: 2,
			'calc'		: {
				'sprite' 	: { 'h' : 50,  'w' : 123 }, 
				'img' 		: { 'h' : 150, 'w' : 615 }
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