import { faker } from "@faker-js/faker";


function createRandomUser() {
  const dob = faker.date.birthdate();
  const ssn = faker.database.mongodbObjectId();

  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    dob: dob,
    dob_unencrypted: dob,
    patientRecord: {
      ssn: ssn,
      ssn_unencrypted: ssn,
      billing: {
        type: faker.finance.creditCardIssuer(),
        number: faker.finance.creditCardNumber(),
      },
      billAmount: parseInt(faker.finance.amount({ min: 100, max: 1000 })),
    },
  };
}

const generateRandomUsers = (numberOfUsers = 100) => {
  return faker.helpers.multiple(createRandomUser, {
    count: numberOfUsers,
  });
}

export default generateRandomUsers;