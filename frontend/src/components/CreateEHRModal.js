import { useState } from "react";
import API from "../api/api";

export default function CreateEHRModal({ onClose }) {
  const [form, setForm] = useState({
    patientId: "",
    symptoms: "",
    diagnosis: "",
    medications: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitEHR = async () => {
    try {
      await API.post("/ehr", form);
      alert("EHR created successfully");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "EHR creation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create EHR</h2>

        <input
          name="patientId"
          placeholder="Patient ID"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        <input
          name="symptoms"
          placeholder="Symptoms"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        <input
          name="diagnosis"
          placeholder="Diagnosis"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        <input
          name="medications"
          placeholder="Medications"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Additional Notes"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={submitEHR}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
