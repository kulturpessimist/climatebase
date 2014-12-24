function(doc){
	if(doc.type=="decommissioning"){
		emit(doc._id, null);
	}
}