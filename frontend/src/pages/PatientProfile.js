import { useParams, useNavigate } from "react-router-dom";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy patient (later replace with backend)
  const patient = {
    name: "Kamal",
    age: 24,
    blood: "O+",
    condition: "Viral Infection",
    lastVisit: "02 Feb 2026",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Patient Profile
          </h1>
          <p className="text-gray-500">
            Patient ID: {id}
          </p>
        </div>

        <button
          onClick={() => navigate("/doctor")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* INFO GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <InfoCard label="Name" value={patient.name} />
        <InfoCard label="Age" value={patient.age} />
        <InfoCard label="Blood Group" value={patient.blood} />
        <InfoCard label="Condition" value={patient.condition} />
        <InfoCard label="Last Visit" value={patient.lastVisit} />

      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
