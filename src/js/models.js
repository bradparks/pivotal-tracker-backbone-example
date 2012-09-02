/*global $, Backbone */
/*jshint curly: false, laxcomma: true */

var PTrack = PTrack || {};

Backbone.originalSync = Backbone.sync;

// Override sync so we can process XML.
Backbone.sync = function(method, model, options)
{
	var error = options.error;

	if( PTrack.session.isAuthenticated() )
	{
		options.headers = {
			'X-TrackerToken': PTrack.session.get("guid")
		};
	}

	options.error = function(xhr, textStatus, errorText){

		if(xhr.status === 200 && xhr.statusText === "OK")
			options.success(xhr.responseText, xhr.status);
		else
			error(xhr, textStatus, errorText);
	};

	Backbone.originalSync.apply(Backbone, [method, model, options]);
};


(function(){

	PTrack.Models = PTrack.Models || {};

	// TODO: Rename to session
	PTrack.Models.LoginToken = Backbone.Model.extend({

		initialize: function()
		{
			this.load();
		}

		, url: function(){
			return "https://www.pivotaltracker.com/services/v3/tokens/active";
		}

		, fetch: function(options)
		{
			options.headers = {
				'Authorization':'Basic '+btoa(this.get("username")+":"+this.get("password"))
			};

			return Backbone.Model.prototype.fetch.call(this, options);
		}

		, parse: function(resp)
		{
			var xml = $.parseXML(resp);
			var guid;

			xml = $(xml);
			guid = xml.find("guid").text();

			return {guid: guid};
		}

		, isAuthenticated: function()
		{
			return Boolean(this.get("guid"));
		}

		, load: function()
		{
			var data;

			// retrive from local storage
			data = localStorage.getItem("ptrack_session");
			if( data )
			{
				data = localStorage.getItem("ptrack_session");
				data = JSON.parse(data);

				this.set("username", data.username);
				this.set("guid", data.guid);
			}
		}

		, save: function()
		{
			var data = {};

			data.username = this.get("username");
			data.guid = this.get("guid");

			localStorage.setItem("ptrack_session", JSON.stringify(data));
		}

		, remove: function()
		{
			this.unset("guid");
			localStorage.removeItem("ptrack_session");
		}
	});

	PTrack.Models.Project = Backbone.Model.extend({
		parse: function(resp)
		{
			var xml;
			var id;
			var name;
			var account;

			if( typeof(resp) === "string" )
			{
				xml = $.parseXML(resp);
				xml = $(xml);
			}
			else
				xml = $(resp);

			id = xml.find("id").text();
			name = xml.find("> name").text();
			account = xml.find("account").text();


			this.set("id", id);
			this.set("name", name);
			this.set("account", account);
		}

		, urlRoot: function(){
			return "http://www.pivotaltracker.com/services/v3/projects";
		}
	});
})();