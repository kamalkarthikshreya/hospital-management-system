import React, { useState } from 'react';
import { Pill, Plus, Trash2, Clipboard } from 'lucide-react';

export default function PrescriptionSection() {
  const [meds, setMeds] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);

  const addMed = () => setMeds([...meds, { name: '', dosage: '', frequency: '', duration: '' }]);
  
  const removeMed = (index) => {
    const newMeds = meds.filter((_, i) => i !== index);
    setMeds(newMeds);
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 mt-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white">
            <Pill size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Prescription Details</h3>
        </div>
        <button 
          onClick={addMed}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
        >
          <Plus size={18} /> Add Medication
        </button>
      </div>

      <div className="space-y-4">
        {meds.map((med, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
            <InputField label="Medication Name" placeholder="e.g. Amoxicillin" />
            <InputField label="Dosage" placeholder="e.g. 500mg" />
            <InputField label="Frequency" placeholder="e.g. Twice daily" />
            <InputField label="Duration" placeholder="e.g. 7 Days" />
            
            {meds.length > 1 && (
              <button 
                onClick={() => removeMed(index)}
                className="absolute -right-2 -top-2 bg-white p-2 rounded-full shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">Clinical Notes & Instructions</label>
        <textarea 
          placeholder="Enter specific instructions for the patient..."
          className="w-full h-32 p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
        />
      </div>
    </div>
  );
}

function InputField({ label, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 transition-all text-sm font-medium"
      />
    </div>
  );
}