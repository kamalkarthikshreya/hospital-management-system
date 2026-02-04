import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Your Axios instance with interceptors

export default function PremiumLogin() {
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hex code matched to your cinematic medical background
  const BRAND_DARK = "#060B18"; 

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setEmailError("");
    } else if (!emailRegex.test(value)) {
      setEmailError("Enter a valid work email address");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(""); 
    
    // Preliminary validation
    if (emailError || !email) {
      setEmailError("Enter a valid work email address");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Normalize email to match database records (lowercase and trimmed)
      const res = await API.post("/auth/login", { 
        email: email.toLowerCase().trim(), 
        password 
      });

      // 2. Extract data exactly as shown in your successful Postman response
      const { token, user } = res.data;

      if (token && user) {
        // 3. IMPORTANT: Use localStorage to match your API.js interceptor logic
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userName", user.name);

        // 4. Navigate based on the 'role' field from MongoDB
        if (user.role === "doctor") {
          navigate("/doctor");
        } else {
          navigate("/patient");
        }
      }
    } catch (err) {
      // 5. Capture the specific "Invalid email or password" message from your API
      const message = err.response?.data?.message || "Server connection failed. Please try again later.";
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans antialiased selection:bg-blue-500/30" style={{ backgroundColor: BRAND_DARK }}>

      {/* LEFT SECTION: Cinematic Branding & Masking */}
      <div className="hidden lg:flex w-7/12 relative overflow-hidden" style={{ backgroundColor: BRAND_DARK }}>
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.65 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover"
          style={{ 
            backgroundImage: "url('/login-bg.png')",
            backgroundPosition: "center 15%", 
            backgroundRepeat: "no-repeat"
          }}
        />
        
        {/* Horizontal masking to fade the image into the right-side UI */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: `linear-gradient(to right, transparent 75%, ${BRAND_DARK} 100%), 
                         linear-gradient(to top, ${BRAND_DARK} 5%, transparent 35%)` 
          }} 
        />

        <div className="relative z-20 p-20 flex flex-col justify-between text-white h-full w-full">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/40">M</div>
            <span className="text-2xl font-bold tracking-tight uppercase tracking-widest">MEDIGRAPH</span>
          </motion.div>

          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-7xl font-black leading-[1.05] tracking-tighter"
            >
              The Future of <br />
              <span className="text-blue-400">Precision Health.</span>
            </motion.h2>
            <p className="mt-8 text-xl text-slate-300 leading-relaxed font-light border-l-2 border-blue-500/50 pl-6">
              Experience a unified digital ecosystem designed for modern practitioners. Secure, AI-driven, and HIPAA-ready.
            </p>
          </div>

          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>© 2026 Medigraph AI Systems</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              HIPAA Secure Environment
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Interactive Login Form */}
      <div className="w-full lg:w-5/12 flex items-center justify-center px-10 relative border-l border-white/5" style={{ backgroundColor: BRAND_DARK }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] space-y-12"
        >
          <header>
            <h1 className="text-[48px] font-black text-white tracking-tight leading-tight">Welcome Back</h1>
            <p className="mt-2 text-lg text-slate-400 font-medium tracking-wide">Enter your professional credentials to continue.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="doctor@gmail.com"
                className={`w-full h-[64px] px-6 rounded-2xl text-lg outline-none transition-all duration-200
                  ${(emailError || authError) 
                    ? "bg-red-950/20 border-2 border-red-500/50 text-red-100 placeholder:text-red-300/50" 
                    : "bg-slate-800/30 border border-white/10 text-white placeholder:text-slate-600"}
                  focus:bg-slate-800/50 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10`}
              />
              <AnimatePresence>
                {(emailError || authError) && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-sm text-red-400 font-bold ml-1"
                  >
                    {emailError || authError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Security Key</label>
                <button 
                  type="button"
                  className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/30 transition"
                >
                  Recovery?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[64px] px-6 rounded-2xl text-lg bg-slate-800/30 border border-white/10 text-white focus:bg-slate-800/60 focus:border-blue-600 outline-none transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[68px] rounded-2xl bg-[#000000] text-white text-lg font-black hover:bg-blue-600 transition-all transform active:scale-[0.98] shadow-2xl border border-white/10 mt-4 tracking-widest uppercase"
            >
              {isLoading ? "Validating Access..." : "Sign In"}
            </button>
          </form>

          <div className="relative py-4 text-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
            <span className="relative px-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600" style={{ backgroundColor: BRAND_DARK }}>Enterprise Access</span>
          </div>

          <button type="button" className="w-full h-[64px] rounded-2xl border border-white/10 bg-white flex items-center justify-center gap-3 font-bold text-slate-900 hover:bg-slate-100 transition-all active:scale-[0.99]">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Workspace
          </button>
        </motion.div>
      </div>
    </div>
  );
}