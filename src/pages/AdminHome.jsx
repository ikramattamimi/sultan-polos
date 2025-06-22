import React from 'react';

const AdminHome = () => {
  return (
    <main className="w-full">
        <h1 className="text-center">Admin Home</h1>

        <div className="mt-10 me-10 flex gap-5 flex-wrap justify-center">
        </div>
    </main>
  );
};

export default AdminHome;

// import React, { useState } from 'react';
// import {
//   AiOutlineSearch,
//   AiOutlinePlus,
//   AiOutlineEdit,
//   AiOutlineDelete,
//   AiOutlineEye,
//   AiOutlineClose,
//   AiOutlineDown,
//   AiOutlineExclamationCircle,
//   AiOutlineCheckCircle,
//   AiOutlineCloseCircle,
//   AiOutlineClockCircle,
//   AiOutlineLoading3Quarters
// } from 'react-icons/ai';
//
// // Button Component
// export const Button = ({
//   children,
//   variant = 'primary',
//   size = 'md',
//   disabled = false,
//   loading = false,
//   onClick,
//   type = 'button',
//   className = '',
//   ...props
// }) => {
//   const baseClass = 'btn-base';
//   const variants = {
//     primary: 'btn-primary',
//     secondary: 'btn-secondary',
//     success: 'btn-success',
//     danger: 'btn-danger',
//     warning: 'btn-warning'
//   };
//   const sizes = {
//     sm: 'btn-sm',
//     md: '',
//     lg: 'btn-lg'
//   };
//
//   return (
//     <button
//       className={`${baseClass} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
//       disabled={disabled || loading}
//       onClick={onClick}
//       type={type}
//       {...props}
//     >
//       {loading && <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 animate-spin" />}
//       {children}
//     </button>
//   );
// };
//
// // Card Component
// export const Card = ({ children, className = '', header, title }) => {
//   return (
//     <div className={`card-base card-padding ${className}`}>
//       {(header || title) && (
//         <div className="card-header">
//           {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
//           {header}
//         </div>
//       )}
//       {children}
//     </div>
//   );
// };
//
// // Input Component
// export const Input = ({
//   label,
//   error,
//   type = 'text',
//   placeholder,
//   value,
//   onChange,
//   disabled = false,
//   required = false,
//   className = '',
//   ...props
// }) => {
//   return (
//     <div className="form-group">
//       {label && (
//         <label className="form-label">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
//       <input
//         type={type}
//         className={`form-input ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         required={required}
//         {...props}
//       />
//       {error && <p className="form-error">{error}</p>}
//     </div>
//   );
// };
//
// // Select Component
// export const Select = ({
//   label,
//   error,
//   options = [],
//   value,
//   onChange,
//   placeholder = 'Pilih option',
//   disabled = false,
//   required = false,
//   className = '',
//   ...props
// }) => {
//   return (
//     <div className="form-group">
//       {label && (
//         <label className="form-label">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
//       <select
//         className={`form-select ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         required={required}
//         {...props}
//       >
//         <option value="">{placeholder}</option>
//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//       {error && <p className="form-error">{error}</p>}
//     </div>
//   );
// };
//
// // Textarea Component
// export const Textarea = ({
//   label,
//   error,
//   placeholder,
//   value,
//   onChange,
//   disabled = false,
//   required = false,
//   rows = 4,
//   className = '',
//   ...props
// }) => {
//   return (
//     <div className="form-group">
//       {label && (
//         <label className="form-label">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
//       <textarea
//         className={`form-textarea ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         required={required}
//         rows={rows}
//         {...props}
//       />
//       {error && <p className="form-error">{error}</p>}
//     </div>
//   );
// };
//
// // Badge Component
// export const Badge = ({ children, variant = 'gray', className = '' }) => {
//   const variants = {
//     success: 'badge-success',
//     warning: 'badge-warning',
//     danger: 'badge-danger',
//     info: 'badge-info',
//     gray: 'badge-gray'
//   };
//
//   return (
//     <span className={`${variants[variant]} ${className}`}>
//       {children}
//     </span>
//   );
// };
//
// // Table Component
// export const Table = ({ columns, data, actions = [], loading = false }) => {
//   if (loading) {
//     return (
//       <div className="flex-center py-12">
//         <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
//         <span className="ml-2 text-gray-600">Loading...</span>
//       </div>
//     );
//   }
//
//   return (
//     <div className="table-container">
//       <table className="table-base">
//         <thead className="table-header">
//           <tr>
//             {columns.map((column, index) => (
//               <th key={index} className="table-header-cell">
//                 {column.header}
//               </th>
//             ))}
//             {actions.length > 0 && (
//               <th className="table-header-cell">Aksi</th>
//             )}
//           </tr>
//         </thead>
//         <tbody className="table-body">
//           {data.length === 0 ? (
//             <tr>
//               <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="table-cell text-center text-gray-500 py-8">
//                 Tidak ada data
//               </td>
//             </tr>
//           ) : (
//             data.map((row, rowIndex) => (
//               <tr key={rowIndex} className="table-row">
//                 {columns.map((column, colIndex) => (
//                   <td key={colIndex} className="table-cell">
//                     {column.render ? column.render(row[column.key], row) : row[column.key]}
//                   </td>
//                 ))}
//                 {actions.length > 0 && (
//                   <td className="table-cell">
//                     <div className="flex gap-2">
//                       {actions.map((action, actionIndex) => (
//                         <button
//                           key={actionIndex}
//                           onClick={() => action.onClick(row)}
//                           className={`p-1 rounded hover:bg-gray-100 ${action.className || ''}`}
//                           title={action.title}
//                         >
//                           {action.icon}
//                         </button>
//                       ))}
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };
//
// // Modal Component
// export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
//   if (!isOpen) return null;
//
//   const sizes = {
//     sm: 'sm:max-w-md',
//     md: 'sm:max-w-lg',
//     lg: 'sm:max-w-2xl',
//     xl: 'sm:max-w-4xl'
//   };
//
//   return (
//     <div className="modal-container">
//       <div className="modal-content">
//         <div className="modal-overlay" onClick={onClose}></div>
//         <div className={`modal-panel ${sizes[size]}`}>
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="flex-between mb-4">
//               <h3 className="text-lg font-medium text-gray-900">{title}</h3>
//               <button
//                 onClick={onClose}
//                 className="p-1 hover:bg-gray-100 rounded"
//               >
//                 <AiOutlineClose className="w-5 h-5" />
//               </button>
//             </div>
//             <div>{children}</div>
//           </div>
//           {footer && (
//             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//               {footer}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// // Search Component
// export const SearchInput = ({
//   placeholder = 'Cari...',
//   value,
//   onChange,
//   onSearch,
//   className = ''
// }) => {
//   return (
//     <div className={`relative ${className}`}>
//       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//         <AiOutlineSearch className="h-5 w-5 text-gray-400" />
//       </div>
//       <input
//         type="text"
//         className="form-input pl-10"
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         onKeyPress={(e) => e.key === 'Enter' && onSearch && onSearch()}
//       />
//     </div>
//   );
// };
//
// // Alert Component
// export const Alert = ({ type = 'info', title, message, onClose }) => {
//   const types = {
//     success: {
//       bgColor: 'bg-green-50',
//       borderColor: 'border-green-200',
//       textColor: 'text-green-800',
//       icon: <AiOutlineCheckCircle className="w-5 h-5 text-green-400" />
//     },
//     warning: {
//       bgColor: 'bg-yellow-50',
//       borderColor: 'border-yellow-200',
//       textColor: 'text-yellow-800',
//       icon: <AiOutlineExclamationCircle className="w-5 h-5 text-yellow-400" />
//     },
//     error: {
//       bgColor: 'bg-red-50',
//       borderColor: 'border-red-200',
//       textColor: 'text-red-800',
//       icon: <AiOutlineCloseCircle className="w-5 h-5 text-red-400" />
//     },
//     info: {
//       bgColor: 'bg-blue-50',
//       borderColor: 'border-blue-200',
//       textColor: 'text-blue-800',
//       icon: <AiOutlineClockCircle className="w-5 h-5 text-blue-400" />
//     }
//   };
//
//   const config = types[type];
//
//   return (
//     <div className={`rounded-md ${config.bgColor} ${config.borderColor} border p-4`}>
//       <div className="flex">
//         <div className="flex-shrink-0">
//           {config.icon}
//         </div>
//         <div className="ml-3 flex-1">
//           {title && (
//             <h3 className={`text-sm font-medium ${config.textColor}`}>
//               {title}
//             </h3>
//           )}
//           <div className={`text-sm ${config.textColor} ${title ? 'mt-2' : ''}`}>
//             {message}
//           </div>
//         </div>
//         {onClose && (
//           <div className="ml-auto pl-3">
//             <button
//               onClick={onClose}
//               className={`inline-flex rounded-md ${config.bgColor} p-1.5 ${config.textColor} hover:bg-opacity-50`}
//             >
//               <AiOutlineClose className="w-5 h-5" />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// // Loading Component
// export const Loading = ({ size = 'md', text = 'Loading...' }) => {
//   const sizes = {
//     sm: 'w-4 h-4',
//     md: 'w-8 h-8',
//     lg: 'w-12 h-12'
//   };
//
//   return (
//     <div className="flex-center py-4">
//       <AiOutlineLoading3Quarters className={`animate-spin ${sizes[size]}`} />
//       {text && <span className="ml-2 text-gray-600">{text}</span>}
//     </div>
//   );
// };
//
// // Dropdown Component
// export const Dropdown = ({ trigger, children, className = '' }) => {
//   const [isOpen, setIsOpen] = useState(false);
//
//   return (
//     <div className={`relative inline-block text-left ${className}`}>
//       <div onClick={() => setIsOpen(!isOpen)}>
//         {trigger}
//       </div>
//       {isOpen && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
//           <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//             <div className="py-1">{children}</div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
//
// // Currency Formatter
// export const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(amount);
// };
//
// // Date Formatter
// export const formatDate = (date) => {
//   return new Intl.DateTimeFormat('id-ID', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   }).format(new Date(date));
// };
//
// // Demo Component to show all components
// export default function ComponentDemo() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const [selectedValue, setSelectedValue] = useState('');
//
//   const tableData = [
//     { id: 1, name: 'Kaos Polos', category: 'T-Shirt', price: 75000, stock: 25 },
//     { id: 2, name: 'Kemeja Formal', category: 'Shirt', price: 125000, stock: 15 },
//     { id: 3, name: 'Celana Jeans', category: 'Pants', price: 200000, stock: 8 },
//   ];
//
//   const tableColumns = [
//     { key: 'name', header: 'Nama Produk' },
//     { key: 'category', header: 'Kategori' },
//     { key: 'price', header: 'Harga', render: (value) => <span className="text-currency">{formatCurrency(value)}</span> },
//     { key: 'stock', header: 'Stok', render: (value) => <Badge variant={value > 10 ? 'success' : 'warning'}>{value}</Badge> },
//   ];
//
//   const tableActions = [
//     { icon: <AiOutlineEye className="w-4 h-4" />, onClick: (row) => alert(`View ${row.name}`), title: 'Lihat' },
//     { icon: <AiOutlineEdit className="w-4 h-4" />, onClick: (row) => alert(`Edit ${row.name}`), title: 'Edit' },
//     { icon: <AiOutlineDelete className="w-4 h-4" />, onClick: (row) => alert(`Delete ${row.name}`), title: 'Hapus', className: 'text-red-600' },
//   ];
//
//   const selectOptions = [
//     { value: 'kaos', label: 'Kaos' },
//     { value: 'kemeja', label: 'Kemeja' },
//     { value: 'celana', label: 'Celana' },
//   ];
//
//   return (
//     <div className="section-padding space-y-8">
//       <div className="page-header">
//         <h1 className="page-title">Component Demo</h1>
//         <p className="text-gray-600 mt-2">Showcase of reusable React components</p>
//       </div>
//
//       {/* Buttons */}
//       <Card title="Buttons">
//         <div className="flex flex-wrap gap-4">
//           <Button variant="primary">Primary</Button>
//           <Button variant="secondary">Secondary</Button>
//           <Button variant="success">Success</Button>
//           <Button variant="danger">Danger</Button>
//           <Button variant="warning">Warning</Button>
//           <Button loading>Loading</Button>
//           <Button disabled>Disabled</Button>
//         </div>
//       </Card>
//
//       {/* Form Elements */}
//       <Card title="Form Elements">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Nama Produk"
//             placeholder="Masukkan nama produk"
//             required
//           />
//           <Select
//             label="Kategori"
//             options={selectOptions}
//             value={selectedValue}
//             onChange={(e) => setSelectedValue(e.target.value)}
//             required
//           />
//           <div className="md:col-span-2">
//             <Textarea
//               label="Deskripsi"
//               placeholder="Masukkan deskripsi produk"
//               rows={3}
//             />
//           </div>
//         </div>
//       </Card>
//
//       {/* Search */}
//       <Card title="Search">
//         <SearchInput
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           placeholder="Cari produk..."
//         />
//       </Card>
//
//       {/* Badges */}
//       <Card title="Badges">
//         <div className="flex flex-wrap gap-2">
//           <Badge variant="success">Active</Badge>
//           <Badge variant="warning">Pending</Badge>
//           <Badge variant="danger">Inactive</Badge>
//           <Badge variant="info">Info</Badge>
//           <Badge variant="gray">Default</Badge>
//         </div>
//       </Card>
//
//       {/* Alerts */}
//       <Card title="Alerts">
//         <div className="space-y-4">
//           <Alert type="success" title="Success" message="Data berhasil disimpan!" />
//           <Alert type="warning" message="Stok produk hampir habis!" />
//           <Alert type="error" title="Error" message="Terjadi kesalahan saat menyimpan data!" />
//           <Alert type="info" message="Informasi: Sistem akan maintenance pada malam hari." />
//         </div>
//       </Card>
//
//       {/* Table */}
//       <Card title="Table">
//         <Table
//           columns={tableColumns}
//           data={tableData}
//           actions={tableActions}
//         />
//       </Card>
//
//       {/* Modal */}
//       <Card title="Modal">
//         <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
//         <Modal
//           isOpen={modalOpen}
//           onClose={() => setModalOpen(false)}
//           title="Tambah Produk Baru"
//           footer={
//             <div className="flex gap-2">
//               <Button variant="secondary" onClick={() => setModalOpen(false)}>
//                 Batal
//               </Button>
//               <Button variant="primary" onClick={() => setModalOpen(false)}>
//                 Simpan
//               </Button>
//             </div>
//           }
//         >
//           <div className="space-y-4">
//             <Input label="Nama Produk" placeholder="Masukkan nama produk" />
//             <Select label="Kategori" options={selectOptions} />
//             <Input label="Harga" type="number" placeholder="0" />
//           </div>
//         </Modal>
//       </Card>
//
//       {/* Loading */}
//       <Card title="Loading States">
//         <div className="space-y-4">
//           <Loading size="sm" text="Small loading..." />
//           <Loading size="md" text="Medium loading..." />
//           <Loading size="lg" text="Large loading..." />
//         </div>
//       </Card>
//     </div>
//   );
// }