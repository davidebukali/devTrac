function Validator(){
}

Validator.isValidDate = function(date) {
    var matches = /^(\d{2})[\/](\d{2})[\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var day = matches[1];
    var month = matches[2]-1;
    var year = matches[3];

    var composedDate = new Date(year, month, day);
    return ((composedDate.getMonth() == month) && (composedDate.getDate() == day) && (composedDate.getFullYear() == year));
}

Validator.isOutrangedDate = function(date){
    var matches = /^(\d{2})[\/](\d{2})[\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var day = matches[1];
    var month = matches[2]-1;
    var year = matches[3];

    var composedDate = new Date(year, month, day);
    if(devtrac.fieldTrip.startDate && devtrac.fieldTrip.endDate){
        var startDate = this.parseDate(devtrac.fieldTrip.startDate);
        var endDate = this.parseDate(devtrac.fieldTrip.endDate);
        return startDate > composedDate || endDate < composedDate;
    }
    return true;
}

Validator.parseDate = function(dateString) {
    var year = dateString.substring(0,4);
    var month = dateString.substring(5,7) - 1;
    var day = dateString.substring(8,10);
    return new Date(year, month, day);
}

Validator.dateToString = function(date) {
    var monthString = (date.getMonth()+1).toString();
    if (monthString.length==1){
        monthString = "0" + monthString;
    }
    var dateString = date.getDate().toString();
    if (dateString.length==1){
        dateString = "0" + dateString;
    }
    var string = dateString + "/" + monthString + "/" + date.getFullYear();
    return string;
}

Validator.parseToDateString = function(date){
	if(date){
	   var dateObj = this.parseDate(date);
       return this.dateToString(dateObj);
	}
	else
	   return "undefined";

}
