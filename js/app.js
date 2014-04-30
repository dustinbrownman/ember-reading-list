App = Ember.Application.create();

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

// Controllers
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

// DataStore
App.ApplicationAdapter = DS.FixtureAdapter.extend({

});

// Models
App.Book = DS.Model.extend({
	title: DS.attr('string'),
	author: DS.attr('string'),
	description: DS.attr('string'),
	rating: DS.attr('number'),
	amazon_id: DS.attr('string'),
	genre: DS.belongsTo('genre'),
	url: function() {
		return 'http://www.amazon.com/gp/product/' + this.get('amazon_id');
	}.property('amazon_id'),
	image: function() {
		return 'http://images.amazon.com/images/P/' + this.get('amazon_id') + '.01.ZTZZZZZZ.jpg';
	}.property('amazon_id')
});

App.Genre = DS.Model.extend({
	name: DS.attr('string'),
	books: DS.hasMany('book', { async: true })
});

App.Book.FIXTURES = [
	{
		id: 1,
		author: 'J.K. Rowling',
		title: 'Harry Potter and the Order of the Pheonix',
		description: "Shoreditch accusamus hashtag, actually eiusmod Bushwick stumptown readymade aesthetic velit minim seitan cornhole. Ethnic bespoke fixie, messenger bag aesthetic anim vero occaecat labore consectetur artisan slow-carb aliquip bicycle rights. Biodiesel velit chambray, viral 8-bit sed Truffaut laborum incididunt nesciunt Banksy nulla. Fap before they sold out jean shorts Blue Bottle. Nostrud twee cray Austin. Street art Marfa craft beer voluptate shabby chic next level, Etsy et fingerstache Bushwick enim delectus. Slow-carb sint do, bicycle rights locavore et enim stumptown retro fap direct trade Tonx meggings Portland.",
		rating: 5,
		amazon_id: '0439358078',
		genre: 1
	},
	{
		id: 2,
		title: 'Harry Potter and the Legend of Zelda',
		author: 'P.T. Brown',
		description: 'Tumblr master cleanse gastropub roof party paleo Thundercats retro non, vero odio tempor banjo exercitation sriracha. Pop-up asymmetrical cred XOXO, 3 wolf moon hoodie tote bag narwhal ea ugh nulla art party anim. Ennui velit freegan delectus, sapiente paleo 3 wolf moon sed nihil tousled ethnic dolor typewriter whatever church-key. Nulla veniam accusamus street art, paleo exercitation PBR normcore vero. Odd Future Austin Tonx XOXO four loko fanny pack occaecat vegan enim esse, pork belly duis pickled proident. Bespoke incididunt distillery, tofu before they sold out Neutra bicycle rights wayfarers scenester Shoreditch tousled. Fugiat fanny pack Williamsburg Helvetica cupidatat wolf pickled.',
		rating: 2,
		amazon_id: '059035342X',
		genre: 2
	}
];

App.Genre.FIXTURES = [
	{
		id: 1,
		name: 'Fiction',
		books: [1]
	},
	{
		id: 2,
		name: 'Non-Fiction',
		books: [2]
	},
	{
		id: 3,
		name: 'Science Fiction',
		books: []
	}
];
