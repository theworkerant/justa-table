import Ember from 'ember';
import generateUsers from 'dummy/utils/generate-users';

export default Ember.Route.extend({
  model() {
    return generateUsers(10, true);
  }
});
