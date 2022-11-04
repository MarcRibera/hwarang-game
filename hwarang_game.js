$( document ).ready(function() {	
	var outContainer = $( ".out-container" );
	
	// when dom is ready execute init()	
	$( document ).ready(function() {
  		init();
	});

	// actions

	// belt selector
	$(".belt-selector-row span").click(function(e){		
		selectLevel(e.currentTarget.classList[0]);			
	})
	// velocity selector
	$(".velocity-wrap span").click(function(e){			
		selectVelocity(e.currentTarget);		
	})

	// start stop pause
	$(".start-btn").click(function(e){
		startTraining();
	})
	$(".stop-btn").click(function(e){
		stop();
	})
	$(".pause-btn").click(function(e){
		pause();
	})

	// vars
	var intervalId;
	var nivel = 'no-belt-selected';	
	var tecDict = {
		'yellow-belt': {...tecAmarillo},
		'orange-belt': Object.assign({},tecNaranja),
		'green-belt': Object.assign({},tecVerde),
		'blue-belt': Object.assign({},tecAzul)
	}
	var tecVelocity = 8000;
	var isPaused = false;
	var isStartBtnPressed = false;

	// functions
	function init(){
		$( ".start-btn" ).addClass( "enabled" );
		$( ".stop-btn" ).addClass( "disabled" );
		$( ".pause-btn" ).addClass( "disabled" );
		$( ".velocity-wrap .8" ).addClass( "vel-selected" );
		
		selectLevel('all-belt');
	}

	function selectLevel(target){		
		if (!isStartBtnPressed) {
			if (nivel != target){
				nivel = target;			
				$( ".selected" ).removeClass( "selected" );
				$( "."+target ).addClass( "selected" );
			}
		}
	}

	function selectVelocity(target){
		if (!isStartBtnPressed) {
			tecVelocity = target.classList[0] * 1000;		
			$(".velocity-wrap > span").removeClass("vel-selected");
			$( "."+target.classList[0] ).addClass( "vel-selected");		
		}
	}

	function startTraining(){		
		isStartBtnPressed = true;
		tecDict = {
			'yellow-belt': JSON.parse(JSON.stringify(tecAmarillo)),
			'orange-belt': JSON.parse(JSON.stringify(tecNaranja)),
			'green-belt': JSON.parse(JSON.stringify(tecVerde)),
			'blue-belt': JSON.parse(JSON.stringify(tecAzul))
		}

		if (nivel == 'no-belt-selected'){
			showNoLevelselected();						
		}else{
			if (nivel == 'all-belt'){					
					showPositionAll();
					intervalId = setInterval(
						function() {
							if (!isPaused){
								showPositionAll();
							}
						}
						, tecVelocity);									
			}else{
				showPosition();
				intervalId = setInterval(
					function() {
						if (!isPaused){
							showPosition();
						}
					}
					, tecVelocity);				
			}

			// update action buttons
			$(".start-btn").removeClass('enabled');
			$(".start-btn").addClass('disabled');
			$(".stop-btn").addClass('enabled');
			$(".stop-btn").removeClass('disabled');	
			$(".belt-selector-row").addClass('disabled');	
			$(".velocity-wrap").addClass('disabled');	
			$(".pause-btn").removeClass('disabled');		
		}	
	}

	function stop(){		
		clearInterval(intervalId);

		//clear text	
		let strEle = $('.tecnica-text');	
		$( '<h1 class="tecnica-text"></h1>' ).replaceAll( ".tecnica-text" );
		/*
		// remove selected-belt
		$( ".selected" ).removeClass( "selected" );
		nivel = 'no-belt-selected';	
		*/

		// udpate action buttons
		$(".start-btn").removeClass('disabled');
		$(".start-btn").addClass('enabled');
		$(".stop-btn").addClass('disabled');
		$(".stop-btn").removeClass('enabled');	
		$(".belt-selector-row").removeClass('disabled');	
		$(".velocity-wrap").removeClass('disabled');
		$(".pause-btn").addClass('disabled');		

		// set flag
		isStartBtnPressed = false;
		
		// set tedDict empty
		tecDict = {};

		//set pause btn
		isPaused = true;
		pause();
	}

	function pause(){		
		isPaused = !isPaused;

		if (isPaused){
			$(".pause-btn").addClass('enabled');	
			$(".pause-btn").addClass('pulse');	
		}else{
			$(".pause-btn").removeClass('enabled');
			$(".pause-btn").removeClass('pulse');
		}		
	}

	function showPositionAll(){		
		var cinturonList = ['yellow-belt','orange-belt','green-belt'];	
		nivel = cinturonList[random(cinturonList.length)];	 

		if (tecDict[nivel] == {}){
			delete tecDict[nivel]	
		}		
		if( !(nivel in tecDict) ){
			nivel = Object.keys(tecDict)[0]
		}
		
		// selecte tipoTecnica and manage this key in tecDict[nivel] dict
		let tipoTecnicaList  = ['soguis','makis','chiruguis', 'chaguis','nakbop'];		
		let tipoTecnica = tipoTecnicaList[random( tipoTecnicaList.length )];
		
		if ( !(tipoTecnica in tecDict[nivel]) ){
			tipoTecnica = Object.keys(tecDict[nivel])[0]
			if (tipoTecnica == undefined){
				delete tecDict[nivel]				
				nivel = Object.keys(tecDict)[0]
				if (nivel == undefined){
					stop();					
					return
				}else{
					tipoTecnica = Object.keys(tecDict[nivel])[0]
				}			
			}			
		}

		// select tecnica and manage this array of tecnicas		
		if(tecDict[nivel][tipoTecnica] == undefined){
			if (tecDict[nivel][tipoTecnica] == undefined){
				tecDict[nivel][0]
			}else{
				var tecnica = tecDict[nivel][tipoTecnica][0];
			}
		}else{
			var tecnica = tecDict[nivel][tipoTecnica][random( tecDict[nivel][tipoTecnica].length )];		
		}


		let index = tecDict[nivel][tipoTecnica].findIndex(function(ele){
			return ele == tecnica
		})	
		tecDict[nivel][tipoTecnica].splice(index,1);			

		// if after the splice tecDict[nivel][tipoTecnica] is empty, delete that key
		if(tecDict[nivel][tipoTecnica].length == 0){
			delete tecDict[nivel][tipoTecnica]
		}	

		//print html
		let str = "<h1 class='tecnica-text'>" + tecnica + "<h1>";
		let strEle = $('.tecnica-text');

		if (strEle.length != 0){
			$( str ).replaceAll( ".tecnica-text" );					
		}else{			
			let html = $.parseHTML( str );		
			outContainer.append(html);
		}		

		// voice
		sayTecnica(tecnica)
	}

	function showPosition(){		
		// selecte tipoTecnica and manage this key in tecDict[nivel] dict
		let tipoTecnicaList  = ['soguis','makis','chiruguis', 'chaguis','nakbop'];		
		let tipoTecnica = tipoTecnicaList[random( tipoTecnicaList.length )];	
		
		if ( !(tipoTecnica in tecDict[nivel]) ){
			tipoTecnica = Object.keys(tecDict[nivel])[0]
			if (tipoTecnica == undefined){
				stop();
				return;
			}			
		}

		// select tecnica and manage this array of tecnicas
		let tecnica = tecDict[nivel][tipoTecnica][random( tecDict[nivel][tipoTecnica].length )];		

		let index = tecDict[nivel][tipoTecnica].findIndex(function(ele){
			return ele == tecnica
		})	
		tecDict[nivel][tipoTecnica].splice(index,1);			

		// if after the splice tecDict[nivel][tipoTecnica] is empty, delete that key
		if(tecDict[nivel][tipoTecnica].length == 0){
			delete tecDict[nivel][tipoTecnica]
		}

		//print html
		let str = "<h1 class='tecnica-text'>" + tecnica + "<h1>";
		let strEle = $('.tecnica-text');

		if (strEle.length != 0){
			$( str ).replaceAll( ".tecnica-text" );					
		}else{			
			let html = $.parseHTML( str );		
			outContainer.append(html);
		}	
		
		// voice
		sayTecnica(tecnica)
	}
	function showNoLevelselected(){
		//print html
		let str = "<h1 class='tecnica-text no-nivel'> Primero seleciona un cinturón <h1>";
		let strEle = $('.tecnica-text');

		if (strEle.length != 0){
			$( str ).replaceAll( ".tecnica-text" );					
		}else{			
			let html = $.parseHTML( str );		
			outContainer.append(html);
		}
	}

	function sayTecnica(text){		
		var utterance = new SpeechSynthesisUtterance('hey');
		utterance.lang = 'es-AR';
		utterance.text = text;		
		utterance.pitch = 0.6;
		utterance.volume = 1.5;
		utterance.rate =1.1;
		speechSynthesis.speak(utterance);
	}

	function random(length){
		return Math.floor(Math.random()*length);
	}
});
