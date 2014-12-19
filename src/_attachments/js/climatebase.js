var climatebase = climatebase || {
	seek: function(){
		if($('#details')[0].classList.contains('results')){
			climatebase.reset();
		}else{
			$('#start-search span')[0].classList.remove('glyphicon-search');
			$('#start-search span')[0].classList.add('glyphicon-refresh');
			// we found the thing
			climatebase.fadeInTable();
		}
	},

	fadeInTable: function(){
		$('#details')[0].classList.toggle('results');
		$('.search')[0].classList.toggle('action');
		var job = setTimeout(function() {
			$('#start-search span')[0].classList.remove('glyphicon-refresh');
			$('#start-search span')[0].classList.add('glyphicon-remove');
		}, 1000);
	},

	reset: function(){
		$('#details')[0].classList.remove('results');
		$('.search')[0].classList.remove('action');
		var job = setTimeout(function() {
			$('#start-search span')[0].classList.remove('glyphicon-refresh');
			$('#start-search span')[0].classList.remove('glyphicon-remove');
			$('#start-search span')[0].classList.add('glyphicon-search');
		}, 1000);
	},

	init: function(){
		$('#start-search').click(climatebase.seek)
	}
};

climatebase.init();