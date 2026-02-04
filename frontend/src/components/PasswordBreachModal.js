import { motion, AnimatePresence } from "framer-motion";

export default function PasswordBreachModal({ open, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6"
        >
          {/* Header Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 rounded-xl p-3">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Change your password
            </h2>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-600 leading-relaxed">
            The password you just used was found in a data breach.
            <br />
            <span className="font-medium text-gray-800">
              Google Password Manager
            </span>{" "}
            recommends changing your password now.
          </p>

          {/* Footer */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-semibold transition"
            >
              OK
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
