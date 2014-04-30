// Router
App.Router.map(function() {
  this.route('index', { path: '/'});
  this.resource('books', function() {
  	this.resource('books.new', { path: '/new' });
  });
  this.resource('book',  { path: '/books/:id' });
  this.resource('genre', { path: '/genres/:id' }); 
});

// Routes
App.IndexRoute = Ember.Route.extend({
  model: function() {
  	return Ember.RSVP.hash({
  		books: this.store.find('book'),
  		genres: this.store.find('genre')
  	});
  },
  setupController: function(controller, model) {
  	controller.set('books', model.books);
  	controller.set('genres', model.genres);
  }
});

App.BooksRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('book');
	}
})

App.BookRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('book', params.id);
	}
});

App.BooksNewRoute = Ember.Route.extend({
	model: function() {
		return Ember.RSVP.hash({
			book: this.store.createRecord('book'),
			genres: this.store.find('genre')
		});
	},
	setupController: function(controller, model) {
		controller.set('model', model.book);
		controller.set('genres', model.genres);
	},
	actions: {
		willTransition: function(transition) {
			var isNew = this.currentModel.book.get('isNew');
			if(isNew) {
				var confirmation = confirm("Are you sure you want to abandon progress?");
				if(confirmation) {
					this.currentModel.book.destroyRecord();
				} else {
					transition.abort();
				}
			}
		}
	}
});

App.GenreRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('genre', params.id)
	}
});