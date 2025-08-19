import React from "react";
import { useState } from "react";
import { UserCheck, Eye, EyeOff } from "lucide-react";
import { Input } from "../components/ui/forms";
import AuthService from "../services/AuthService";

const LoginPage = () => {
  const [currentLoginForm, setCurrentLoginForm] = useState({
    email: "",
    password: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const myDomain = "@scprcjt.web.app";

  const handleOnChange = (field, value) => {
    setCurrentLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentLoginForm.email.trim()) {
      newErrors.email = 'Username harus diisi';
    }
    
    if (!currentLoginForm.password.trim()) {
      newErrors.password = 'Password harus diisi';
    } else if (currentLoginForm.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await AuthService.login(currentLoginForm);
      console.log("Login successful:", result);
      
      // Redirect after successful login
      // window.location.href = "/dashboard";
      // atau gunakan React Router: navigate("/dashboard");
      
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({
        submit: err.message || "Login gagal. Periksa kembali username dan password Anda."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo dan Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="inline-block bg-white rounded-md p-3 shadow-sm mb-4">
              <img 
                src="/logo.png" 
                alt="Sultan Polos Logo" 
                className="h-20 w-auto"
                onError={(e) => {
                  // Fallback jika logo.png tidak ada
                  e.target.src = "/logo-only.png";
                }}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              SULTAN POLOS
            </h1>
            <p className="text-gray-600 mt-2">
              Inventory Management System
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <UserCheck className="mr-3 text-blue-600" size={28} />
              Masuk
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Masuk dengan akun yang sudah terdaftar
            </p>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Username Field */}
            <div>
              <Input
                label="Username"
                id="email"
                type="text"
                placeholder="Masukkan username"
                value={currentLoginForm.email.replace(myDomain, '')}
                onChange={(e) => handleOnChange('email', e.target.value + myDomain)}
                error={errors.email}
                disabled={isLoading}
                required
                className="w-full"
              />
            </div>

            {/* Password Field */}
            <div>
              <Input
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={currentLoginForm.password}
                onChange={(e) => handleOnChange('password', e.target.value)}
                error={errors.password}
                disabled={isLoading}
                required
                rightIcon={showPassword ? <EyeOff /> : <Eye />}
                onRightIconClick={() => setShowPassword(!showPassword)}
                rightIconClassName="cursor-pointer text-gray-400 hover:text-gray-600"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Masuk...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2" size={20} />
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2025 Sultan Polos. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Sistem Manajemen Inventori</p>
          <p>Versi 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;