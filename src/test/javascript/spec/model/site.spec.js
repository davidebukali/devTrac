describe("Site", function() {

    describe("packageData", function() {
        var site;
        var user;
        var siteId = 303;
        var siteTitle = "Visit to Jasmine";
        var siteNarrative = "This is testing site.";
        var siteDateVisited = "03/31/2012";
        var fieldTripId = 5752;
        var siteData;

        beforeEach(function() {
                site = new Site();
                site.id = siteId;
                site.name = siteTitle;
                site.narrative = siteNarrative;
                site.dateVisited = siteDateVisited;
                site.offline = false;

                user = new User();
                user.uid = 32;
                user.name = "tester2";
        })

        describe("given an existing site without image", function() {
            beforeEach(function(){
                siteData = devtrac.common.convertHash(Site.packageData(site, fieldTripId));
            })

            it("site title should be packaged as title=xxx&", function() {
                expect(siteData).toMatch(new RegExp("title=" + siteTitle + "&"));
            })

            it("type should be packaged as type=ftritem&", function() {
                expect(siteData).toMatch(new RegExp("type=" + DT_D7.NODE_TYPE.SITE + "&"));
            })

            it("narrative should be packaged as field_ftritem_narrative[und][0][value]=xxx&", function() {
                expect(siteData).toMatch(new RegExp("field_ftritem_narrative\\[und\\]\\[0\\]\\[value\\]=" + siteNarrative + "&"));
            })

            it("summary should be packaged as field_ftritem_public_summary[und][0][value]=xxx&", function() {
                expect(siteData).toMatch(new RegExp("field_ftritem_public_summary\\[und\\]\\[0\\]\\[value\\]=" + siteNarrative + "&"));
            })

            it("date visited should be packaged as field_ftritem_date_visited[und][0][value][date]=xxx&", function() {
                expect(siteData).toMatch(new RegExp("field_ftritem_date_visited\\[und\\]\\[0\\]\\[value\\]\\[date\\]=" + siteDateVisited));
            })
        })

        describe("given an new site without image", function(){
            it("target id should be assigned", function(){
                site.offline = true;
                siteData = devtrac.common.convertHash(Site.packageData(site, fieldTripId));
                expect(siteData).toMatch(new RegExp("field_ftritem_field_trip\\[und\\]\\[0\\]\\[target_id\\]=" + fieldTripId));
            })

            it("position info should be assigned if latitude and longitude have values", function(){
                site.offline = true;
                site.latitude = 30;
                site.longitude = 108;
                siteData = devtrac.common.convertHash(Site.packageData(site, user, fieldTripId));
                expect(siteData).toMatch(new RegExp("field_ftritem_lat_long\\[und\\]\\[0\\]\\[wkt\\]=" + "POINT \\(30 108\\)"));
            })

            it("position info should be assigned if latitude and longitude have values", function(){
                site.offline = true;
                siteData = devtrac.common.convertHash(Site.packageData(site, user, fieldTripId));
                expect(siteData).not.toMatch(new RegExp("field_ftritem_lat_long\\[und\\]\\[0\\]\\[wkt\\]=" + "POINT \\( \\)"));
            })
        })
    })

    describe("updateURL", function() {
        it("should contain its own site ID", function() {
            var site = new Site();
            site.id = 303;
            expect(Site.updateURL(site)).toEqual(DT_D7.NODE_SAVE.replace("<NODE_ID>", site.id));
        })
    })

    describe("setDateVisited", function() {

        describe("given format is 'yyyy-MM-ddT00:00:00'", function() {
            var site;
            var year = "2012";
            var month = "03";
            var day = "31";

            beforeEach(function() {
                site = new Site();
                Site.setDateVisited(site, year + "-" + month + "-" + day + "T00:00:00");
            })

            it("parsed year from string", function() {
                expect(site.dateVisited).toMatch(new RegExp("^\\d\\d/\\d\\d/" + year + "$"));
            })

            it("parsed month from string", function() {
                expect(site.dateVisited).toMatch(new RegExp("^\\d\\d/" + month + "/\\d\\d\\d\\d$"));
            })

            it("parsed day from string", function() {
                expect(site.dateVisited).toMatch(new RegExp("^" + day +"/\\d\\d/\\d\\d\\d\\d$"));
            })
        })
    })
})
