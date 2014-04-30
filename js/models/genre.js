App.Genre = DS.Model.extend({
	name: DS.attr('string'),
	books: DS.hasMany('book', { async: true })
});

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