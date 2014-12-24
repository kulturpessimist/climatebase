function(doc){
	if(doc.type=="decommissioning"){
		emit(doc.date, null);
	}
}