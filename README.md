# Queryable Encryption Demo

This project demonstrates MongoDB's Queryable Encryption feature using a Node.js backend, enabling encryption of sensitive fields and queries on encrypted data. This README provides instructions to set up and run the project locally on macOS or Windows, based on the repository: https://github.com/fabian-guevara/queryable-encryption.

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
Ensure you have the following installed:
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (included with Node.js)
- **MongoDB**: A MongoDB 7.0+ Enterprise or Atlas cluster (Queryable Encryption requires Enterprise or Atlas)
- **MongoDB Compass** or **mongosh**: Optional, for inspecting encrypted data
- **Git**: For cloning the repository
- **CMake**: Required if building `libmongocrypt` from source

You’ll need a Key Management Service (KMS) provider, such as a local key for testing or an external provider (e.g., AWS KMS, Azure, HashiCorp Vault).

## Installation

### Clone the Repository
Clone the project to your local machine:
```bash
git clone https://github.com/fabian-guevara/queryable-encryption.git
cd queryable-encryption
```

### Install Node.js Dependencies
Install the required Node.js dependencies:
```bash
npm install
```
This installs dependencies like `mongodb` and `mongodb-client-encryption`, as specified in `package.json`.

### Install MongoDB `libmongocrypt` Library
The `libmongocrypt` library is required for Queryable Encryption and is referenced in `qe.js`. Follow the steps for your operating system (macOS or Windows).

#### macOS
1. **Install via Homebrew (Recommended)**:
   Install Homebrew if not already installed:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   Install `libmongocrypt`:
   ```bash
   brew install mongodb/brew/libmongocrypt
   ```
   This installs `libmongocrypt.dylib` to `/usr/local/lib` or `/opt/homebrew/lib` (depending on your macOS version).

2. **Build from Source (Alternative)**:
   If Homebrew is unavailable or you need a specific version:
   - Clone the `libmongocrypt` repository:
     ```bash
     git clone https://github.com/mongodb/libmongocrypt.git
     cd libmongocrypt
     ```
   - Create a build directory:
     ```bash
     mkdir cmake-build && cd cmake-build
     ```
   - Configure with CMake:
     ```bash
     cmake ..
     ```
   - Build and install:
     ```bash
     make
     sudo make install
     ```
   - Note the path to `libmongocrypt.dylib` (typically `/usr/local/lib`).

3. **Verify Installation**:
   Ensure `libmongocrypt.dylib` is in your library path or note its location for configuration in `qe.js`.

#### Windows
1. **Download Prebuilt Binaries (Recommended)**:
   - Download the latest `libmongocrypt` Windows binaries from: https://github.com/mongodb/libmongocrypt/releases
   - Extract the archive and place `libmongocrypt.dll` in a directory accessible to your application (e.g., `C:\libmongocrypt\bin`).

2. **Build from Source (Alternative)**:
   - Install Visual Studio with C++ development tools (e.g., Visual Studio Community 2022).
   - Install CMake if not already present:
     ```powershell
     winget install Kitware.CMake
     ```
   - Clone the `libmongocrypt` repository:
     ```powershell
     git clone https://github.com/mongodb/libmongocrypt.git
     cd libmongocrypt
     ```
   - Create a build directory:
     ```powershell
     mkdir cmake-build
     cd cmake-build
     ```
   - Configure with CMake:
     ```powershell
     cmake -G "Visual Studio 17 2022" ..
     ```
   - Build:
     ```powershell
     cmake --build . --config Release
     ```
   - Install:
     ```powershell
     cmake --install .
     ```
   - Note the path to `libmongocrypt.dll` (e.g., in the build directory’s `Release` folder).

3. **Verify Installation**:
   Ensure `libmongocrypt.dll` is in a directory included in your system’s `PATH` or note its path for configuration in `qe.js`.

**Note**: On macOS and Windows, `libmongocrypt` uses the system’s native encryption APIs, so no additional OpenSSL installation is required.

## Configuration
1. **Set Up MongoDB Cluster**:
   Ensure a MongoDB 7.0+ Enterprise or Atlas cluster is running. Obtain the connection URI (e.g., `mongodb+srv://<user>:<password>@<cluster>.mongodb.net`).

2. **Configure Environment Variables**:
   Check `qe.js` for required environment variables (e.g., MongoDB URI, KMS settings). Create a `.env` file if needed:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
   ```
   For local KMS (testing):
   ```env
   LOCAL_MASTER_KEY=<96-byte-base64-encoded-key>
   ```
   Generate a local master key using Node.js:
   ```javascript
   require('crypto').randomBytes(96).toString('base64')
   ```

3. **Specify `libmongocrypt` Path in `qe.js`**:
   In `qe.js`, update the `cryptSharedLibPath` to point to `libmongocrypt`:
   ```javascript
   const cryptSharedLibPath = '/path/to/libmongocrypt.dylib'; // macOS
   // or
   const cryptSharedLibPath = 'C:\\path\\to\\libmongocrypt.dll'; // Windows
   ```
   Ensure the path matches the location of `libmongocrypt.dylib` (macOS) or `libmongocrypt.dll` (Windows).

4. **KMS Provider**:
   In `qe.js`, configure the KMS provider (e.g., local or external like AWS KMS). For a local KMS:
   ```javascript
   const kmsProviders = {
     local: { key: Buffer.from('<96-byte-base64-encoded-key>') }
   };
   ```
   For external KMS providers, add credentials in `qe.js` or as environment variables per MongoDB’s documentation.

## Running the Project
1. Ensure your MongoDB cluster is accessible.
2. Start the Node.js application:
   ```bash
   npm start
   ```
   This runs `server.js`, typically on `http://localhost:3000`.

3. Verify the server is running by accessing `index.html` or `query.html` in a browser or testing endpoints with a tool like Postman.

## Usage
- **Insert Data**: Use `index.html` to submit data (e.g., sensitive fields to be encrypted). Encrypted fields are stored as `Binary` (subtype 6) in MongoDB.
- **Query Data**: Use `query.html` to query encrypted fields. The MongoDB driver handles decryption for matching records.
- **Example**:
  - Submit a form via `index.html` to encrypt and store data.
  - Query via `query.html` to retrieve records by encrypted fields.

Inspect encrypted data using MongoDB Compass or `mongosh` to verify encryption.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
