import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

export default function PatientApp() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', age: '', ssn: '', phone: '' });
  const [open, setOpen] = useState(false);

  const fetchPatients = async (query = '') => {
    const { data } = await axios.get(`/api/patients?search=${query}`);
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = () => {
    fetchPatients(search);
    console.log(patients);
    
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPatient = async () => {
    await axios.post('/api/patients', form);
    setForm({ name: '', age: '', ssn: '', phone: '' });
    setOpen(false);
    fetchPatients(form.ssn);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-4">
              <Input placeholder="Name" name="name" value={form.name} onChange={handleChange} />
              <Input placeholder="Age" name="age" value={form.age} onChange={handleChange} />
              <Input placeholder="SSN" name="ssn" value={form.ssn} onChange={handleChange} />
              <Input placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <Button onClick={handleAddPatient}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-gray-100 p-4 rounded-xl space-y-2">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="border p-2 rounded shadow-sm bg-white"
          >
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>perro:</strong> {patient.patientRecord.ssn}</p>
            <p><strong>Phone:</strong> {patient.patientRecord.billAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
