App.IndexController = Ember.ArrayController.extend({
	// intentionally empty
});

App.BooksController = Ember.ArrayController.extend({
	sortProperties: ['title'],
});

App.GenresController = Ember.ArrayController.extend({
	sortProperties: ['name'],
});

App.BookController = Ember.ObjectController.extend({
	ratings: [1, 2, 3, 4, 5]
});

App.BooksNewController = Ember.ObjectController.extend({
	needs: 'genres',
	actions: {
		createBook: function() {
			var controller = this;
			this.get('model').save().then(function() {
				controller.transitionToRoute('index');
			});
		}
	},
	ratings: [1, 2, 3, 4, 5],
	genres: ["hello", "there"]
});