import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Welcome = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  useEffect(() => {
    api.get("/api/auth/me")
      .then((res) => setPhone(res.data.phone))
      .catch(() => navigate("/login"));
  }, []);

  const logout = async () => {
    await api.post("/api/auth/logout");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <button
        onClick={logout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-2">Welcome 🎉</h1>
        <p className="text-gray-600">
          Logged in as <span className="font-semibold">{phone}</span>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
