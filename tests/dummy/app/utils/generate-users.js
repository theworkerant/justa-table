import Ember from 'ember';
import faker from 'faker';

export default function generateUsers(number=50, detailed=false) {
  let users = [];
  for (let i = 0; i < number; i++) {
    if (detailed) {
      let user = Ember.Object.create({
        displayName: faker.name.findName(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        flagged: faker.random.boolean(),
        company: faker.company.companyName()
      });
      users.push(user);
    } else {
      let user = Ember.Object.create({
        displayName: faker.name.findName(),
        image: faker.image.avatar(),
        one: faker.company.catchPhrase(),
        two: faker.company.bsBuzz()
      });
      users.push(user);
    }
  }
  return users;
}
