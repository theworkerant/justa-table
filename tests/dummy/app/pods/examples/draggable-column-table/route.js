import Ember from 'ember';
import faker from 'faker';

export default Ember.Route.extend({
  model() {
    let users = [];
    let sortableHeaders = [];

    for (let i = 0; i < 50; i++) {
      let user = Ember.Object.create({
        displayName: faker.name.findName(),
        catchPhrase: faker.company.catchPhrase(),
        buzz: faker.company.bsBuzz()
      });

      users.push(user);
    }

    sortableHeaders = Ember.A([
      {
        width: 150,
        headerName: 'Name',
        valueBindingPath: 'displayName',
        index: 0
      },
      {
        headerName: 'CatchPhrase',
        valueBindingPath: 'catchPhrase',
        index: 1
      },
      {
        headerName: 'Buzz',
        valueBindingPath: 'buzz',
        index: 2
      }
    ]);

    return Ember.RSVP.hash({ users, sortableHeaders });
  }
});
