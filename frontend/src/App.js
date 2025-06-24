import { useState } from 'react';

function App() {
  const [patients, setPatients] = useState([]);
  const [searchSSN, setSearchSSN] = useState('');
  const [dobRange, setDobRange] = useState({ start: '', end: '' });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', dob: '', ssn: '', phone: '' });

  const handleSSNSearch = async () => {
    const res = await fetch(`http://localhost:3001/api/patients?search=${searchSSN}`);
    const data = await res.json();
    setPatients(data);
  };

  const handleRangeSearch = async () => {
    if (!dobRange.start || !dobRange.end) {
      alert('Por favor, ingrese ambas fechas en formato YYYY-MM-DD');
      return;
    }
    const res = await fetch(`http://localhost:3001/api/patients_range?start=${dobRange.start}&end=${dobRange.end}`);
    const data = await res.json();
    setPatients(data);
  };

  const handleAddPatient = async () => {
    await fetch('http://localhost:3001/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ name: '', dob: '', ssn: '', phone: '' });
    setShowModal(false);
    handleSSNSearch();
  };

  const translations = {
    spanish: {
      title: "Gestión de Pacientes",
      searchButton: "Buscar",
      searchBoxPlaceholder: "Buscar por SSN...",
      addPatientButton: "Agregar Paciente",
      rangeSearchButton: "Buscar por Rango",
      addPatientForm: {
        title: "Nuevo Paciente",
        name: "Nombre",
        dob: "Fecha de Nacimiento",
        ssn: "SSN",
        cardNumber: "Numero de Tarjeta",
        cancelButton: "Cancelar",
        saveButton: "Guardar"
      }
    },
    portuguese: {
      title: "Gestão de Pacientes",
      searchButton: "Buscar",
      searchBoxPlaceholder: "Buscar por CPF...",
      addPatientButton: "Adicionar Paciente",
      rangeSearchButton: "Buscar por Intervalo",
      addPatientForm: {
        title: "Novo Paciente",
        name: "Nome",
        dob: "Data de Nascimento",
        ssn: "CPF",
        cardNumber: "Número do Cartão",
        cancelButton: "Cancelar",
        saveButton: "Salvar"
      }
    },
    english: {
      title: "Patient Management",
      searchButton: "Search",
      searchBoxPlaceholder: "Search by SSN...",
      addPatientButton: "Add Patient",
      rangeSearchButton: "Search by Range",
      addPatientForm: {
        title: "New patient",
        name: "Name",
        dob: "Date of birth",
        ssn: "SSN",
        cardNumber: "Card number",
        cancelButton: "Cancel",
        saveButton: "Save"
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{translations.portuguese.title}</h1>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder={translations.portuguese.searchBoxPlaceholder}
              className="w-full border rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={searchSSN}
              onChange={(e) => setSearchSSN(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <button
            onClick={handleSSNSearch}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
          >
            {translations.portuguese.searchButton}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition"
          >
            {translations.portuguese.addPatientButton}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <input
              type="date"
              placeholder="De"
              className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={dobRange.start}
              onChange={(e) => setDobRange({ ...dobRange, start: e.target.value })}
            />
          </div>
          <div className="flex-grow">
            <input
              type="date"
              placeholder="Hasta"
              className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={dobRange.end}
              onChange={(e) => setDobRange({ ...dobRange, end: e.target.value })}
            />
          </div>
          <button
            onClick={handleRangeSearch}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
          >
            {translations.portuguese.rangeSearchButton}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {patients.map((p, i) => (
          <div key={i} className="border rounded-lg p-4 shadow-md bg-white">
            <p><strong>{translations.portuguese.addPatientForm.name}:</strong> {p.name}</p>
            <p><strong>{translations.portuguese.addPatientForm.dob}:</strong> {p.dob}</p>
            <p><strong>{translations.portuguese.addPatientForm.ssn}:</strong> {p.patientRecord.ssn}</p>
            <p><strong>{translations.portuguese.addPatientForm.cardNumber}:</strong> {p.patientRecord.billing.number}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{translations.portuguese.addPatientForm.title}</h2>
            <input
              type="text"
              placeholder={translations.portuguese.addPatientForm.name}
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="date"
              placeholder={translations.portuguese.addPatientForm.dob}
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            <input
              type="text"
              placeholder={translations.portuguese.addPatientForm.ssn}
              className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={formData.ssn}
              onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
            />
            <input
              type="text"
              placeholder={translations.portuguese.addPatientForm.cardNumber}
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 transition"
              >
                {translations.portuguese.addPatientForm.cancelButton}
              </button>
              <button
                onClick={handleAddPatient}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
              >
                {translations.portuguese.addPatientForm.saveButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;