const paciente = {
    name: "String", // exemplo: "John Doe"
    email: "String", // exemplo: "john.doe@example.com"
    dob: "Date", // exemplo: new Date("1990-05-14") - encrypted
    patientRecord: {
      ssn: "String", // encrypted
      billing: {
        type: "String", // exemplo: "Visa"
        number: "String", // exemplo: "4111 1111 1111 1111" - encrypted
      },
      billAmount: "Number", // exemplo: 457
    },
}
