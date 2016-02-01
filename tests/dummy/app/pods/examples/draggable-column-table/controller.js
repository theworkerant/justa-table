import Ember from 'ember';

const {
  Controller,
  computed,
} = Ember;

export default Controller.extend({
  sortedOrder: ['ordinal'],
  sortedHeaders: computed('model.sortableHeaders.@each.ordinal', function() {
    return Ember.computed.sort('model.sortableHeaders', this.get('sortedOrder'));
  }),
  beerObjectList: Ember.A([
    {
      headerName: 'Guiness',
      ordinal: 0,
      valueBindingPath: 'displayName'
    },
    {
      headerName: 'Stella',
      ordinal: 1,
      valueBindingPath: 'catchPhrase'
    },
    {
      headerName: 'Bud',
      ordinal: 2,
      valueBindingPath: 'buzz'
    }
  ])
});
