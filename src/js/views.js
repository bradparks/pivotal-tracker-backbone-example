/*global $, alert, Backbone, _ */
/*jshint curly: false, laxcomma: true */

var PTrack = PTrack || {};

(function(){
	PTrack.Views = PTrack.Views || {};

	PTrack.Views.HeaderView = Backbone.View.extend({

		initialize: function(options){

			var self = this;

			this.dispatcher = options.dispatcher;

			this.setState( PTrack.session.isAuthenticated() ? "login" : "logout" );

			this.dispatcher.on(PTrack.actions.LOGIN_SUCCESS, function(){
				self.setState("login");
			});

			this.dispatcher.on(PTrack.actions.LOGOUT_SUCCESS, function(){
				self.setState("logout");
			});
		}

		, events: {
			"click nav.auth .login": "loginClickHandler"
			, "click nav.auth .logout": "logoutClickHandler"
			, "click nav.main .projects": "projectsClickHandler"
			, "click nav.main .activity": "activityClickHandler"
		}

		, setState: function(state)
		{
			if( state === "login" )
			{
				$(this.el).find(".login").hide();
				$(this.el).find(".logout").show();
			}


			if( state === "logout" )
			{
				$(this.el).find(".login").show();
				$(this.el).find(".logout").hide();
			}
		}

		, loginClickHandler: function()
		{
			Backbone.history.navigate("login/", true);
			return false;
		}
		, logoutClickHandler: function()
		{
			Backbone.history.navigate("logout/", true);
			return false;
		}

		, projectsClickHandler: function(){
			Backbone.history.navigate("", true);
			return false;
		}

		, activityClickHandler: function(){
			// Backbone.history.navigate("", true);
			alert("Not implemented");
			return false;
		}

	});


	PTrack.Views.ProjectsView = Backbone.View.extend({
		tagName: "div"

		, initialize: function(options){
			this.dispatcher = options.dispatcher;
			this.template = _.template($("#projects-template").html());

			// create projects view
			this.collection = options.collection;
		}

		, events: {
			"click .list .project": "projectClickHandler"
		}

		, projectClickHandler: function(){
			alert("Not implemented");
			return false;
		}

		, render: function(){
			$(this.el).html(this.template(
				{projects: this.collection.toJSON()}
			));
		}

		, destroy: function(){
			this.trigger("destroy");
			this.remove();
			this.unbind();
		}

		, remove: function(){
			$(this.el).remove();
		}
	});

	PTrack.Views.LoginView = Backbone.View.extend({

		tagName: "div"

		, initialize: function(options){
			this.dispatcher = options.dispatcher;
			this.template = _.template($("#login-template").html());
			this.error = "";
		}

		, events: {
			"click button": "submitHandler"
		}

		, showError: function(error){
			this.error = error;
			this.render();
		}

		, getUsername: function(){
			var field = $(this.el).find('input[name="username"]');
			var val = field.val();
			return (val === undefined ? "" : val);
		}

		, getPassword: function(){
			var field = $(this.el).find('input[name="password"]');
			var val = field.val();
			return (val === undefined ? "" : val);
		}

		, submitHandler: function(){
			this.trigger("submit",
				{
					username: this.getUsername()
					, password: this.getPassword()
				}
			);
			return false;
		}

		, render: function(){
			$(this.el).html(this.template({
				error: this.error
				, username: this.getUsername()
				, password: this.getPassword()
			}));
		}

		, destroy: function(){
			this.trigger("destroy");
			this.remove();
			this.unbind();
		}

		, remove: function(){
			$(this.el).remove();
		}
	});
})();