function(doc){
	if(doc.type=="decommissioning"){
		emit(doc.id, null);
	}
}