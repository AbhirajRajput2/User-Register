import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Indian mobile number regex
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
  
    // 1️⃣ first digit validation
    if (digitsOnly.length > 0 && !["6", "7", "8", "9"].includes(digitsOnly[0])) {
      setError("Number should start with 6, 7, 8 or 9");
      return;
    }
  
    // 2️⃣ length validation
    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setError("Phone number must be 10 digits");
      return;
    }
  
    // 3️⃣ valid
    setError("");
  };
  
  const handleRegister = async () => {
    setError("");

    // final validation before API call
    if (!phoneRegex.test(phone)) {
      setError("Enter a valid 10-digit number starting with 6-9");
      setPhone(""); // reset input
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/register", { phone });
      
      navigate("/login");

    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Registration failed";

      setError(msg);
      setPhone(""); // reset input on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>

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
          onClick={handleRegister}
          disabled={loading || phone.length !== 10}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p
          className="text-sm text-blue-600 mt-3 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account?
        </p>
      </div>
    </div>
  );
};

export default Register;
