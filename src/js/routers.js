/*global Backbone */
/*jshint curly: false, laxcomma: true */

var PTrack = PTrack || {};

(function(){
	PTrack.Routers = PTrack.Routers || {};

	PTrack.Routers.MainRouter = Backbone.Router.extend({
		routes: {
			"" : "projectsRoute"
			, "login/" : "loginRoute"
			, "logout/" : "logoutRoute"
			, "projects/" : "projectsRoute"
		}

		, states: []

		, initialize: function(options){
			this.dispatcher = options.dispatcher;

			var headerView = new PTrack.Views.HeaderView({
				el: $("header")
				, dispatcher: options.dispatcher
			});
		}

		// State management
		, removeStates: function(){
			_.each(this.states, function(state){
				state.destroy();
			});
		}

		, addState: function(view){
			this.states.push(view);
		}

		// Routes
		, indexRoute: function(){
			if( !PTrack.session.isAuthenticated() )
				return Backbone.history.navigate("login/", true);
		}

		, loginRoute: function(){
			this.removeStates();

			var loginView;

			// Render view
			loginView = new PTrack.Views.LoginView({dispatcher: this.dispatcher});
			loginView.render();
			$("#container").append(loginView.el);

			// View handlers
			var submitHandler = function(data){
				this.dispatcher.trigger(PTrack.actions.ATTEMPT_LOGIN, data);
			};

			var loginFailedHandler = function(model){
				loginView.showError("Login failed");
			};

			var loginSuccessHandler = function(model){
				return Backbone.history.navigate("", true);
			};

			var destroyHandler = function(){
				loginView.off("submit", submitHandler);
				this.dispatcher.off(PTrack.actions.LOGIN_FAILED, loginFailedHandler);
				this.dispatcher.off(PTrack.actions.LOGIN_SUCCESS, loginSuccessHandler);
				loginView.off("destroy", destroyHandler);
			};

			// Talk with session
			loginView.on("submit", submitHandler);

			// Display error if login was not that successfull
			this.dispatcher.on(PTrack.actions.LOGIN_FAILED, loginFailedHandler);

			// Redirect if login was succesfull
			this.dispatcher.on(PTrack.actions.LOGIN_SUCCESS, loginSuccessHandler);

			// Destroy handler
			loginView.on("destroy", destroyHandler);

			// save state 
			// TODO: (create state view and wrap this inside)
			this.addState(loginView);
		}

		, logoutRoute: function(){
			if( !PTrack.session.isAuthenticated() )
			{
				return Backbone.history.navigate("login/", true);
			}

			PTrack.session.remove();
			this.dispatcher.trigger(PTrack.actions.LOGOUT_SUCCESS);
			return Backbone.history.navigate("login/", true);

		}

		, projectsRoute: function(){

			if( !PTrack.session.isAuthenticated() )
				return Backbone.history.navigate("login/", true);

			this.removeStates();

			var projectsCollection;
			var projectsView;

			projectsCollection = new PTrack.Collections.Projects();

			// Create view
			projectsView = new PTrack.Views.ProjectsView({
				dispatcher: this.dispatcher
				, collection: projectsCollection
			});
			projectsView.render();
			$("#container").append(projectsView.el);

			projectsCollection.bind("reset", projectsView.render, projectsView);
			projectsCollection.fetch();

			var destroyHandler = function(){
				projectsCollection.unbind("reset", projectsView.render, projectsView);
			};

			projectsView.on("destroy", destroyHandler);

			// save state
			this.addState(projectsView);
		}
	});
})();