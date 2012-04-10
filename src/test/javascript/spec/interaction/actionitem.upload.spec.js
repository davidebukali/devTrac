describe("ActionItemUpload", function() {
    var progressCallback;
    var successCallback;
    var errorCallback;

    describe("uploadMultiple", function() {
        var siteID = 6666;
        var placeID = 1276;
        var actionItems = [];

        beforeEach(function() {
            progressCallback = jasmine.createSpy('progressCallback');
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');

            devtrac.profiles = [];

            var profile = new UserProfile();
            profile.uid = 32;
            profile.username = 'tester2';
            profile.name = 'Test Account 2';
            devtrac.profiles.push(profile);

            actionItems = [];

            var item = new ActionItem();
            item.id = 1;
            item.title = "AI 1";
            item.task = "test 1";
            item.assignedTo = "tester1";
            actionItems.push(item);

            var item = new ActionItem();
            item.id = 2;
            item.title = "AI 2";
            item.task = "test 2";
            item.assignedTo = "tester2";
            actionItems.push(item);
        })

        it("should use POST method to upload", function() {
            spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, callback, errorCallback) {
                callback({"nid":"6675","uri":"http://geo.devtrac.org/api/node/6675"});
            });

            devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);

            expect(devtrac.common.callServicePost.callCount).toEqual(actionItems.length);
        })

        it("should send correct data", function() {
            spyOn(navigator.network, "XHR").andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback) {
                successCallback({"nid":"6675","uri":"http://geo.devtrac.org/api/node/6675"});
            });

            devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);

            expect(navigator.network.XHR.mostRecentCall.args[3]).toEqual('title=AI 2&type=actionitem&field_actionitem_ftreportitem[und][0][target_id]=6666&field_actionitem_resp_place[und][0][target_id]=1276&field_actionitem_due_date[und][0][value][date]=' + devtrac.common.getOneMonthLaterDate() + '&field_actionitem_responsible[und][0][target_id]=tester2 (32)&field_actionitem_followuptask[und][0][value]=test 2&language=und&');
        })

        describe("update the 'uploaded' attribute", function(){

            beforeEach(function() {
                actionItems = [];

                itemFailed = new ActionItem();
                itemFailed.id = 0;
                itemFailed.title = "FAILED one";
                itemFailed.task = "task failed";
                itemFailed.assignedTo = "testerFailed";

                actionItems.push(itemFailed);
            })

            it("to 'ture' when uploaded successfully", function(){
                spyOn(navigator.network, "XHR").andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback) {
                    successCallback({"nid":"6675","uri":"http://geo.devtrac.org/api/node/6675"});
                });

                devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);

                expect(actionItems[0].uploaded).toBeTruthy();
            })

            it("to 'false' when uploaded failed", function(){
                spyOn(navigator.network, "XHR").andCallFake(function(cookie, method, URL, POSTdata, successCallback, errorCallback) {
                    errorCallback({error:true,message:'Bad server response.',httpcode:406});
                });

                devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);

                expect(actionItems[0].uploaded).toBeFalsy();
            })
        })

        describe("callback should be called correctly", function(){
            var itemSuccessful;
            var itemFailed;

            beforeEach(function() {
                actionItems = [];

                itemSuccessful = new ActionItem();
                itemSuccessful.id = 0;
                itemSuccessful.title = "YES one";
                itemSuccessful.task = "task successful";
                itemSuccessful.assignedTo = "testerSuccessful";

                itemFailed = new ActionItem();
                itemFailed.id = 0;
                itemFailed.title = "FAILED one";
                itemFailed.task = "task failed";
                itemFailed.assignedTo = "testerFailed";

                spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, callback, errorCallback) {
                    if (/YES/.test(postData.title)) {
                        callback({"nid":"6675","uri":"http://geo.devtrac.org/api/node/6675"});
                    } else {
                        errorCallback({"#error": true});
                    }
                })
            })

            it("'successCallback' should be called when all action items uploaded successfully", function() {
                actionItems.push(itemSuccessful);
                actionItems.push(itemSuccessful);
                devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);
                expect(successCallback).toHaveBeenCalledWith('Uploading finished. 0 failure in 2 items.');
            })

            it("'errorCallback' should be called when some of all action items uploaded successfully", function() {
                actionItems.push(itemSuccessful);
                actionItems.push(itemFailed);
                actionItems.push(itemSuccessful);
                devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);
                expect(errorCallback).toHaveBeenCalledWith('Uploading finished. 1 failure in 3 items.');
            })

            it("'errorCallback' should be called when some of all action items uploaded successfully", function() {
                actionItems.push(itemFailed);
                actionItems.push(itemFailed);
                actionItems.push(itemFailed);
                devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);
                expect(errorCallback).toHaveBeenCalledWith('Uploading finished. 3 failure in 3 items.');
            })
        })

        describe("some items had been uploaded", function() {
            var itemUploaded;
            var itemNotUploaded;

            beforeEach(function() {
                actionItems = [];

                itemUploaded = new ActionItem();
                itemUploaded.id = 123;
                itemUploaded.title = "Uploaded One";
                itemUploaded.task = "task uploaded";
                itemUploaded.assignedTo = "testerUploaed";
                itemUploaded.uploaded = true;

                itemNotUploaded = new ActionItem();
                itemNotUploaded.id = 0;
                itemNotUploaded.title = "Not Uploaded One";
                itemNotUploaded.task = "task not uploaded";
                itemNotUploaded.assignedTo = "testerNotUploaded";
                itemNotUploaded.uploaded = false;

                actionItems.push(itemUploaded);
                actionItems.push(itemNotUploaded);

                spyOn(devtrac.common, "callServicePost").andCallFake(function(url, postData, callback, errorCallback) {
                    callback({"nid":"6675","uri":"http://geo.devtrac.org/api/node/6675"});
                })
            })

            it("should only upload the items which uploaded failed", function() {
                devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);
                expect(itemNotUploaded.uploaded).toBeTruthy();
            })

            it("should NOT upload the items which already uploaded", function() {
                devtrac.actionItemUpload.uploadMultiple(actionItems, siteID, placeID, progressCallback, successCallback, errorCallback);
                expect(devtrac.common.callServicePost.callCount).toEqual(1);
            })
        })
    })
})
