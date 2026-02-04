import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DoctorCharts({ visitData }) {

  if (!visitData || visitData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md">
        No visit data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

      {/* Weekly Visits */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
        <h2 className="text-lg font-semibold mb-4">
          Weekly Visits
        </h2>

        {/* HEIGHT IS CRITICAL */}
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="visits"
                stroke="#4F46E5"
                strokeWidth={3}

                // ⭐ Animation
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"

                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
