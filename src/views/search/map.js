function(doc){
	if(doc.type=="decommissioning"){
		var resp = JSON.parse(JSON.stringify(doc));
		if(doc.customer.hidden==true){
			resp.customer.name = new Array( doc.customer.name.length ).join("•");
			resp.customer.usecase = new Array( doc.customer.usecase.length ).join("•");		
			delete resp.customer.hidden;
		}
		emit(doc._id, resp);
	}
}