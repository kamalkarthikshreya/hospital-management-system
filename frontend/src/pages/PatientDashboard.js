import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const [records] = useState([
    {
      date: "02 Feb 2026",
      doctor: "Dr. John",
      diagnosis: "Viral Infection",
      medication: "Paracetamol 500mg",
    },
    {
      date: "15 Jan 2026",
      doctor: "Dr. Smith",
      diagnosis: "Cold & Fever",
      medication: "Cetirizine",
    },
  ]);

  useEffect(() => {
    document.title = "Patient Dashboard | EHR";
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Top Navbar */}
      <div className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">EHR Patient Portal</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="bg-white text-blue-600 px-4 py-1 rounded-md font-medium"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="p-8">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, Patient 👋
          </h2>
          <p className="text-gray-500 mt-1">
            View your electronic health records below
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard title="Total Visits" value="5" />
          <StatCard title="Doctors Consulted" value="3" />
          <StatCard title="Prescriptions" value="7" />
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            My Health Records
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Doctor</th>
                  <th className="pb-3">Diagnosis</th>
                  <th className="pb-3">Medication</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="py-3">{r.date}</td>
                    <td className="py-3">{r.doctor}</td>
                    <td className="py-3">{r.diagnosis}</td>
                    <td className="py-3">{r.medication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

/* Small reusable card */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-blue-600 mt-2">
        {value}
      </h2>
    </div>
  );
}
