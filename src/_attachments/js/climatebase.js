var climatebase = climatebase || {
	directives: {
		humanDate: {
			text: function(params){
				return new Date(this.date).toLocaleDateString();
			}
		}	
	},
	seek: function(){
		if($('#details').hasClass('results')){
			climatebase.reset();
		}else{
			if( $('#searchfield').val()!=="" ){
				$.getJSON( "/api/search/"+$('#searchfield').val())
					.done(function( data ) {
				  		//console.log( "Data Loaded: ", data );
						if(data.rows.length>0){
							console.log('found ->', data.rows[0]);
							$('#start-search span').removeClass('glyphicon-search');
							$('#start-search span').addClass('glyphicon-refresh');
							// we found the thing
							climatebase.fadeInTable(data.rows[0].doc);
						}else{
							climatebase.nope();
						}
					});
			}else{
				climatebase.nope();
			}
		}
		return false;
	},
	fadeInTable: function(){
		var data = arguments[0] || {};
		$('#details').render(data, climatebase.directives);
		if(data.customer.hidden){
			$('#customer').remove();
		}
		$('#details').toggleClass('results');
		$('.search').toggleClass('action');
		var job = setTimeout(function() {
			$('#start-search span').removeClass('glyphicon-refresh');
			$('#start-search span').addClass('glyphicon-remove');
		}, 1000);
	},
	nope: function(){
		$('form').addClass('shake animated')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$(this).removeClass('shake animated');
			});	
	},
	/**/	
	reset: function(){
		$('#details').removeClass('results');
		$('.search').removeClass('action');
		var job = setTimeout(function() {
			$('#start-search span').removeClass('glyphicon-refresh');
			$('#start-search span').removeClass('glyphicon-remove');
			$('#start-search span').addClass('glyphicon-search');
		}, 1000);
	},

	generateID: function(){
		return (new Date().getFullYear())+'-xxxx-xxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},
	/**/
	init: function(){
		$('#start-search').click(climatebase.seek);
		$('form').on('submit', climatebase.seek);
	}
};
climatebase.init();