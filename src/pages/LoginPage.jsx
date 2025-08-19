import React from "react";
import { useState } from "react";
import { UserCheck } from "lucide-react";
import { Input } from "../components/ui/forms";
import AuthService from "../services/AuthService";

const LoginPage = () => {
  // Ubah dari array ke object
  const [currentLoginForm, setCurrentLoginForm] = useState({
    email: "",
    password: ""
  });
  
  // Tambahkan loading state
  const [isLoading, setIsLoading] = useState(false);
  
  const myDomain = "@scprcjt.web.app";

  const handleOnChange = (updated) => {
    setCurrentLoginForm(updated);
  };

  // Perbaiki handleSave
  const handleSave = async (e) => {
    console.log("Current login form:", currentLoginForm);
    e.preventDefault(); // Cegah default form submission
    
    setIsLoading(true);
    try {
      const result = await AuthService.login(currentLoginForm);
      console.log("Login successful:", result);
      
      // Tambahkan redirect atau feedback di sini
      // Contoh: window.location.href = "/dashboard";
      // atau gunakan React Router: navigate("/dashboard");
      
    } catch (err) {
      console.error("Login failed:", err);
      // Tambahkan error handling UI di sini
      alert("Login failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-10 flex items-center justify-center">
      <div className="p-10 w-fit h-fit bg-white dark:bg-gray-800 ring ring-gray-200 rounded-2xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserCheck className="mr-3 text-blue-600 dark:text-blue-400" />
          Login
        </h1>

        <p className="text-gray-600 dark:text-gray-400 my-3">
          Login dengan akun yang sudah terdaftar
        </p>

        <form onSubmit={handleSave}>
          <div className="mb-3">
            <Input
              id="email"
              type="email"
              placeholder="Enter username"
              onChange={(e) =>
                handleOnChange({
                  ...currentLoginForm,
                  email: e.target.value + myDomain,
                })
              }
              required
            />
          </div>
          <div className="mb-3">
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              onChange={(e) =>
                handleOnChange({ ...currentLoginForm, password: e.target.value })
              }
              required
            />
          </div>

          <button 
            // type="submit" 
            onClick={handleSave}
            disabled={isLoading}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;