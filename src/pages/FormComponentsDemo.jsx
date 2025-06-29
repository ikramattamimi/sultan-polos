import React, { useState } from 'react';
import { AlertCircle, ChevronDown, Minus, Plus, Code, Eye } from 'lucide-react';
import { Input, TextArea, Select, NumberInput } from '../components/ui/forms';

// Demo Component
const FormComponentsDemo = () => {
  const [showCode, setShowCode] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    description: '',
    price: '100000',
    website: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: 'Format email tidak valid'
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Pakaian' },
    { value: 'books', label: 'Buku' },
    { value: 'food', label: 'Makanan' }
  ];

  const toggleCode = (section) => {
    setShowCode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CodeBlock = ({ code, section }) => (
    <div className="mt-4">
      <button
        onClick={() => toggleCode(section)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-2"
      >
        <Code className="h-4 w-4" />
        {showCode[section] ? 'Hide Code' : 'Show Code'}
      </button>
      {showCode[section] && (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Form Components Usage Guide
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Panduan lengkap penggunaan form components dengan live examples dan code snippets
        </p>
      </div>

      {/* Basic Input */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          1. Input Component
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Basic Input</h3>
            <Input
              label="Nama Produk"
              placeholder="Masukkan nama produk"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Input with Error</h3>
            <Input
              label="Email"
              type="email"
              placeholder="contoh@email.com"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-3">Input with Helper Text</h3>
          <Input
            label="Website"
            type="url"
            placeholder="https://contoh.com"
            value={formData.website}
            onChange={handleChange('website')}
            helperText="Masukkan URL lengkap dengan https://"
          />
        </div>

        <CodeBlock
          section="input"
          code={`<Input
  label="Nama Produk"
  placeholder="Masukkan nama produk"
  value={formData.name}
  onChange={handleChange('name')}
  error={errors.name}
  helperText="Helper text disini"
  required
  size="md" // sm, md, lg
  disabled={false}
/>`}
        />
      </section>

      {/* Select */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          2. Select Component
        </h2>

        <div className="max-w-md">
          <Select
            label="Kategori Produk"
            options={categoryOptions}
            value={formData.category}
            onChange={handleChange('category')}
            placeholder="Pilih kategori"
            helperText="Pilih kategori yang sesuai dengan produk"
            required
          />
        </div>

        <CodeBlock
          section="select"
          code={`const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Pakaian' },
  { value: 'books', label: 'Buku' }
];

<Select
  label="Kategori Produk"
  options={categoryOptions}
  value={formData.category}
  onChange={handleChange('category')}
  placeholder="Pilih kategori"
  error={errors.category}
  required
/>`}
        />
      </section>

      {/* Number Input */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          3. NumberInput Component
        </h2>

        <div className="max-w-md">
          <NumberInput
            label="Harga Produk"
            value={formData.price}
            onChange={handleChange('price')}
            min={0}
            step={5000}
            showControls
            helperText="Gunakan tombol +/- atau ketik langsung"
            required
          />
        </div>

        <CodeBlock
          section="number"
          code={`<NumberInput
  label="Harga Produk"
  value={formData.price}
  onChange={handleChange('price')}
  min={0}
  max={1000000}
  step={5000}
  showControls={true}
  error={errors.price}
  required
/>`}
        />
      </section>

      {/* TextArea */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          4. TextArea Component
        </h2>

        <TextArea
          label="Deskripsi Produk"
          placeholder="Masukkan deskripsi lengkap produk..."
          value={formData.description}
          onChange={handleChange('description')}
          rows={5}
          helperText="Minimal 50 karakter untuk deskripsi yang baik"
        />

        <CodeBlock
          section="textarea"
          code={`<TextArea
  label="Deskripsi Produk"
  placeholder="Masukkan deskripsi lengkap produk..."
  value={formData.description}
  onChange={handleChange('description')}
  rows={5}
  error={errors.description}
  helperText="Minimal 50 karakter"
  required
/>`}
        />
      </section>

      {/* Size Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          5. Size Variants
        </h2>

        <div className="space-y-4">
          <Input
            label="Small Size"
            size="sm"
            placeholder="Small input"
            value=""
            onChange={() => {}}
          />
          <Input
            label="Medium Size (Default)"
            size="md"
            placeholder="Medium input"
            value=""
            onChange={() => {}}
          />
          <Input
            label="Large Size"
            size="lg"
            placeholder="Large input"
            value=""
            onChange={() => {}}
          />
        </div>

        <CodeBlock
          section="sizes"
          code={`<Input size="sm" ... />
<Input size="md" ... /> {/* default */}
<Input size="lg" ... />`}
        />
      </section>

      {/* Complete Form Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          6. Complete Form Example
        </h2>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Produk"
                placeholder="Masukkan nama produk"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />

              <Select
                label="Kategori"
                options={categoryOptions}
                value={formData.category}
                onChange={handleChange('category')}
                placeholder="Pilih kategori"
                required
              />
            </div>

            <NumberInput
              label="Harga"
              value={formData.price}
              onChange={handleChange('price')}
              min={0}
              step={1000}
              showControls
              required
            />

            <TextArea
              label="Deskripsi"
              placeholder="Deskripsi produk..."
              value={formData.description}
              onChange={handleChange('description')}
              rows={4}
            />

            <div className="flex gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>

        <CodeBlock
          section="complete"
          code={`const [formData, setFormData] = useState({
  name: '',
  category: '',
  price: '',
  description: ''
});

const [errors, setErrors] = useState({});

const handleChange = (field) => (e) => {
  setFormData(prev => ({
    ...prev,
    [field]: e.target.value
  }));
};

return (
  <form className="space-y-6">
    <Input
      label="Nama Produk"
      value={formData.name}
      onChange={handleChange('name')}
      error={errors.name}
      required
    />
    
    <Select
      label="Kategori"
      options={categoryOptions}
      value={formData.category}
      onChange={handleChange('category')}
      error={errors.category}
      required
    />
    
    {/* ... more fields */}
  </form>
);`}
        />
      </section>

      {/* Props Reference */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          7. Props Reference
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Prop</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Default</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Description</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">label</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">string</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">-</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Label untuk form field</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">value</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">string</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">''</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Nilai input</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">onChange</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">function</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">-</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Handler untuk perubahan nilai</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">error</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">string</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">-</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Pesan error</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">helperText</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">string</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">-</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Teks bantuan</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">required</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">boolean</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">false</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Field wajib diisi</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">disabled</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">boolean</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">false</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Disable input</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">size</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">'sm' | 'md' | 'lg'</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">'md'</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Ukuran komponen</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Import Instructions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          8. How to Import & Use
        </h2>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">1. Import Components</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto mb-4">
            <code>{`import { 
  Input, 
  TextArea, 
  Select, 
  NumberInput,
  FormGroup,
  FormLabel,
  FieldError,
  HelperText 
} from './components/ui/forms';`}</code>
          </pre>

          <h3 className="text-lg font-medium mb-4">2. Basic Usage Pattern</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto mb-4">
            <code>{`const [formData, setFormData] = useState({
  name: '',
  email: '',
  category: ''
});

const [errors, setErrors] = useState({});

const handleChange = (field) => (e) => {
  setFormData(prev => ({
    ...prev,
    [field]: e.target.value
  }));
};

// Validation function
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.name) {
    newErrors.name = 'Nama harus diisi';
  }
  
  if (!formData.email) {
    newErrors.email = 'Email harus diisi';
  } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
    newErrors.email = 'Format email tidak valid';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};`}</code>
          </pre>

          <h3 className="text-lg font-medium mb-4">3. Form Submission</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
            <code>{`const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  try {
    // API call atau logic lainnya
    const response = await api.submitForm(formData);
    console.log('Success:', response);
    
    // Reset form jika berhasil
    setFormData({
      name: '',
      email: '',
      category: ''
    });
    setErrors({});
    
  } catch (error) {
    console.error('Error:', error);
    setErrors({ submit: 'Terjadi kesalahan saat menyimpan data' });
  }
};`}</code>
          </pre>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          9. Best Practices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">✅ Do</h3>
            <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
              <li>• Gunakan label yang jelas dan deskriptif</li>
              <li>• Berikan helper text untuk field yang kompleks</li>
              <li>• Validasi form secara real-time</li>
              <li>• Gunakan required prop untuk field wajib</li>
              <li>• Consistent sizing across related fields</li>
              <li>• Handle loading dan disabled states</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">❌ Don't</h3>
            <ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
              <li>• Jangan biarkan field tanpa label</li>
              <li>• Jangan gunakan placeholder sebagai label</li>
              <li>• Jangan submit form tanpa validasi</li>
              <li>• Jangan mix different sizes dalam satu form</li>
              <li>• Jangan lupa handle error states</li>
              <li>• Jangan hard-code error messages</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Advanced Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          10. Advanced Usage
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Custom Validation</h3>
            <Input
              label="Password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={formData.password}
              onChange={handleChange('password')}
              error={formData.password.length > 0 && formData.password.length < 8 ? 'Password minimal 8 karakter' : ''}
              helperText="Gunakan kombinasi huruf, angka, dan simbol"
            />
          </div>

          <CodeBlock
            section="advanced"
            code={`// Custom validation with debounce
import { useDebounce } from './hooks/useDebounce';

const [password, setPassword] = useState('');
const debouncedPassword = useDebounce(password, 500);
const [passwordError, setPasswordError] = useState('');

useEffect(() => {
  if (debouncedPassword) {
    validatePassword(debouncedPassword);
  }
}, [debouncedPassword]);

const validatePassword = (pwd) => {
  if (pwd.length < 8) {
    setPasswordError('Password minimal 8 karakter');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/.test(pwd)) {
    setPasswordError('Password harus mengandung huruf besar, kecil, dan angka');
  } else {
    setPasswordError('');
  }
};

// Controlled component with custom logic
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={passwordError}
  helperText="Minimal 8 karakter dengan huruf besar, kecil, dan angka"
/>`}
          />
        </div>
      </section>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Form components sudah siap digunakan! Coba implementasi di project kamu dan sesuaikan dengan kebutuhan.
        </p>
      </div>
    </div>
  );
};

export default FormComponentsDemo;