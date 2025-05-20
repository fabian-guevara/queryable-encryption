# Queryable Encryption Demo

**⚠️ WARNING: This project is for demonstration purposes only and should NOT be used in production. ⚠️**

This project demonstrates MongoDB's Queryable Encryption feature using a Node.js backend to encrypt sensitive fields and query encrypted data, including range queries. The frontend is a React application running on `http://localhost:3000`, and the backend runs on `http://localhost:3001`. This README provides instructions to set up and run the project on macOS or Windows, based on: https://github.com/fabian-guevara/queryable-encryption.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Install Node.js Dependencies](#install-nodejs-dependencies)
  - [Install MongoDB `libmongocrypt` Library](#install-mongodb-libmongocrypt-library)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (included with Node.js)
- **MongoDB**: MongoDB 8.0+ Community, Enterprise, or Atlas cluster (required for Queryable Encryption with range queries, as range queries on encrypted fields are supported in MongoDB 8.0 and later)
- **Git**: For cloning the repository
- **CMake**: Needed if building `libmongocrypt` from source

A Key Management Service (KMS) provider is required (e.g., local key for testing or external like AWS KMS).

## Installation

### Clone the Repository
Clone the project:
```bash
git clone https://github.com/fabian-guevara/queryable-encryption.git
cd queryable-encryption
```

### Install Node.js Dependencies
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```
Navigate to the `backend` directory and install dependencies:
```bash
cd ../backend
npm install
```
This installs `mongodb` and `mongodb-client-encryption` for the backend and React dependencies for the frontend as specified in each `package.json`.

### Install MongoDB `libmongocrypt` Library
The `libmongocrypt` library is required for Queryable Encryption and is referenced in `qe.js`. Install it for your operating system.

#### macOS
1. **Install via Homebrew**:
   ```bash
   brew install mongodb/brew/libmongocrypt
   ```
   This places `mongo_crypt_v1.dylib` in `/usr/local/lib` or `/opt/homebrew/lib`.

2. **Build from Source (Alternative)**:
   - Clone the repository:
     ```bash
     git clone https://github.com/mongodb/libmongocrypt.git
     cd libmongocrypt
     ```
   - Create a build directory:
     ```bash
     mkdir cmake-build && cd cmake-build
     ```
   - Configure:
     ```bash
     cmake ..
     ```
   - Build and install:
     ```bash
     make
     sudo make install
     ```
   - Copy `mongo_crypt_v1.dylib` (from the build directory) to `backend/lib/mongo_crypt_v1.dylib` in the project.

#### Windows
1. **Download Prebuilt Binaries**:
   - Download `libmongocrypt` binaries from: https://github.com/mongodb/libmongocrypt/releases
   - Extract and rename the DLL to `mongo_crypt_v1.dll`.
   - Place `mongo_crypt_v1.dll` in `backend/lib/mongo_crypt_v1.dll` in the project.

2. **Build from Source (Alternative)**:
   - Install Visual Studio with C++ tools (e.g., Visual Studio Community 2022).
   - Install CMake:
     ```powershell
     winget install Kitware.CMake
     ```
   - Clone the repository:
     ```powershell
     git clone https://github.com/mongodb/libmongocrypt.git
     cd libmongocrypt
     ```
   - Create a build directory:
     ```powershell
     mkdir cmake-build
     cd cmake-build
     ```
   - Configure:
     ```powershell
     cmake -G "Visual Studio 17 2022" ..
     ```
   - Build:
     ```powershell
     cmake --build . --config Release
     ```
   - Rename `libmongocrypt.dll` (from the `Release` folder) to `mongo_crypt_v1.dll` and copy it to `backend/lib/mongo_crypt_v1.dll`.

**Note**: macOS and Windows use native encryption APIs, so OpenSSL is not required. Ensure `mongo_crypt_v1.dylib` (macOS) or `mongo_crypt_v1.dll` (Windows) is in `backend/lib/` as `qe.js` expects it there.

## Configuration
1. **Set Up MongoDB Cluster**:
   Ensure a MongoDB 8.0+ Community, Enterprise, or Atlas cluster is running. Update the connection URI in `qe.js` or `server.js` (e.g., `mongodb+srv://<user>:<password>@<cluster>.mongodb.net` for Atlas, or `mongodb://localhost:27017` for a local Community/Enterprise instance).

2. **Configure `qe.js`**:
   In `backend/qe.js`, the `cryptSharedLibPath` is set as:
   ```javascript
   const { fileURLToPath } = require('url');
   const path = require('path');
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   const cryptSharedLibPath = path.join(__dirname, 'lib', 'mongo_crypt_v1.dylib');
   ```
   - For macOS, ensure `mongo_crypt_v1.dylib` is in `backend/lib/`.
   - For Windows, replace `'mongo_crypt_v1.dylib'` with `'mongo_crypt_v1.dll'` in `qe.js` and ensure `mongo_crypt_v1.dll` is in `backend/lib/`:
     ```javascript
     const cryptSharedLibPath = path.join(__dirname, 'lib', 'mongo_crypt_v1.dll');
     ```

3. **KMS Provider**:
   In `qe.js`, configure the KMS provider. For a local KMS:
   ```javascript
   const kmsProviders = {
     local: { key: Buffer.from('<96-byte-base64-encoded-key>') }
   };
   ```
   Generate a key:
   ```javascript
   require('crypto').randomBytes(96).toString('base64')
   ```
   For external KMS (e.g., AWS), configure credentials in `qe.js` per MongoDB’s documentation.

## Running the Project
1. Ensure your MongoDB 8.0+ cluster is accessible.
2. Start the backend (in the `backend` directory):
   ```bash
   cd backend
   npm start
   ```
   This runs `server.js` on `http://localhost:3001`.
3. Start the frontend (in the `frontend` directory):
   ```bash
   cd ../frontend
   npm start
   ```
   This serves the React application on `http://localhost:3000`.
4. Access the frontend at `http://localhost:3000`.

## Usage
- Open `http://localhost:3000` in a browser to access the React application.
- Use the interface to submit data for encryption and query encrypted fields, including range queries (e.g., using `$lt`, `$lte`, `$gt`, `$gte` operators, supported in MongoDB 8.0+). The backend (`http://localhost:3001`) handles encryption and decryption via MongoDB’s Queryable Encryption.
- View encrypted data (stored as `Binary`, subtype 6) using MongoDB Compass, `mongosh`, or the MongoDB Atlas Data Explorer.

## Contributing
1. Fork the repository.
2. Create a branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file.

**⚠️ WARNING: This project is for demonstration purposes only and should NOT be used in production. ⚠️**
