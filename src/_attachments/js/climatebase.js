var climatebase = climatebase || {
	directives: {
		humanDate: {
			text: function(params){
				return new Date(this.date).toLocaleDateString();
			}
		},
		latestDate: {
			text: function(params){
				return new Date(this.doc.date).toLocaleDateString();
			}
		},
		deeplink: {
			href: function(params){
				return "javascript:climatebase.seek('"+(this.doc._id)+"');";
			}
		}
	},
	schema: {
		"type": "decommissioning",
	  	"id": "", "quantity": 0, "vintage": 0, "note": "", "date": 0,
	  	"offset-project": {
			"name": "", "id": "", "standard": "", "url": ""
	  	},
	  	"customer": {
			"name": "", "usecase": "", "hidden": true
	  	},
	  	"links": {
			"markit": "", "natureoffice": ""
	  	}
	},
	seek: function(){
		if(typeof(arguments[0])!=="undefined" && typeof(arguments[0])==="string"){
			$('#searchfield').val(arguments[0]);
		}
		
		if($('#details').hasClass('results')){
			climatebase.reset();
		}else{
			if( $('#searchfield').val()!=="" ){
				$.getJSON( "/api/search/"+$('#searchfield').val())
					.done(function( data ) {
						if(data.rows.length>0){
							$('#start-search span').removeClass('glyphicon-search');
							$('#start-search span').addClass('glyphicon-refresh');
							// we found the thing
							climatebase.fadeInTable(data.rows[0].value);
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
		$('.last-entries').css('opacity','0');
	},
	nope: function(){
		$('form').addClass('shake animated')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$(this).removeClass('shake animated');
			});	
	},
	/**/
	latest: function(){
		$.getJSON( "/api/last/8")
			.done(function( data ) {
		  		console.log( "Data Loaded: ", data );
				if(data.rows.length>0){
					//console.log('latest ->', data.rows);
					// we found the thing
					$('#latest-entries').render(data.rows, climatebase.directives);
					$('.last-entries').css('opacity','1');
				}
			});
	},
	/**/	
	reset: function(){
		$('#details').removeClass('results');
		$('.search').removeClass('action');
		$('#searchfield').val('');
		var job = setTimeout(function() {
			$('#start-search span').removeClass('glyphicon-refresh');
			$('#start-search span').removeClass('glyphicon-remove');
			$('#start-search span').addClass('glyphicon-search');
		}, 1000);
		$('.last-entries').css('opacity','1');
	},
	prepopulate: function(){
		var today = new Date();
		var todayString =  today.getFullYear()+'-';
		todayString += (today.getMonth()<9?'0'+(today.getMonth()+1):(today.getMonth()+1));
		todayString += '-';
		todayString += (today.getDate()<10?'0'+today.getDate():today.getDate());
		
		$('#add_id').val(climatebase.generateID());	
		$('#add_date').val( todayString );	
	},
	saveDoc: function(){
		var newDoc = $.extend({}, climatebase.schema, {
			"_id": $('#add_id').val(), 
			"quantity": $('#add_quantity').val(), 
			"vintage": $('#add_vintage').val(), 
			"note": $('#add_note').val(), 
			"date": new Date($('#add_date').val()).getTime(),
			"offset-project": {
				"name": $('#add_name').val(), 
				"id": $('#add_opid').val(), 
				"standard": $('#add_standard').val(), 
				"url": $('#add_url').val()
			},
			"customer": {
				"name": $('#add_cname').val(), 
				"usecase": $('#add_usecase').val(), 
				"hidden": ($('#add_hidden:checked').length==1?true:false)
			},
			"links": {
				"markit": $('#add_markit').val(), 
				"natureoffice": $('#add_natureoffice').val()
			}
		});
		var db = $.couch.db('api');
		//console.log(newDoc);
		db.saveDoc(newDoc, {
			success: function(resp){
				$('#addModal').modal('hide');
				alert('Document created with ID: '+resp.id);
			},
			error: function(resp){
				alert('Error! '+JSON.stringify(resp, null, "\t"))
			}
		});
		
	},
	generateID: function(){
		return (new Date().getFullYear())+'-xxxx-xxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},
	login: function(){
		$.couch.login({
			name: $('#dbUser').val(),
			password: $('#dbPassword').val(),
			success: function(data){
				console.log('Login',data);
				climatebase.session();
				$('.modal-body .alert').addClass('hide');
				$('#loginModal').modal('hide');
			},
			error: function(status){
				console.log('Login error',status);
				$('.modal-body .alert').removeClass('hide');
			}
		});
	},
	logout: function(){
		$.couch.logout({
			success: function(data) {
				climatebase.session();
			}
		});	
	},
	session: function(){
		$.couch.session()
			.done(function(data){ 
				if(data.userCtx.name!==null){
					$('h2.addEntry').removeClass('hide');
					$('#hello').text('| Hello '+data.userCtx.name);
					$('#hello').click(climatebase.logout);
				}else{
					$('h2.addEntry').addClass('hide');						
					$('#hello').text('');
					$('#hello').unbind('click');
				}
			});
	},
	/**/
	init: function(){
		$('.emotion').addClass( 'picture' + (Math.floor(Math.random()*9)+1) );
		$('#start-search').click(climatebase.seek);
		$('form.form-inline').on('submit', climatebase.seek);

		$('#loginButton').click(climatebase.login);

		$('#addModal').on('show.bs.modal', climatebase.prepopulate);
		$('#addForm').on('submit', function(){
			return false;
		});
		$('#addButton').click( function(){
			$('#addForm').submit();
		});
		
		$.validate({ 
			form:$('#addForm'),
			validateOnBlur: true,
			onError : function() {
				//console.log('Sorry, but no!');
				return false;
			},
			onSuccess : function() {
				//console.log('The form is valid!');
				climatebase.saveDoc();
				return false;
			}
		});
		climatebase.latest();

		climatebase.session();
	}
};
climatebase.init();