describe("DataPull", function(){

    describe("placeTypes", function(){
        var callback;

        describe("when success", function(){
            var placeTypes;
            beforeEach(function() {
                callback = jasmine.createSpy("Callback");
                placeTypes = [{
                                  "taxonomy_term_data_taxonomy_term_hierarchy_name": "Water Points",
                                  "taxonomy_term_data_taxonomy_term_hierarchy_vid": "1",
                                  "taxonomy_term_data_taxonomy_term_hierarchy_tid": "23",
                                  "taxonomy_term_data_taxonomy_term_hierarchy__taxonomy_vocabul": "vocabulary_1",
                                  "taxonomy_term_data_name": "Borehole",
                                  "taxonomy_term_data_vid": "1",
                                  "tid": "204",
                                  "taxonomy_vocabulary_machine_name": "vocabulary_1"
                              },
                              {
                                  "taxonomy_term_data_taxonomy_term_hierarchy_name": "Other Locations",
                                  "taxonomy_term_data_taxonomy_term_hierarchy_vid": "1",
                                  "taxonomy_term_data_taxonomy_term_hierarchy_tid": "49",
                                  "taxonomy_term_data_taxonomy_term_hierarchy__taxonomy_vocabul": "vocabulary_1",
                                  "taxonomy_term_data_name": "Government Office",
                                  "taxonomy_term_data_vid": "1",
                                  "tid": "3",
                                  "taxonomy_vocabulary_machine_name": "vocabulary_1"
                              },
                              {
                                  "taxonomy_term_data_taxonomy_term_hierarchy_name": "Health Facilities",
                                  "taxonomy_term_data_taxonomy_term_hierarchy_vid": "1",
                                  "taxonomy_term_data_taxonomy_term_hierarchy_tid": "2",
                                  "taxonomy_term_data_taxonomy_term_hierarchy__taxonomy_vocabul": "vocabulary_1",
                                  "taxonomy_term_data_name": "Health Centre",
                                  "taxonomy_term_data_vid": "1",
                                  "tid": "197",
                                  "taxonomy_vocabulary_machine_name": "vocabulary_1"
                              }];

                spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(placeTypes);
                });
                spyOn(devtrac.common, "logAndShowGenericError");
                spyOn(navigator.store, "put");

                devtrac.dataPull.placeTypes(callback);
            });

            it("should call new method to get remote views with correct URL", function() {
                expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual(DT_D7.PLACE_TYPES);
            });

            it("response should be wrapped in '#data' to ensure forward compatibility", function() {
                expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
            });

            it("parse place types correctly", function() {
                expect(navigator.store.put.mostRecentCall.args[3]).toEqual(
                    '[{"id":"204","name":"Borehole","parentId":"23"},' +
                    '{"id":"3","name":"Government Office","parentId":"49"},' +
                    '{"id":"197","name":"Health Centre","parentId":"2"}]'
                );
            });
        });
    });

    describe("UserProfiles", function(){
        var callback;

        describe("when success", function(){
            var userProfiles;

            beforeEach(function() {
                callback = jasmine.createSpy("Callback");
                userProfiles = [{
                                    "users_name": "thoughwks",
                                    "uid": "146",
                                    "users_status": "0",
                                    "realname_realname": "thoughwks",
                                    "realname_uid": "146",
                                    "users_created": "1328167329"
                                },
                                {
                                    "users_name": "tester1",
                                    "uid": "29",
                                    "users_status": "0",
                                    "realname_realname": "tester1",
                                    "realname_uid": "29",
                                    "users_created": "1295869437"
                                },
                                {
                                    "users_name": "tester2",
                                    "uid": "32",
                                    "users_status": "0",
                                    "realname_realname": "Tester 2",
                                    "realname_uid": "0",
                                    "users_created": "0"
                                }];

                spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(userProfiles);
                });
                spyOn(devtrac.common, "logAndShowGenericError");
                spyOn(navigator.store, "put");

                devtrac.dataPull.userProfiles(callback);
            });

            it("should call new method to get remote views with correct URL", function(){
                expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual(DT_D7.USER_PROFILES);
            })

            it("response should be wrapped in '#data' to ensure forward compatibility", function() {
                expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
            });

            it("parse user profiles correctly", function() {
                expect(navigator.store.put.mostRecentCall.args[3]).toEqual(
                    '[{"uid":"146","username":"thoughwks","name":"thoughwks"},' +
                    '{"uid":"29","username":"tester1","name":"tester1"},' +
                    '{"uid":"32","username":"tester2","name":"Tester 2"}]'
                );
            });
        })
    })

    describe("questions",function(){
        beforeEach(function(){
            devtrac.places = [{id:1, name:"Office"},{id:203, name:"School"}];
            callback = jasmine.createSpy("Callback");
            var questionResponse = [
            {
                "language": "und",
                "nid": "402",
                "questionnaire_question_options": {
                    "und": [
                    {
                        "format": null,
                        "safe_value": "Yes",
                        "value": "Yes"
                    },
                    {
                        "format": null,
                        "safe_value": "No",
                        "value": "No"
                    }]
                 },
                 "questionnaire_question_type": {
	                 "und": [
	                    {
	                        "value": "radios"
	                    }]
                 },
                 "taxonomy_vocabulary_1": {
                     "und": [
	                    {
	                       "tid": "203"
	                    }]
                 },
                 "title": "Do both the community and school have access to the water source at the health facility?",
                 "type": "questionnaire_question"
            },
            {
                "language": "und",
                 "nid": "403",
                 "questionnaire_question_options": {
	                 "und": [
	                    {
	                        "format": null,
	                        "safe_value": "Protected spring",
	                        "value": "Protected spring"
	                    },
	                    {
	                        "format": null,
	                        "safe_value": "Piped water scheme",
	                        "value": "Piped water scheme"
	                    },
	                    {
	                        "format": null,
	                        "safe_value": "Hand pump",
	                        "value": "Hand pump"
	                    }]
                 },
                 "questionnaire_question_type": {
	                 "und": [
	                    {
	                        "value": "checkboxes"
	                    }]
                 },
                 "taxonomy_vocabulary_1": [],
                 "title": "Type of water point?",
                 "type": "questionnaire_question"
            },
            {
                "language": "und",
                 "nid": "404",
                 "questionnaire_question_options": [],
                 "questionnaire_question_type": {
	                 "und": [
	                    {
	                        "value": "number"
	                    }]
                 },
                 "taxonomy_vocabulary_1": [],
                 "title": "Type of water point?",
                 "type": "questionnaire_question"
            }];

            spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(questionResponse);
            });
            spyOn(devtrac.common, "logAndShowGenericError");
            spyOn(navigator.store, "put");
            devtrac.dataPull.questions(callback);
        })

        it("should call new method to get questions with correct URL", function(){
            expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual(DT_D7.QUESTIONS);
        })

        it("response should be wrapped in '#data' to ensure forward compatibility", function() {
            expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
        });

        it("parse questions correctly", function() {
            expect(navigator.store.put.mostRecentCall.args[3]).toEqual(
                '[{"id":"402","title":"Do both the community and school have access to the water source at the health facility?","type":"radios","options":[{"format":null,"safe_value":"Yes","value":"Yes"},{"format":null,"safe_value":"No","value":"No"}],"taxonomy":[{"id":"203","name":"School"}]},' +
                '{"id":"403","title":"Type of water point?","type":"checkboxes","options":[{"format":null,"safe_value":"Protected spring","value":"Protected spring"},{"format":null,"safe_value":"Piped water scheme","value":"Piped water scheme"},{"format":null,"safe_value":"Hand pump","value":"Hand pump"}],"taxonomy":[]},' +
                '{"id":"404","title":"Type of water point?","type":"number","taxonomy":[]}]'
            );
        });
    })

    describe("QuestionTypes", function(){
       it("type of undefined name should be ignored", function(){
          var originalQuestions = [{taxonomy:[{name:"School"}]},{taxonomy:[{name:"Office"}]},{taxonomy:[{name:"undefined name"}]}];
          var questions = new QuestionTypes(originalQuestions);
          var types = questions.locationTypes();

          expect(types.length).toEqual(2);
          expect(types[0]).toEqual("Office");
          expect(types[1]).toEqual("School");
       })
    })
	
    describe("tripSiteDetails", function(){
        var callback;

        describe("when success", function(){
            var siteDetails;
            var fieldTripID = 0;

            beforeEach(function() {
                siteDetails = [{
                                "vid": "582",
                                "uid": "8",
                                "title": "Site Visit at Gulu PTC Demo PS Primary School",
                                "log": "",
                                "status": "1",
                                "comment": "0",
                                "promote": "0",
                                "sticky": "0",
                                "nid": "582",
                                "type": "ftritem",
                                "language": "und",
                                "created": "1300940304",
                                "changed": "1321109637",
                                "tnid": "0",
                                "translate": "0",
                                "revision_timestamp": "1321109637",
                                "revision_uid": "0",
                                "taxonomy_vocabulary_8": [
                                ],
                                "taxonomy_vocabulary_1": [
                                ],
                                "taxonomy_vocabulary_7": {
                                  "und": [
                                    {
                                      "tid": "209"
                                    }
                                  ]
                                },
                                "field_ftritem_date_visited": {
                                  "und": [
                                    {
                                      "value": "2011-03-24T00:00:00",
                                      "timezone": "Africa\/Kampala",
                                      "timezone_db": "Africa\/Kampala",
                                      "date_type": "date"
                                    }
                                  ]
                                },
                                "field_ftritem_images": [
                                ],
                                "field_ftritem_lat_long": {
                                  "und": [
                                    {
                                      "wkt": "POINT (32.34780701 2.78787083)",
                                      "geo_type": "geometrycollection",
                                      "lat": "2.78787",
                                      "lon": "32.3478",
                                      "left": "32.3478",
                                      "top": "2.78787",
                                      "right": "32.3478",
                                      "bottom": "2.78787",
                                      "srid": "4326",
                                      "accuracy": null,
                                      "source": null
                                    }
                                  ]
                                },
                                "field_ftritem_narrative": {
                                  "und": [
                                    {
                                      "value": "Please provide a full report.",
                                      "format": null
                                    }
                                  ]
                                },
                                "field_ftritem_public_summary": {
                                  "und": [
                                    {
                                      "value": "Please Provide a small summary for the public.",
                                      "format": null
                                    }
                                  ]
                                },
                                "field_ftritem_status": {
                                  "und": [
                                    {
                                      "value": "Submitted"
                                    }
                                  ]
                                },
                                "field_ftritem_field_trip": {
                                  "und": [
                                    {
                                      "target_id": "580",
                                      "target_type": "node"
                                    }
                                  ]
                                },
                                "field_ftritem_place": {
                                  "und": [
                                    {
                                      "target_id": "581",
                                      "target_type": "node"
                                    }
                                  ]
                                },
                                "cid": 0,
                                "last_comment_timestamp": "1300940304",
                                "last_comment_name": "",
                                "last_comment_uid": "8",
                                "comment_count": 0,
                                "name": "terraw",
                                "picture": "0",
                                "data": "a:5:{s:13:\"form_build_id\";s:37:\"form-1050f68a726df9c11f0702f838f43047\";s:14:\"picture_delete\";s:0:\"\";s:14:\"picture_upload\";s:0:\"\";s:29:\"taxonomy_image_disable_images\";i:0;s:7:\"contact\";i:1;}"
                              },
                              {
                                "vid": "606",
                                "uid": "26",
                                "title": "Site Visit at Kisojo Primary School",
                                "log": "",
                                "status": "1",
                                "comment": "0",
                                "promote": "0",
                                "sticky": "0",
                                "nid": "606",
                                "type": "ftritem",
                                "language": "und",
                                "created": "1300969198",
                                "changed": "1321109637",
                                "tnid": "0",
                                "translate": "0",
                                "revision_timestamp": "1321109637",
                                "revision_uid": "0",
                                "taxonomy_vocabulary_8": [
                                ],
                                "taxonomy_vocabulary_1": [
                                ],
                                "taxonomy_vocabulary_7": {
                                  "und": [
                                    {
                                      "tid": "209"
                                    }
                                  ]
                                },
                                "field_ftritem_date_visited": {
                                  "und": [
                                    {
                                      "value": "2011-03-24T00:00:00",
                                      "timezone": "Africa\/Kampala",
                                      "timezone_db": "Africa\/Kampala",
                                      "date_type": "date"
                                    }
                                  ]
                                },
                                "field_ftritem_images": [
                                ],
                                "field_ftritem_lat_long": [
                                ],
                                "field_ftritem_narrative": {
                                  "und": [
                                    {
                                      "value": "Please provide a full report.",
                                      "format": null
                                    }
                                  ]
                                },
                                "field_ftritem_public_summary": {
                                  "und": [
                                    {
                                      "value": "Please Provide a small summary for the public.",
                                      "format": null
                                    }
                                  ]
                                },
                                "field_ftritem_status": {
                                  "und": [
                                    {
                                      "value": "Submitted"
                                    }
                                  ]
                                },
                                "field_ftritem_field_trip": {
                                  "und": [
                                    {
                                      "target_id": "601",
                                      "target_type": "node"
                                    }
                                  ]
                                },
                                "field_ftritem_place": {
                                  "und": [
                                    {
                                      "target_id": "605",
                                      "target_type": "node"
                                    }
                                  ]
                                },
                                "cid": 0,
                                "last_comment_timestamp": "1300969198",
                                "last_comment_name": "",
                                "last_comment_uid": "26",
                                "comment_count": 0,
                                "name": "hakullu",
                                "picture": "0",
                                "data": "a:5:{s:7:\"contact\";i:1;s:29:\"taxonomy_image_disable_images\";i:0;s:14:\"picture_delete\";i:0;s:14:\"picture_upload\";s:0:\"\";s:13:\"form_build_id\";s:37:\"form-d13af5fcd8529ad32b9acc6f84a98c23\";}"
                            }];

                fieldTripID = 5257;
                devtrac.dataPull.fieldTrip = {"id": fieldTripID};

                callback = jasmine.createSpy("Callback");
                spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(siteDetails);
                });
                spyOn(devtrac.common, "logAndShowGenericError");
                spyOn(navigator.store, "put");
                spyOn(devtrac.dataPull, "placeDetailsForSite");

                devtrac.dataPull.tripSiteDetails(callback);
            });

            it("should call new method to get remote views with correct URL", function(){
                expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual(DT_D7.SITE_DETAILS.replace('<FIELD_TRIP_NID>', fieldTripID));
            })

            it("response should be wrapped in '#data' to ensure forward compatibility", function() {
                expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
            });

            it("parse trip site details correctly", function() {
                var expected_sites = [];

                var site = new Site();
                site.id = '582';
                site.name = "Site Visit at Gulu PTC Demo PS Primary School";
                site.placeId = '581';
                site.narrative = "Please provide a full report.";
                site.dateVisited = "24/03/2011";
                site.placeGeo = "POINT (32.34780701 2.78787083)";
                expected_sites.push(site);

                site = new Site();
                site.id = '606';
                site.name = "Site Visit at Kisojo Primary School";
                site.placeId = '605';
                site.narrative = "Please provide a full report.";
                site.dateVisited = "24/03/2011";
                expected_sites.push(site);

                expect(devtrac.dataPull.fieldTrip.sites).toEqual(expected_sites)
            })
        })
    })

    describe("placeDetailsForSite", function(){
        var callback;

        describe("when success", function(){
            var placeDetails;
            var siteID = 0;

            beforeEach(function() {
                placeDetails = [{
                                 "vid": "581",
                                 "uid": "8",
                                 "title": "Gulu PTC Demo PS",
                                 "log": "",
                                 "status": "1",
                                 "comment": "0",
                                 "promote": "0",
                                 "sticky": "0",
                                 "nid": "581",
                                 "type": "place",
                                 "language": "und",
                                 "created": "1300940304",
                                 "changed": "1305793715",
                                 "tnid": "0",
                                 "translate": "0",
                                 "revision_timestamp": "1305793715",
                                 "revision_uid": "8",
                                 "taxonomy_vocabulary_6": [
                                 ],
                                 "taxonomy_vocabulary_2": [
                                 ],
                                 "taxonomy_vocabulary_1": {
                                   "und": [
                                     {
                                       "tid": "195"
                                     }
                                   ]
                                 },
                                 "field_place_email": {
                                   "und": [
                                     {
                                       "email": "terra@gmail.com"
                                     }
                                   ]
                                 },
                                 "field_place_phone": {
                                   "und": [
                                     {
                                       "value": "099999999",
                                       "format": null,
                                       "safe_value": "099999999"
                                     }
                                   ]
                                 },
                                 "field_place_responsible_person": {
                                   "und": [
                                     {
                                       "value": "gt",
                                       "format": null,
                                       "safe_value": "gt"
                                     }
                                   ]
                                 },
                                 "field_place_sourcelayer": {
                                   "und": [
                                     {
                                       "value": "SchoolsNorth",
                                       "format": null,
                                       "safe_value": "SchoolsNorth"
                                     }
                                   ]
                                 },
                                 "field_place_sourceuri": {
                                   "und": [
                                     {
                                       "value": "http:\/\/www.devtrac.ug\/places",
                                       "format": null,
                                       "safe_value": "http:\/\/www.devtrac.ug\/places"
                                     }
                                   ]
                                 },
                                 "field_place_unique_id": {
                                   "und": [
                                     {
                                       "value": "189",
                                       "format": null,
                                       "safe_value": "189"
                                     }
                                   ]
                                 },
                                 "field_place_website": [
                                 ],
                                 "field_place_contact_info": [
                                 ],
                                 "cid": 0,
                                 "last_comment_timestamp": "1300940304",
                                 "last_comment_name": "",
                                 "last_comment_uid": "8",
                                 "comment_count": 0,
                                 "name": "terraw",
                                 "picture": "0",
                                 "data": "a:5:{s:13:\"form_build_id\";s:37:\"form-1050f68a726df9c11f0702f838f43047\";s:14:\"picture_delete\";s:0:\"\";s:14:\"picture_upload\";s:0:\"\";s:29:\"taxonomy_image_disable_images\";i:0;s:7:\"contact\";i:1;}"
                                }];

                siteID = 582;
                var site = new Site();
                site.id = siteID;

                devtrac.dataPull.sites = [];
                devtrac.dataPull.fieldTrip.sites = [];

                devtrac.dataPull.sites.push(site);
                devtrac.dataPull.fieldTrip.sites.push(site);
                devtrac.places = [
                    {"id":"204", "name":"Borehole",          "parentId":"23"},
                    {"id":"7",   "name":"Government Office", "parentId":"49"},
                    {"id":"195", "name":"Health Centre",     "parentId":"2"}
                ];

                callback = jasmine.createSpy("Callback");
                spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(placeDetails);
                });
                spyOn(devtrac.common, "logAndShowGenericError");
                spyOn(devtrac.dataPull, "actionItemDetailsForSite");

                devtrac.dataPull.placeDetailsForSite(callback);
            });

            it("should call new method to get remote views with correct URL", function(){
                expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual(DT_D7.SITE_PLACES.replace('<SITE_NID>', siteID));
            })

            it("response should be wrapped in '#data' to ensure forward compatibility", function() {
                expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
            });

            it("parse places for the site correctly", function() {
                var expected_sites = [];

                var site = new Site();
                site.id = 582;
                site.name = '';
                site.placeId = '581';
                site.placeName = "Gulu PTC Demo PS";

                var taxonomy = new PlaceTaxonomy();
                taxonomy.id = '195';
                taxonomy.name = undefined;
                site.type = "Health Centre";
                site.placeTaxonomy.push(taxonomy);

                site.contactInfo = {
                    name: 'gt',
                    phone: '099999999',
                    email: 'terra@gmail.com',
                    uploaded: true
                };

                expected_sites.push(site);

                expect(devtrac.dataPull.fieldTrip.sites).toEqual(expected_sites)
            })
        })
    })

    describe("actionItemDetailsForSite", function(){
        var callback;

        describe("when success", function(){
            var actionItems = [];
            var siteID = 0;

            beforeEach(function() {
                actionItems = [
                               {
                                   "changed": "1329128643",
                                   "cid": "0",
                                   "comment": "2",
                                   "comment_count": "0",
                                   "created": "1329128643",
                                   "data": "a:6:{s:13:\"form_build_id\";s:37:\"form-294b8c011bb6a8a87f63672d7145c263\";s:14:\"picture_delete\";s:0:\"\";s:14:\"picture_upload\";s:0:\"\";s:29:\"taxonomy_image_disable_images\";i:0;s:7:\"contact\";i:1;s:5:\"piwik\";a:1:{s:16:\"piwik_token_auth\";s:9:\"anonymous\";}}",
                                   "ds_switch": "",
                                   "field_actionitem_due_date": {
                                       "und": [
                                           {
                                               "date_type": "date",
                                               "timezone": "Africa/Kampala",
                                               "timezone_db": "Africa/Kampala",
                                               "value": "2012-02-13T00:00:00"
                                           }
                                       ]
                                   },
                                   "field_actionitem_followuptask": {
                                       "und": [
                                           {
                                               "format": null,
                                               "value": "There is not much to do"
                                           }
                                       ]
                                   },
                                   "field_actionitem_ftreportitem": {
                                       "und": [
                                           {
                                               "target_id": "1277"
                                           }
                                       ]
                                   },
                                   "field_actionitem_resp_place": {
                                       "und": [
                                           {
                                               "target_id": "1276"
                                           }
                                       ]
                                   },
                                   "field_actionitem_responsible": {
                                       "und": [
                                           {
                                               "target_id": "5"
                                           }
                                       ]
                                   },
                                   "field_actionitem_severity": {
                                       "und": [
                                           {
                                               "value": "3"
                                           }
                                       ]
                                   },
                                   "field_actionitem_status": {
                                       "und": [
                                           {
                                               "value": "3"
                                           }
                                       ]
                                   },
                                   "field_fieldtrip_button": [],
                                   "language": "und",
                                   "last_comment_name": null,
                                   "last_comment_timestamp": "1329128643",
                                   "last_comment_uid": "5",
                                   "log": "",
                                   "name": "reinier",
                                   "nid": "5757",
                                   "picture": "0",
                                   "promote": "0",
                                   "revision_timestamp": "1329128643",
                                   "revision_uid": "5",
                                   "status": "1",
                                   "sticky": "0",
                                   "taxonomy_vocabulary_8": {
                                       "und": [
                                           {
                                               "tid": "221"
                                           }
                                       ]
                                   },
                                   "title": "This is an Action Item for the blackberry application",
                                   "tnid": "0",
                                   "translate": "0",
                                   "type": "actionitem",
                                   "uid": "5",
                                   "vid": "5757"
                               },
                               {
                                   "changed": "1333708548",
                                   "cid": "0",
                                   "comment": "2",
                                   "comment_count": "0",
                                   "created": "1333708548",
                                   "data": "a:6:{s:7:\"contact\";i:1;s:14:\"picture_delete\";s:0:\"\";s:14:\"picture_upload\";s:0:\"\";s:13:\"form_build_id\";s:37:\"form-557ec27ac104213f5cec77b52f27a601\";s:21:\"force_password_change\";i:0;s:29:\"taxonomy_image_disable_images\";i:0;}",
                                   "ds_switch": "",
                                   "field_actionitem_due_date": {
                                       "und": [
                                           {
                                               "date_type": "date",
                                               "timezone": "Africa/Kampala",
                                               "timezone_db": "Africa/Kampala",
                                               "value": "2012-04-06T00:00:00"
                                           }
                                       ]
                                   },
                                   "field_actionitem_followuptask": {
                                       "und": [
                                           {
                                               "format": "1",
                                               "safe_value": "<p>123</p>\n",
                                               "value": "123"
                                           }
                                       ]
                                   },
                                   "field_actionitem_ftreportitem": {
                                       "und": [
                                           {
                                               "target_id": "6693"
                                           }
                                       ]
                                   },
                                   "field_actionitem_resp_place": {
                                       "und": [
                                           {
                                               "target_id": "1276"
                                           }
                                       ]
                                   },
                                   "field_actionitem_responsible": {
                                       "und": [
                                           {
                                               "target_id": "32"
                                           }
                                       ]
                                   },
                                   "field_actionitem_severity": {
                                       "und": [
                                           {
                                               "value": "3"
                                           }
                                       ]
                                   },
                                   "field_actionitem_status": {
                                       "und": [
                                           {
                                               "value": "1"
                                           }
                                       ]
                                   },
                                   "field_fieldtrip_button": [],
                                   "language": "und",
                                   "last_comment_name": null,
                                   "last_comment_timestamp": "1333708548",
                                   "last_comment_uid": "32",
                                   "log": "",
                                   "name": "tester2",
                                   "nid": "6699",
                                   "picture": "0",
                                   "promote": "0",
                                   "revision_timestamp": "1333708548",
                                   "revision_uid": "32",
                                   "status": "1",
                                   "sticky": "0",
                                   "taxonomy_vocabulary_8": [],
                                   "title": "abc",
                                   "tnid": "0",
                                   "translate": "0",
                                   "type": "actionitem",
                                   "uid": "32",
                                   "vid": "6716"
                               }
                           ];

                siteID = 582;
                devtrac.dataPull.sitesForActionItems = [{"id" : siteID}];
                devtrac.dataPull.fieldTrip.sites = [{"id" : siteID}];

                callback = jasmine.createSpy("Callback");
                spyOn(devtrac.remoteView, "get").andCallFake(function(url, successCallback, failedCallback) {
                    successCallback(actionItems);
                });
                spyOn(devtrac.common, "logAndShowGenericError");

                devtrac.dataPull.actionItemDetailsForSite(callback);
            });

            it("should call new method to get remote views with correct URL", function(){
                var url = DT_D7.ACTION_ITEMS.replace('<SITE_NID>', siteID);
                url = url.replace('<FIELD_TRIP_NID>', devtrac.dataPull.fieldTrip.id);
                expect(devtrac.remoteView.get.mostRecentCall.args[0]).toEqual(url);
            })

            it("response should be wrapped in '#data' to ensure forward compatibility", function() {
                expect(devtrac.common.logAndShowGenericError).not.toHaveBeenCalled();
            });

            it("parse action items for site correctly", function() {
                expect(devtrac.dataPull.fieldTrip.sites[0].actionItems).toEqual(
                    [{
                        "id": "5757",
                        "title": "This is an Action Item for the blackberry application",
                        "task": "There is not much to do",
                        "assignedTo": "5",
                        "status": "3",
                        "uploaded": true,
                        "uid": "5"
                     },
                     {
                        "id": "6699",
                        "title": "abc",
                        "task": "123",
                        "assignedTo": "32",
                        "status": "1",
                        "uploaded": true,
                        "uid": "32"
                     }]
                )
            })
        })
    })
});
