import { faker } from "@faker-js/faker";


function createRandomUser() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      dob: faker.date.birthdate(),
      patientRecord: {
        ssn: faker.database.mongodbObjectId(),
        billing: {
          type: faker.finance.creditCardIssuer(),
          number: faker.finance.creditCardNumber(),
        },
        billAmount: parseInt(faker.finance.amount({ min: 100, max: 1000})),
      },
    };
  }
  
  const generateRandomUsers = (numberOfUsers = 100) => {
    return faker.helpers.multiple(createRandomUser, {
     count: numberOfUsers,
 });
} 


export default generateRandomUsers;