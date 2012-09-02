/*global $, Backbone, _ */
/*jshint curly: false, laxcomma: true */

var PTrack = PTrack || {};


(function(){
	PTrack.Collections = PTrack.Collections || {};

	PTrack.Collections.Projects = Backbone.Collection.extend({
		model: PTrack.Models.Project

		, initialize: function()
		{
		}

		, parse: function(resp)
		{
			var xml;
			var projects;
			var parsed = [];

			xml = $.parseXML(resp);
			xml = $(xml);

			projects = xml.find("project");
			_.each(projects, function(project){
				var item = new PTrack.Models.Project();
				item.parse(project);
				parsed.push(item);
			});

			return parsed;
		}

		, url: function(){
			return "http://www.pivotaltracker.com/services/v3/projects";
		}
	});
})();