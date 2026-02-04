import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiUsers,
  FiFileText,
  FiLogOut,
  FiPlusCircle,
  FiActivity,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiShoppingCart,
  FiCheck
} from "react-icons/fi";

import API from "../api/api";
import DoctorCharts from "../components/DoctorCharts";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  
  /* ✅ Prescription State Management */
  const [prescriptions, setPrescriptions] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);

  const addMedication = () => {
    setPrescriptions([...prescriptions, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index) => {
    const updated = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updated);
  };

  /* ✅ Add to Cart Logic */
  const handleAddToCart = () => {
    const validMeds = prescriptions.filter(m => m.name.trim() !== "");
    if (validMeds.length === 0) {
      alert("Please enter at least one medication name.");
      return;
    }
    setCartCount(prev => prev + validMeds.length);
    alert(`${validMeds.length} medications added to pharmacy cart.`);
  };

  /* ✅ File Upload Logic */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {

  const fetchStats = async () => {
    try {

      // IMPORTANT: correct endpoint
      const res = await API.get("/dashboard");

      // force new object reference → triggers chart animation
      setStats({ ...res.data });

    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  // first load
  fetchStats();

  // ⭐ refresh every 4 seconds (real dashboard feel)
  const interval = setInterval(fetchStats, 4000);

  return () => clearInterval(interval);

}, []);


  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-600">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#111827] text-white shadow-xl border-r">
        <div className="px-6 py-5 text-2xl font-bold text-blue-600 border-b">
          🩺 EHR Doctor
        </div>

        <nav className="mt-6 space-y-2 px-4">
          <MenuItem active label="Dashboard" icon={<FiActivity />} />
          <MenuItem label="Patients" icon={<FiUsers />} />
          <MenuItem label="Create EHR" icon={<FiPlusCircle />} />
          <MenuItem label="Reports" icon={<FiFileText />} />
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1">

        {/* HEADER */}
        <header className="flex justify-between items-center bg-white px-10 py-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, Doctor 👋
            </h1>
            <p className="text-gray-500 text-sm">
              Clinical overview for your patients today.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Cart Icon in Header */}
            <div className="relative p-2 bg-gray-100 rounded-full text-gray-600 cursor-pointer">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        {/* ================= STAT CARDS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
          <StatCard title="Total Patients" value={stats.patients} icon={<FiUsers size={26} />} />
          <StatCard title="Today Visits" value={stats.visitsToday} icon={<FiActivity size={26} />} />
          <StatCard title="Pending Reports" value={stats.pendingReports} icon={<FiFileText size={26} />} />
          <StatCard title="Completed EHRs" value={stats.completedEhrs} icon={<FiFileText size={26} />} />
        </section>

        
          {/* ================= CHARTS ================= */}
<div className="px-8">
  {/* Update this line to pass the fetched visits to the chart */}
  <DoctorCharts visitData={stats.visits} /> 
</div>
        

        {/* ================= PRESCRIPTION & UPLOAD SECTION ================= */}
        <section className="px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* DIGITAL PRESCRIPTION & CART */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Digital Prescription</h2>
              <button 
                onClick={addMedication}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-bold"
              >
                <FiPlus /> Add Medication
              </button>
            </div>

            <div className="space-y-4">
              {prescriptions.map((med, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl relative">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Medication</label>
                    <input 
                      className="px-3 py-2 border rounded-lg text-sm" 
                      placeholder="e.g. Paracetamol"
                      value={med.name}
                      onChange={(e) => {
                        const newMeds = [...prescriptions];
                        newMeds[index].name = e.target.value;
                        setPrescriptions(newMeds);
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Dosage</label>
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="e.g. 500mg" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Frequency</label>
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="e.g. 1-0-1" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1">Duration</label>
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="e.g. 5 Days" />
                  </div>
                  
                  {prescriptions.length > 1 && (
                    <button 
                      onClick={() => removeMedication(index)}
                      className="absolute -right-2 -top-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ADD TO CART BUTTON */}
            <button 
              onClick={handleAddToCart}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              <FiShoppingCart /> Add Prescriptions to Cart
            </button>
          </div>

          {/* UPLOAD PRESCRIPTION SECTION */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <FiUpload size={30} />
            </div>
            <h3 className="font-bold text-gray-800">Upload Prescription</h3>
            <p className="text-xs text-gray-400 mt-2 px-4">
              Upload scanned copies of physical prescriptions for the pharmacy.
            </p>
            
            <label className="mt-6 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 w-full p-6 rounded-2xl hover:border-blue-400 transition">
              <input type="file" className="hidden" onChange={handleFileUpload} />
              <span className="text-sm font-medium text-gray-600">
                {uploadedFile ? (
                  <span className="text-green-600 flex items-center justify-center gap-1 font-bold">
                    <FiCheck /> {uploadedFile}
                  </span>
                ) : (
                  "Choose Image or PDF"
                )}
              </span>
            </label>
            {uploadedFile && <button onClick={() => setUploadedFile(null)} className="mt-4 text-xs text-red-500 font-bold underline">Remove File</button>}
          </div>

        </section>

        {/* ================= APPOINTMENTS ================= */}
        <section className="px-8 mt-8">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Today's Appointments</h2>
              <button className="text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              <AppointmentCard name="Rahul Sharma" time="10:30 AM" type="General Checkup" status="Completed" />
              <AppointmentCard name="Anita Verma" time="12:00 PM" type="Blood Test Review" status="Pending" />
              <AppointmentCard name="Kiran Patel" time="03:15 PM" type="Follow-up" status="Upcoming" />
            </div>
          </div>
        </section>

        {/* ================= PATIENT TABLE ================= */}
        <section className="px-8 pb-10 mt-8">
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3 text-left">Patient</th>
                  <th className="text-left">Diagnosis</th>
                  <th className="text-left">Last Visit</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <PatientRow id="1" name="Kamal" diagnosis="Viral Infection" date="02 Feb 2026" navigate={navigate} />
                <PatientRow id="2" name="Rahul" diagnosis="Cold & Fever" date="15 Jan 2026" navigate={navigate} />
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function MenuItem({ label, icon, active }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
      ${active ? "bg-indigo-600 text-white shadow-lg" : "text-gray-300 hover:bg-indigo-500 hover:text-white"}`}>
      {icon} {label}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
        </div>
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ name, time, type, status }) {
  const statusColor = {
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Upcoming: "bg-blue-100 text-blue-700"
  };
  return (
    <div className="flex justify-between items-center p-4 rounded-xl border hover:bg-blue-50 transition">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{type} • {time}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[status]}`}>
        {status}
      </span>
    </div>
  );
}

function PatientRow({ id, name, diagnosis, date, navigate }) {
  return (
    <tr className="border-b last:border-none hover:bg-blue-50 transition">
      <td className="py-3 font-medium">{name}</td>
      <td>{diagnosis}</td>
      <td>{date}</td>
      <td className="text-right">
        <button onClick={() => navigate(`/patient/${id}`)} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
          View EHR
        </button>
      </td>
    </tr>
  );
}