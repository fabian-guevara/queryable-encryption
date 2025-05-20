const paciente = {
    name: "String", // ejemplo: "John Doe"
    email: "String", // ejemplo: "john.doe@example.com"
    dob: "Date", // ejemplo: new Date("1990-05-14")
    patientRecord: {
      ssn: "String", // MongoDB ObjectId es una cadena hexadecimal de 24 caracteres
      billing: {
        type: "String", // ejemplo: "Visa"
        number: "String", // ejemplo: "4111 1111 1111 1111"
      },
      billAmount: "Number", // ejemplo: 457
    },
}
