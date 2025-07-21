
// IMPORTING MODULES

import { MongoClient, ClientEncryption } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import generateRandomUsers from './helpers.js';
import dotenv from 'dotenv';

// LOADING CONFIG FILE

dotenv.config();

// DEFINING CONSTANTS

const uri = process.env.MONGODB_URL;

const keyVaultDB = process.env.KEY_VAULT_DB_NAME;
const keyVaultCollection = process.env.KEY_VAULT_COLL_NAME;
const keyVaultNamespace = `${keyVaultDB}.${keyVaultCollection}`;

const dbName = process.env.DB_NAME;
const collectionName = process.env.COLL_NAME;

const customerMasterKey = process.env.CUSTOMER_MASTER_KEY;
const localKey = { key: Buffer.from(customerMasterKey, 'base64') };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cryptSharedLibPath = path.join(__dirname, 'lib', 'mongo_crypt_v1.dylib');

const encOptions = {
  keyVaultNamespace: keyVaultNamespace,
  kmsProviders: { local: localKey },
  extraOptions: { cryptSharedLibPath },
};

let collection; // will hold the encrypted collection

// CONNECTING TO DATABASE WITH ENCRYPTION OPTIONS

const clientEncrypted = new MongoClient(uri, { autoEncryption: encOptions });
await clientEncrypted.connect();

// INITIALIZING CLIENT ENCRYPTION INSTANCE

const clientEncryption = new ClientEncryption(clientEncrypted, encOptions);

// DROP EXISTING COLLECTIONS (DEMO ONLY)
await clientEncrypted.db(keyVaultDB).dropDatabase().catch(() => null);
await clientEncrypted.db(dbName).dropDatabase().catch(() => null);

// DEFINING THE ENCRYPTED COLLECTION OPTIONS

const minDobDate = new Date('1900-01-01');
const maxDobDate = new Date('2100-12-31');

const collOptions = {
  encryptedFields: {
    fields: [
      { path: 'patientRecord.ssn', bsonType: 'string', queries: { queryType: 'equality' } },
      { path: 'dob', bsonType: 'date', queries: { queryType: 'range', min: minDobDate, max: maxDobDate } },
      { path: 'patientRecord.billing.number', bsonType: 'string', },
    ]
  }
};

// CREATING ENCRYPTED COLLECTION

const db = clientEncrypted.db(dbName);
const result = await clientEncryption.createEncryptedCollection(
  db,
  collectionName,
  { provider: 'local', createCollectionOptions: collOptions }
);

collection = result.collection;
console.log('Encrypted collection initialized');

// GENERATE RANDOM PATIENTS

const randomPatients = generateRandomUsers(100);
const seedResult = await collection.insertMany(randomPatients);

if (seedResult.acknowledged) {
  console.log("Database seeded.")
}

// CRUD FUNCTIONS

export async function createUser(patient) {
  return await collection.insertOne(patient);
}

export async function findUsersByDobRange(startDate, endDate) {
  return collection
    .find({
      dob: { $gte: new Date(startDate), $lte: new Date(endDate) }
    },)
    .toArray();
}

export async function findUser(ssn) {
  return await collection.findOne({ "patientRecord.ssn": ssn });
}
