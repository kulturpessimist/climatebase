var climatebase = climatebase || {
	directives: {
		humanDate: function(params){
			return new Date(this.date).toLocaleDateString();
		}
	},
	seek: function(){
		if($('#details')[0].classList.contains('results')){
			climatebase.reset();
		}else{
			if( $('#searchfield').val()!=="" ){
				$.getJSON( "/api/search/"+$('#searchfield').val())
					.done(function( data ) {
				  		console.log( "Data Loaded: ", data );
						if(data.rows.length>0){
							console.log('found!', data.rows[0]);
							$('#start-search span')[0].classList.remove('glyphicon-search');
							$('#start-search span')[0].classList.add('glyphicon-refresh');
							// we found the thing
							climatebase.fadeInTable(data.rows[0].doc);
						}
					});
			}
		}
	},

	fadeInTable: function(){
		var data = arguments[0] || {};
		$('#details').render(data, climatebase.directives);
		if(data.customer.hidden){
			$('#customer').remove();
		}

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

	generateID: function(){
		return (new Date().getFullYear())+'-xxxx-xxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},

	init: function(){
		$('#start-search').click(climatebase.seek)
	}
};

climatebase.init();