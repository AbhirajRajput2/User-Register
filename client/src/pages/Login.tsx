import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Indian valid number: starts with 6-9 and 10 digits
  const phoneRegex = /^[6-9]\d{9}$/;

  const formatPhone = (digits: string) => {
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 10);

    if (digits.length <= 3) return p1;
    if (digits.length <= 6) return `${p1}-${p2}`;
    return `${p1}-${p2}-${p3}`;
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);

    // live validation
    if (digitsOnly.length === 10 && !phoneRegex.test(digitsOnly)) {
      setError("Number must start with 6, 7, 8 or 9");
    } else {
      setError("");
    }
  };

  const handleLogin = async () => {
    setError("");

    // frontend validation
    if (!phoneRegex.test(phone)) {
      setError("Enter a valid 10-digit number starting with 6-9");
      setPhone(""); // reset input
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", { phone });

      navigate("/welcome");

    } catch (err: any) {
      // 🔥 backend message like "Not registered"
      const msg =
        err.response?.data?.message || "User doesn't exist";

      setError(msg);
      setPhone(""); // ✅ reset input after error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <div className="flex items-center border rounded mb-1 overflow-hidden">
          <span className="px-3 py-2 bg-gray-100 text-gray-700 text-sm border-r">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            className="flex-1 p-2 outline-none"
            placeholder="Phone number"
            value={formatPhone(phone)}
            onChange={(e) => handlePhoneChange(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 mb-2 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading || phone.length !== 10}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
