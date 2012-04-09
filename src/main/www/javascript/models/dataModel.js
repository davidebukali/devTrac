function FieldTrip(){
	this.id;
    this.title;
    this.sites = [];
}

function Site(){
    this.id = "";
    this.name = "";
	this.placeId = "";
	this.placeName = "";
	this.placeGeo = "";
	this.placeTaxonomy = [];
    this.type = "";
    this.offline = false;
    this.complete = false;
	this.narrative = "";
    this.dateVisited = "";
    this.contactInfo = {
        name: "",
        phone: "",
        email: ""
    };
    this.latitude = "";
    this.longitude = "";
    this.submission = [];
    this.photos = {};
    this.actionItems = [];
    this.historyAssignedToMeActionItems = [];
    this.historyNotAssignedToMeActionItems = [];

    this.uploaded = true;
}

Site.updateURL = function(site){
    return DT_D7.NODE_SAVE.replace('<NODE_ID>', site.id);
}

Site.createURL = function(){
    return DT_D7.NODE_CREATE;
}

Site.setDateVisited = function(site, dateString){
    var year = dateString.substring(0,4);
    var month = dateString.substring(5,7);
    var day = dateString.substring(8,10);
    site.dateVisited = day+ "/" + month + "/" + year;
}

Site.packageData = function(site, fieldTripId) {
    var data = {
        "title": site.name,
        "type": DT_D7.NODE_TYPE.SITE,
        "field_ftritem_narrative[und][0][value]" : site.narrative,
        "field_ftritem_public_summary[und][0][value]" : site.narrative,
        "field_ftritem_date_visited[und][0][value][date]" : site.dateVisited,
        "language": "und"
    };
    if (site.offline) {
        if (site.latitude != "" && site.longitude != "") {
            data["field_ftritem_lat_long[und][0][wkt]"] = "POINT (" + site.latitude + " " + site.longitude + ")";
        }
        data["field_ftritem_field_trip[und][0][target_id]"] = fieldTripId;
    }
    return data;
}

function PlaceTaxonomy(){
	this.id = "";
	this.name = "";
}

function SubmissionItem(){
	this.id = "";
	this.response = "";
}

function PlaceType(){
	this.id = "";
	this.name = "";
	this.parentId = "";
}

function Question(){
    this.id = "";
    this.title = "";
    this.type = "";
    this.options = "";
	this.taxonomy = [];
}

function QuestionTaxonomy(){
	this.id = "";
    this.name = "";
}

function ActionItem(){
	this.id = "";
    this.title = "";
	this.task = "";
    this.assignedTo = "";
}

function UserProfile(){
	this.uid = "";
	this.username = "";
	this.name = "";
}

UserProfile.getUserIDbyUserName = function(username) {
    for(var i in devtrac.profiles){
        if(devtrac.profiles[i].username == username)
          return devtrac.profiles[i].uid;
    }
    return 0;
}
