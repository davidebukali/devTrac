var siteController = new Object();

siteController.add = function(){
    navigator.log.debug("Adding site.");
	var questions = new QuestionTypes(devtrac.questions);
	var list = $('#sitetypes');
	list.html("");
    $(questions.locationTypes()).each(function(i, option){
        list.append("<option>" + option + "</option>");
    });

    var startDate = Validator.parseDate(devtrac.fieldTrip.startDate);
    var endDate = Validator.parseDate(devtrac.fieldTrip.endDate);
    var startDateString = Validator.dateToString(startDate);
    var endDateString = Validator.dateToString(endDate);
    $("#datetip").html("Valid date range is " + startDateString + " ~ " + endDateString);

    screens.show("add_new_site");
	navigator.log.debug("Displayed add new site screen.");
};

siteController.list = function(){
	navigator.log.debug("Displayed list of field trips.");
    screens.show("sites_to_visit");
};

siteController.create = function(){
    navigator.log.debug("Creating a new site");

    var isAllWhiteSpace = true;
    var siteTitle = $("#site_title").val();
    if(siteTitle.replace(/\s/g,'').length ==0){
        alert('The title can not be empty.');
        return;
    }

    var dateVisited = $("#dateVisited").val();
    if(!Validator.isValidDate(dateVisited)){
      alert('The date visited: '+ dateVisited + ' is invalid.');
      return;
    }

    if(Validator.isOutrangedDate(dateVisited)){
        var startDate = Validator.parseDate(devtrac.fieldTrip.startDate);
        var endDate = Validator.parseDate(devtrac.fieldTrip.endDate);
        var startDateString = Validator.dateToString(startDate);
        var endDateString = Validator.dateToString(endDate);
        alert('The date visited should between: ' + startDateString + ' and ' + endDateString);
        return;
    }

    var site = new Site();
    site.id = Math.round(new Date().getTime() / 1000);
    site.uploaded = false;
    site.offline = true;
    site.name = $("#site_title").val();
    site.type = $("#sitetypes").val();
    site.dateVisited = dateVisited;
    var latitude = $("#latitude_value").text();
    var longitude = $("#longitude_value").text();
    site.placeGeo = "POINT (" + latitude + " " + longitude + ")";
    site.narrative = "Please provide a full report.";
	devtrac.fieldTrip.sites.push(site);
	navigator.store.put(function(){
        alert(site.name + " added successfuly.");
		$("#site_title").val("");
		$("#dateVisited").val("")
		navigator.log.debug("Saved newly created site.");
        fieldTripController.showTripReports();
    }, function(){
        devtrac.common.logAndShowGenericError("Error in creating trip.");
        screens.show("sites_to_visit");
    }, devtrac.user.name, JSON.stringify(devtrac.fieldTrip));
}

siteController.getGPS = function (){
    $("#capture_gps_button").val("Capturing...");
    $("#capture_gps_button").attr('disabled','disabled');

    var successCallback = function(position){
        $("#capture_gps_button").val("Capture GPS");
        $("#capture_gps_button").removeAttr('disabled');
        alert("Capturing GPS location successfully");
        navigator.geolocation.stop();
        $("#latitude_value").text(position.coords.latitude);
        $("#longitude_value").text(position.coords.longitude);
    }

    var errorCallback = function(error){
        $("#capture_gps_button").val("Capture GPS");
        $("#capture_gps_button").removeAttr('disabled');
        alert("Error occurred when capturing GPS location. Error message: " + error.message);
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}
