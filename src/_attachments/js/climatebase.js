var climatebase = climatebase || {
	seek: function(){
		
	},

	fadeInTable: function(){
		$('#details')[0].classList.toggle('results');
		$('.search')[0].classList.toggle('action');
	},
	
	init: function(){
		$('#start-search').click(climatebase.fadeInTable)
	}
};

climatebase.init();