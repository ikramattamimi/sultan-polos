import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/forms';
import AuthService from '../services/AuthService.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Clear general error
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Password saat ini harus diisi';
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password baru harus diisi';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password baru minimal 6 karakter';
    } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password baru harus mengandung huruf kecil';
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password baru harus mengandung huruf besar';
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password baru harus mengandung angka';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    // Same password validation
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Password baru harus berbeda dari password saat ini';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Update password using AuthService
      const result = await AuthService.updatePassword(formData.newPassword);

      if (result.success) {
        setSuccess(true);
        
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Show success message and redirect after delay
        setTimeout(() => {
          alert('Password berhasil diubah!');
          navigate('/');
        }, 1500);
      } else {
        setErrors({
          general: result.error || 'Gagal mengubah password'
        });
      }

    } catch (err) {
      console.error('Error changing password:', err);
      setErrors({
        general: 'Terjadi kesalahan. Silakan coba lagi.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (window.confirm('Apakah Anda yakin ingin kembali? Perubahan yang belum disimpan akan hilang.')) {
      navigate(-1);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Mengubah password..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 mt-4">
          <div className="flex items-start sm:items-center justify-between mb-4">
            <div className="flex items-start sm:items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                aria-label="Kembali"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="text-blue-600" size={18} sm:size={24} />
                  Ubah Password
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  Pastikan password baru Anda aman dan mudah diingat
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ Password berhasil diubah! Mengarahkan...
              </p>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                ❌ {errors.general}
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-4 lg:gap-6 items-start">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Current Password */}
              <div>
                <Input
                  label="Password Saat Ini"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Masukkan password saat ini"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  error={errors.currentPassword}
                  disabled={loading}
                  required
                  rightIcon={showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconClick={() => togglePasswordVisibility('current')}
                />
              </div>

              {/* New Password */}
              <div>
                <Input
                  label="Password Baru"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  error={errors.newPassword}
                  disabled={loading}
                  helperText="Minimal 6 karakter dengan huruf besar, kecil, dan angka"
                  required
                  rightIcon={showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconClick={() => togglePasswordVisibility('new')}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Input
                  label="Konfirmasi Password Baru"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  disabled={loading}
                  required
                  rightIcon={showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconClick={() => togglePasswordVisibility('confirm')}
                />
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Kekuatan Password:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center gap-2 ${
                      formData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="truncate">Minimal 6 karakter</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                      /(?=.*[a-z])/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        /(?=.*[a-z])/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="truncate">Huruf kecil</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                      /(?=.*[A-Z])/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        /(?=.*[A-Z])/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="truncate">Huruf besar</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                      /(?=.*\d)/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        /(?=.*\d)/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="truncate">Angka</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Mengubah Password...</span>
                      <span className="sm:hidden">Mengubah...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span className="hidden sm:inline">Ubah Password</span>
                      <span className="sm:hidden">Ubah</span>
                    </>
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
          
          {/* Security Tips */}
          <div className="lg:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-3 text-sm sm:text-base">💡 Tips Keamanan:</h3>
            <ul className="text-blue-700 text-xs sm:text-sm space-y-2">
              <li>• Gunakan kombinasi huruf besar, kecil, angka, dan simbol</li>
              <li>• Jangan gunakan informasi pribadi dalam password</li>
              <li>• Ubah password secara berkala untuk keamanan</li>
              <li>• Jangan bagikan password kepada siapa pun</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;