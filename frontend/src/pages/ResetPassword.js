import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 8)
      return setError("Minimum 8 characters required");

    if (password !== confirm)
      return setError("Passwords do not match");

    try {
      setLoading(true);
      await API.post("/auth/reset-password", {
        email,
        newPassword: password,
      });

      sessionStorage.removeItem("resetEmail");
      alert("Password updated successfully");
      navigate("/login");
    } catch {
      setError("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060B18]">
      <form
        onSubmit={handleReset}
        className="bg-slate-900 p-10 rounded-3xl w-full max-w-md text-white space-y-6"
      >
        <h2 className="text-3xl font-black">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full h-14 px-4 rounded-xl bg-slate-800 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full h-14 px-4 rounded-xl bg-slate-800 outline-none"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}

        <button
          disabled={loading}
          className="w-full h-14 rounded-xl bg-blue-600 font-bold"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
