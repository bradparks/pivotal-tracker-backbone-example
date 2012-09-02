/*global Backbone, $, PTrack: true */
/*jshint curly: false, laxcomma: true */


$(function(){
	var mainRouter;

	PTrack.dispatcher = _.extend({}, Backbone.Events);

	PTrack.actions = {
		ATTEMPT_LOGIN: "attemptLogin"
		, LOGIN_FAILED: "loginFailed"
		, LOGIN_SUCCESS: "loginSuccess"
		, LOGOUT_SUCCESS: "logoutSuccess"
	};

	PTrack.session = new PTrack.Models.LoginToken();

	mainRouter = new PTrack.Routers.MainRouter({dispatcher: PTrack.dispatcher});


	// Handler that "talks" with LoginToken aka Session
	var attemptLoginHandler = function(data)
	{
		PTrack.session.set("username", data.username);
		PTrack.session.set("password", data.password);

		// TODO: These should be generated from within model
		// EXAMPLE: PTrack.session.login(...)
		PTrack.session.fetch({
			success: function(model, xhr){
				PTrack.session.save();
				PTrack.dispatcher.trigger(PTrack.actions.LOGIN_SUCCESS, model, xhr);
			}
			, error: function(model, xhr){
				PTrack.dispatcher.trigger(PTrack.actions.LOGIN_FAILED, model, xhr);
			}
		});
	};

	PTrack.dispatcher.on(PTrack.actions.ATTEMPT_LOGIN, attemptLoginHandler);

	Backbone.history.start({pushState: true});
});