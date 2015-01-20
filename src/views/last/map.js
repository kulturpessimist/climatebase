function(doc){
	if(	doc.type=="decommissioning" 
		&& doc._id!=="prototype_decommissioning"
		&& doc._id!=="2014-0000-0000"
	){
		emit(doc.date, null);
	}
}