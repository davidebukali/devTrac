var siteController = new Object();

siteController.add = function(){
    navigator.log.debug("Adding site.");
	var questions = new QuestionTypes(devtrac.questions);
	var list = $('#sitetypes');
	list.html("");
    $(questions.locationTypes()).each(function(i, option){
        list.append("<option>" + option + "</option>");
    });

    var generateDateTip = function(startDate, endDate){
          var msg ="";
          if(startDate && endDate){
            var startDateString = Validator.parseToDateString(startDate);
            var endDateString = Validator.parseToDateString(endDate);
            msg = "Valid date range is " + startDateString + " ~ " + endDateString;
          }
          else{
              navigator.log.log("Date range of fieldtrip incorrect error in rendering date range tip");
          }
          return msg;
    }

    $("#datetip").html(generateDateTip(devtrac.fieldTrip.startDate, devtrac.fieldTrip.endDate));
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
        var startDateString = Validator.parseToDateString(devtrac.fieldTrip.startDate);
        var endDateString = Validator.parseToDateString(devtrac.fieldTrip.endDate);
        if (startDateString != "undefined" && endDateString != "undefined") {
            navigator.log.log("Date outrange error in creating site.");
            alert('The date visited should between: ' + startDateString + ' and ' + endDateString);
        }
        else {
            navigator.log.log("Date range of fieldtrip incorrect error in creating site: " + siteTitle);
            navigator.log.log("Date range of current fieldtrip is: [" + devtrac.fieldTrip.startDate + "] to [" + devtrac.fieldTrip.endDate + "].");
            alert('The field trip has incorrect date range, site creating cancelled.');
        }
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

    var placeSuccess = function(response){
        if (response['error']) {
            var error = 'Error occured in uploading place of site "' + site.name + '". Please try again.\n' +
            'Error detail:' + JSON.stringify(response);
            navigator.log.log(error);
            alert("Error occured in creating place of site '" + site.name + "', creating new site failed.");
        }
        else {
            site.placeNid = response['nid'];
            devtrac.fieldTrip.sites.push(site);
            navigator.store.put(function(){
            alert(site.name + " added successfully.");
            $("#site_title").val("");
            $("#dateVisited").val("");
            $("#latitude_value").text("");
            $("#longitude_value").text("");
            navigator.log.debug("Saved newly created site.");
            fieldTripController.showTripReports();
            }, function(){
                devtrac.common.logAndShowGenericError("Error in creating trip.");
                screens.show("sites_to_visit");
            }, devtrac.user.name, JSON.stringify(devtrac.fieldTrip));
        }
    }

    var placeError = function(){
        var error = "Error occured in creating place of site '" + site.name + "', creating new site failed.";
        navigator.log.log(error);
        alert(error);
    }

    var placeData = {
        'title': site.type,
        'type': 'place',
        'taxonomy_vocabulary_1[und][0]': devtrac.common.findPlaceType(site),
        'taxonomy_vocabulary_6[und][0]': 92
        }

    devtrac.common.callServicePost(DT_D7.NODE_CREATE, placeData, placeSuccess, placeError);
}

siteController.getGPS = function (){
    $("#capture_gps_button").val("Capturing...");
    $("#capture_gps_button").attr('disabled','disabled');

    var successCallback = function(position){
        navigator.geolocation.stop();
        $("#latitude_value").text(position.coords.latitude);
        $("#longitude_value").text(position.coords.longitude);

        $("#capture_gps_button").val("Capture GPS");
        $("#capture_gps_button").removeAttr('disabled');

        alert("GPS infomation captured successfully");
    }

    var errorCallback = function(){
        alert("Error occurred when capturing GPS location. Make sure your GPS coverage is sufficient.");
        $("#capture_gps_button").val("Capture GPS");
        $("#capture_gps_button").removeAttr('disabled');
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

siteController.clearGPS = function (){
    $("#latitude_value").text("");
    $("#longitude_value").text("");

    $("#capture_gps_button").attr('disabled','disabled');
    $("#capture_gps_button").removeAttr('disabled');

    alert("GPS infomation has been cleared.");
    return;
}
