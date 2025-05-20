import { MongoClient, ClientEncryption } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import  generateRandomUsers  from "./helpers.js"

const CUSTOMER_MASTER_KEY = 'Mng0NCt4ZHVUYUJCa1kxNkVyNUR1QURhZ2h2UzR2d2RrZzh0cFBwM3R6NmdWMDFBMUN3YkQ5aXRRMkhGRGdQV09wOGVNYUMxT2k3NjZKelhaQmRCZGJkTXVyZG9uSjFk';
const localKey = { key: Buffer.from(CUSTOMER_MASTER_KEY, 'base64') };

const uri = 'mongodb+srv://local:mongodb@demo.lfvxb.mongodb.net/?retryWrites=true&w=majority&appName=DEMO';
const keyVaultDB = 'encryption';
const keyVaultCollection = '__keyVault';
const dbName = 'medicalRecords';
const collectionName = 'patients';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cryptSharedLibPath = path.join(__dirname, 'lib', 'mongo_crypt_v1.dylib');


const encOptions = {
  keyVaultNamespace: `${keyVaultDB}.${keyVaultCollection}`,
  kmsProviders: { local: localKey },
  extraOptions: { cryptSharedLibPath },
};

let collection; // will hold the encrypted collection

  const clientEncrypted = new MongoClient(uri, { autoEncryption: encOptions });
  await clientEncrypted.connect();

  const clientEncryption = new ClientEncryption(clientEncrypted, encOptions);

  // Drop existing collections (demo only)
  await clientEncrypted.db(keyVaultDB).dropDatabase().catch(() => null);
  await clientEncrypted.db(dbName).dropDatabase().catch(() => null);

  const minDobDate = new Date('1900-01-01');
  const maxDobDate = new Date('2100-12-31');

  const collOptions = {
    encryptedFields: {
      fields: [
        { path: 'patientRecord.ssn', bsonType: 'string', queries: { queryType: 'equality' } },
        { path: 'dob', bsonType: 'date', queries: { queryType: 'range', min: minDobDate, max: maxDobDate } },
        { path: 'patientRecord.billing.number', bsonType: 'string',  },
      ]
    }
  };

  const db = clientEncrypted.db(dbName);
  const result = await clientEncryption.createEncryptedCollection(
    db,
    collectionName,
    { provider: 'local', createCollectionOptions: collOptions }
  );

  collection = result.collection;
  console.log('Encrypted collection initialized');

  // seed database 
  const randomPatients = generateRandomUsers(100);
  const seedResult = await collection.insertMany(randomPatients);

  if( seedResult.acknowledged ) {
    console.log("Database seeded.")
  }


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
