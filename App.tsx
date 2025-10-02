
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Page } from './constants';
import { UserRole, type User, type Employee, type Warehouse, type Material, type Inventory, type Transaction, type TransactionType, type TimesheetEntry, type AttendanceStatus } from './types';
import { mockEmployees, mockWarehouses, mockMaterials, mockInventory, mockTransactions, mockTimesheets } from './data/mockData';

// --- ICONS ---
const IconMenu = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>;
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const IconWarehouse = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 7L12 3L4 7L12 11L20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 7V17L12 21L20 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 11V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 9L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 hover:text-blue-700" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const IconDelete = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 hover:text-red-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const IconBox = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconInventory = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const IconTransaction = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>;
const IconClipboardList = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconTruck = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 hover:text-indigo-700" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v5a1 1 0 001 1h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V8a1 1 0 00-1-1h-5z" /></svg>;
const IconWarning = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


// --- LOGIN PAGE ---
interface LoginPageProps {
  onLogin: (user: User) => void;
  setError: (error: string) => void;
  error: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, setError }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1') {
      onLogin({ username: 'admin', role: UserRole.Admin });
    } else if (username === 'user' && password === 'user') {
      onLogin({ username: 'user', role: UserRole.User });
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-primary rounded-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">CDX</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Con Đường Xanh</h2>
        <p className="text-center text-gray-500 mb-8">Hệ thống Quản lý Kho & Nhân sự</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Tên đăng nhập</label>
            <select
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="•••••••••"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-primary hover:bg-green-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- MAIN LAYOUT COMPONENTS ---
interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  userRole: UserRole;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, userRole, isOpen }) => {
    const navItems = [
        { page: Page.Dashboard, icon: <IconDashboard />, roles: [UserRole.Admin, UserRole.User] },
        { page: Page.HR, icon: <IconUsers />, roles: [UserRole.Admin] },
        { page: Page.Warehouse, icon: <IconWarehouse />, roles: [UserRole.Admin, UserRole.User] },
        { page: Page.Materials, icon: <IconBox />, roles: [UserRole.Admin, UserRole.User] },
        { page: Page.Inventory, icon: <IconInventory />, roles: [UserRole.Admin, UserRole.User] },
        { page: Page.InventoryReport, icon: <IconClipboardList />, roles: [UserRole.Admin, UserRole.User] },
        { page: Page.DetailedInventory, icon: <IconClipboardList />, roles: [UserRole.Admin, UserRole.User] },
        { page: Page.Transactions, icon: <IconTransaction />, roles: [UserRole.Admin, UserRole.User] },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 bg-white shadow-md flex flex-col z-30 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-16 flex items-center justify-center border-b flex-shrink-0">
                <div className="w-10 h-10 bg-green-primary rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xl font-bold">CDX</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">Con Đường Xanh</h1>
            </div>
            <nav className="flex-grow p-4 overflow-y-auto">
                <ul>
                    {navItems.filter(item => item.roles.includes(userRole)).map(item => (
                        <li key={item.page}>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setPage(item.page); }}
                                className={`flex items-center p-3 my-2 rounded-lg transition-colors ${currentPage === item.page ? 'bg-green-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {item.icon}
                                <span className="ml-4 font-medium">{item.page}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onOpenSettings: () => void;
    currentPage: string;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onOpenSettings, currentPage, onToggleSidebar }) => {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-8 flex-shrink-0">
            <div className="flex items-center">
                 <button onClick={onToggleSidebar} className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden mr-4">
                    <IconMenu />
                </button>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">{currentPage}</h2>
            </div>
            <div className="flex items-center">
                <span className="hidden sm:inline text-gray-600 mr-4">Chào, <span className="font-bold">{user.username}</span> ({user.role})</span>
                 <button onClick={onOpenSettings} className="text-gray-500 hover:text-blue-500 mr-2 sm:mr-4" title="Cài đặt">
                    <IconSettings />
                </button>
                <button onClick={onLogout} className="text-gray-500 hover:text-red-500" title="Đăng xuất">
                    <IconLogout />
                </button>
            </div>
        </header>
    );
};

// --- CONFIRMATION MODAL ---
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <IconWarning />
                    </div>
                    <div className="ml-4 text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <div className="text-sm text-gray-500">
                                {message}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Xác nhận Xóa
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- SETTINGS MODAL ---
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentThreshold: number;
    onSave: (newThreshold: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentThreshold, onSave }) => {
    const [threshold, setThreshold] = useState(currentThreshold);

    useEffect(() => {
        setThreshold(currentThreshold);
    }, [currentThreshold, isOpen]);

    const handleSave = () => {
        const newThreshold = Number(threshold);
        if (!isNaN(newThreshold) && newThreshold >= 0) {
            onSave(newThreshold);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-xl font-semibold mb-4">Cài đặt Cảnh báo</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="min-stock" className="block text-sm font-medium text-gray-700 mb-1">
                            Mức tồn kho tối thiểu
                        </label>
                        <input
                            id="min-stock"
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Ví dụ: 50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ cảnh báo khi số lượng vật tư thấp hơn mức này.</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

// --- DASHBOARD PAGE ---
interface DashboardPageProps {
    employees: Employee[];
    warehouses: Warehouse[];
    inventory: Inventory[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ employees, warehouses, inventory }) => {
    const totalInventory = inventory.reduce((acc, item) => acc + item.quantity, 0);
    const summaryCards = [
        { title: 'Tổng số Nhân viên', value: employees.length, icon: <IconUsers /> },
        { title: 'Tổng số Kho hàng', value: warehouses.length, icon: <IconWarehouse /> },
        { title: 'Tổng Vật tư Tồn kho', value: totalInventory.toLocaleString(), icon: <IconInventory /> },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaryCards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-green-light rounded-full text-green-primary">{card.icon}</div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- HR MANAGEMENT ---
const getNextEmployeeId = (employees: Employee[]): string => {
    const lastIdNum = employees.reduce((max, e) => {
        const num = parseInt(e.id.replace('CDX', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `CDX${(lastIdNum + 1).toString().padStart(2, '0')}`;
};

// Employee Modal
interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (employee: Employee) => void;
    employee: Employee | null;
    employees: Employee[];
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, employee, employees }) => {
    const [formData, setFormData] = useState<Omit<Employee, 'id'>>({ name: '', cccd: '', phone: '', taxCode: '', email: '', address: '', status: 'Đang làm' });
    const isEditing = employee !== null;

    useEffect(() => {
        if (isOpen) {
            if (employee) {
                setFormData(employee);
            } else {
                setFormData({ name: '', cccd: '', phone: '', taxCode: '', email: '', address: '', status: 'Đang làm' });
            }
        }
    }, [isOpen, employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employeeToSave: Employee = {
            id: isEditing ? employee.id : getNextEmployeeId(employees),
            ...formData,
        };
        onSave(employeeToSave);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên mới'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                        <input type="text" name="cccd" placeholder="CCCD" value={formData.cccd} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                        <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                        <input type="text" name="taxCode" placeholder="Mã số thuế" value={formData.taxCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                         <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                            <option value="Đang làm">Đang làm</option>
                            <option value="Nghỉ việc">Nghỉ việc</option>
                        </select>
                        <div className="md:col-span-2">
                             <input type="text" name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Warehouse Assignment Modal
interface AssignWarehouseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (employeeId: string, warehouseId: string) => void;
    employee: Employee | null;
    warehouses: Warehouse[];
}

const AssignWarehouseModal: React.FC<AssignWarehouseModalProps> = ({ isOpen, onClose, onSave, employee, warehouses }) => {
    const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
    
    useEffect(() => {
        if (employee) {
            setSelectedWarehouseId(employee.warehouseId || '');
        }
    }, [employee]);

    if (!isOpen || !employee) return null;

    const handleSave = () => {
        onSave(employee.id, selectedWarehouseId);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-xl font-semibold mb-4">Điều động Nhân viên</h3>
                <p className="mb-4">Điều động <span className="font-bold">{employee.name}</span> đến kho:</p>
                <select 
                    value={selectedWarehouseId}
                    onChange={(e) => setSelectedWarehouseId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                    <option value="">-- Bỏ chọn kho --</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <div className="flex justify-end space-x-2 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary">Lưu</button>
                </div>
            </div>
        </div>
    );
};

// Timesheet Modal
interface TimesheetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: TimesheetEntry) => void;
    employees: Employee[];
    entryToEdit: TimesheetEntry | null;
}

const TimesheetModal: React.FC<TimesheetModalProps> = ({ isOpen, onClose, onSave, employees, entryToEdit }) => {
    const [formData, setFormData] = useState({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Đi làm' as AttendanceStatus });
    const isEditing = !!entryToEdit;

    useEffect(() => {
        if (isOpen) {
            if (entryToEdit) {
                setFormData({
                    employeeId: entryToEdit.employeeId,
                    date: entryToEdit.date,
                    status: entryToEdit.status,
                });
            } else {
                setFormData({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Đi làm' as AttendanceStatus });
            }
        }
    }, [isOpen, entryToEdit]);

    if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.employeeId) return;
        onSave({
            id: isEditing ? entryToEdit.id : `TS${Date.now()}`,
            ...formData
        });
        onClose();
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Sửa' : 'Thêm'} Lượt Chấm công</h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Nhân viên</label>
                            <select name="employeeId" value={formData.employeeId} onChange={e => setFormData(p => ({...p, employeeId: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md" required disabled={isEditing}>
                                <option value="">Chọn nhân viên</option>
                                {employees.filter(e => e.status === 'Đang làm' || (isEditing && e.id === formData.employeeId)).map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Ngày</label>
                            <input type="date" value={formData.date} onChange={e => setFormData(p => ({...p, date: e.target.value}))} className="mt-1 block w-full border border-gray-300 rounded-md" required/>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                            <select value={formData.status} onChange={e => setFormData(p => ({...p, status: e.target.value as AttendanceStatus}))} className="mt-1 block w-full border border-gray-300 rounded-md" required>
                                <option value="Đi làm">Đi làm</option>
                                <option value="Nghỉ phép">Nghỉ phép</option>
                                <option value="Nghỉ không phép">Nghỉ không phép</option>
                            </select>
                        </div>
                    </div>
                     <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-green-primary text-white rounded-md">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- HR Management Page Component ---
interface HRManagementPageProps {
    employees: Employee[];
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
    warehouses: Warehouse[];
    timesheets: TimesheetEntry[];
    setTimesheets: React.Dispatch<React.SetStateAction<TimesheetEntry[]>>;
}

const HRManagementPage: React.FC<HRManagementPageProps> = ({ employees, setEmployees, warehouses, timesheets, setTimesheets }) => {
    const [activeTab, setActiveTab] = useState('employees');
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningEmployee, setAssigningEmployee] = useState<Employee | null>(null);
    const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
    const [editingTimesheet, setEditingTimesheet] = useState<TimesheetEntry | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    const handleAddNewEmployee = () => {
        setEditingEmployee(null);
        setIsEmployeeModalOpen(true);
    };

    const handleEditEmployee = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsEmployeeModalOpen(true);
    };

    const handleDeleteEmployee = (employee: Employee) => {
        const isManager = warehouses.some(w => w.managerId === employee.id);
        if (isManager) {
            alert('Không thể xóa nhân viên này vì họ đang là quản lý của một kho. Vui lòng thay đổi quản lý kho trước khi xóa nhân viên.');
            return;
        }
        setEmployeeToDelete(employee);
        setIsConfirmModalOpen(true);
    };
    
    const confirmDeleteEmployee = () => {
        if (!employeeToDelete) return;

        setEmployees(prev => prev.filter(e => e.id !== employeeToDelete.id));
        setTimesheets(prev => prev.filter(t => t.employeeId !== employeeToDelete.id));

        setIsConfirmModalOpen(false);
        setEmployeeToDelete(null);
    };

    const handleSaveEmployee = (employee: Employee) => {
        if (editingEmployee) {
            setEmployees(prev => prev.map(e => (e.id === employee.id ? employee : e)));
        } else {
            setEmployees(prev => [...prev, employee]);
        }
        setIsEmployeeModalOpen(false);
    };

    const handleOpenAssignModal = (employee: Employee) => {
        setAssigningEmployee(employee);
        setIsAssignModalOpen(true);
    };
    
    const handleSaveAssignment = (employeeId: string, warehouseId: string) => {
        setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, warehouseId: warehouseId || undefined } : e));
    };

    const handleAddNewTimesheet = () => {
        setEditingTimesheet(null);
        setIsTimesheetModalOpen(true);
    };

    const handleEditTimesheet = (entry: TimesheetEntry) => {
        setEditingTimesheet(entry);
        setIsTimesheetModalOpen(true);
    };
    
    const handleDeleteTimesheet = (timesheetId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lượt chấm công này?')) {
            setTimesheets(prev => prev.filter(t => t.id !== timesheetId));
        }
    };

    const handleSaveTimesheet = (entry: TimesheetEntry) => {
        if (editingTimesheet) {
            setTimesheets(prev => prev.map(t => t.id === editingTimesheet.id ? entry : t));
        } else {
            setTimesheets(prev => [entry, ...prev]);
        }
        setIsTimesheetModalOpen(false);
    };

    const getWarehouseName = (warehouseId?: string) => warehouses.find(w => w.id === warehouseId)?.name || 'Chưa phân công';

    return (
        <div>
            <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('employees')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'employees' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Danh sách Nhân viên</button>
                    <button onClick={() => setActiveTab('timesheet')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'timesheet' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Chấm công</button>
                    <button onClick={() => setActiveTab('payroll')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payroll' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Bảng lương</button>
                </nav>
            </div>

            {activeTab === 'employees' && (
                <div>
                     <div className="flex justify-end mb-4">
                        <button onClick={handleAddNewEmployee} className="bg-green-primary hover:bg-green-secondary text-white font-bold py-2 px-4 rounded-lg flex items-center"><IconPlus />Thêm Nhân viên</button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Mã NV</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Họ tên</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">SĐT</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Kho làm việc</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Trạng thái</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employees.map(e => (
                                        <tr key={e.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{e.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{e.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{e.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{getWarehouseName(e.warehouseId)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${e.status === 'Đang làm' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{e.status}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2 sm:space-x-4">
                                                    <button onClick={() => handleOpenAssignModal(e)} title="Điều động"><IconTruck /></button>
                                                    <button onClick={() => handleEditEmployee(e)} title="Chỉnh sửa"><IconEdit /></button>
                                                    <button onClick={() => handleDeleteEmployee(e)} title="Xóa"><IconDelete /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'timesheet' && (
                 <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={handleAddNewTimesheet} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"><IconPlus />Thêm lượt chấm công</button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Ngày</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Mã NV</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Họ tên</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Trạng thái</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {timesheets.map(t => {
                                        const employee = employees.find(e => e.id === t.employeeId);
                                        return (
                                            <tr key={t.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{t.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{t.employeeId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{employee?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{t.status}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2 sm:space-x-4">
                                                        <button onClick={() => handleEditTimesheet(t)} title="Chỉnh sửa"><IconEdit /></button>
                                                        <button onClick={() => handleDeleteTimesheet(t.id)} title="Xóa"><IconDelete /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 </div>
            )}

            {activeTab === 'payroll' && (
                <div className="p-8 text-center bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Tính lương</h3>
                    <p className="text-gray-600">Module tính lương đang được phát triển và sẽ sớm ra mắt.</p>
                </div>
            )}
            
            <EmployeeModal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} onSave={handleSaveEmployee} employee={editingEmployee} employees={employees} />
            <AssignWarehouseModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onSave={handleSaveAssignment} employee={assigningEmployee} warehouses={warehouses} />
            <TimesheetModal 
                isOpen={isTimesheetModalOpen} 
                onClose={() => {
                    setIsTimesheetModalOpen(false);
                    setEditingTimesheet(null);
                }} 
                onSave={handleSaveTimesheet} 
                employees={employees} 
                entryToEdit={editingTimesheet} 
            />
            {employeeToDelete && (
                <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={confirmDeleteEmployee}
                    title="Xác nhận Xóa Nhân viên"
                    message={
                        <>
                            <p>Bạn có chắc chắn muốn xóa nhân viên <span className="font-bold">{employeeToDelete.name}</span>?</p>
                            <p className="text-sm text-red-600 font-semibold mt-2">Hành động này không thể hoàn tác. Mọi dữ liệu chấm công liên quan sẽ bị xóa vĩnh viễn.</p>
                        </>
                    }
                />
            )}
        </div>
    );
}

// --- MATERIALS MANAGEMENT PAGE ---

const getNextMaterialId = (materials: Material[]): string => {
    const lastIdNum = materials.reduce((max, m) => {
        const num = parseInt(m.id.replace('VT', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `VT${(lastIdNum + 1).toString().padStart(4, '0')}`;
};

interface MaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (material: Material) => void;
    material: Material | null;
    materials: Material[];
}

const MaterialModal: React.FC<MaterialModalProps> = ({ isOpen, onClose, onSave, material, materials }) => {
    const [formData, setFormData] = useState<Omit<Material, 'id'>>({ name: '', supplier: '', specification: '', unit: '' });
    const isEditing = material !== null;

    useEffect(() => {
        if (isOpen && material) {
            setFormData({ name: material.name, supplier: material.supplier, specification: material.specification, unit: material.unit });
        } else if (isOpen && !material) {
            setFormData({ name: '', supplier: '', specification: '', unit: '' });
        }
    }, [isOpen, material]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const materialToSave: Material = {
            id: isEditing ? material.id : getNextMaterialId(materials),
            ...formData,
        };
        onSave(materialToSave);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa Vật tư' : 'Thêm Vật tư mới'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên Vật tư</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Đơn vị tính</label>
                            <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nhà cung cấp</label>
                            <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Quy cách</label>
                            <input type="text" name="specification" value={formData.specification} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface MaterialsManagementPageProps {
    materials: Material[];
    setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
    inventory: Inventory[];
    setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
}
const MaterialsManagementPage: React.FC<MaterialsManagementPageProps> = ({ materials, setMaterials, inventory, setInventory }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    const handleAddNew = () => {
        setEditingMaterial(null);
        setIsModalOpen(true);
    };

    const handleEdit = (material: Material) => {
        setEditingMaterial(material);
        setIsModalOpen(true);
    };

    const handleDelete = (materialId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa vật tư này không? Mọi dữ liệu tồn kho liên quan cũng sẽ bị xóa vĩnh viễn.')) {
            setMaterials(prev => prev.filter(m => m.id !== materialId));
            setInventory(prev => prev.filter(i => i.materialId !== materialId));
        }
    };

    const handleSave = (material: Material) => {
        if (editingMaterial) {
            setMaterials(prev => prev.map(m => m.id === material.id ? material : m));
        } else {
            setMaterials(prev => [...prev, material]);
        }
        setIsModalOpen(false);
        setEditingMaterial(null);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={handleAddNew} className="bg-green-primary hover:bg-green-secondary text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <IconPlus /> Thêm Vật tư
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Thư viện Vật tư</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã VT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Vật tư</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà cung cấp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quy cách</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {materials.map(material => (
                                <tr key={material.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{material.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{material.supplier}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{material.specification}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{material.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
                                            <button onClick={() => handleEdit(material)} title="Chỉnh sửa"><IconEdit /></button>
                                            <button onClick={() => handleDelete(material.id)} title="Xóa"><IconDelete /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <MaterialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} material={editingMaterial} materials={materials} />
        </div>
    );
};

// --- WAREHOUSE MANAGEMENT MODALS ---
const getNextWarehouseId = (warehouses: Warehouse[]): string => {
    const lastIdNum = warehouses.reduce((max, w) => {
        const num = parseInt(w.id.replace('KCDX', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return `KCDX${(lastIdNum + 1).toString().padStart(3, '0')}`;
};

interface WarehouseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (warehouse: Warehouse) => void;
    warehouse: Warehouse | null;
    warehouses: Warehouse[];
    employees: Employee[];
}

const WarehouseModal: React.FC<WarehouseModalProps> = ({ isOpen, onClose, onSave, warehouse, warehouses, employees }) => {
    const [formData, setFormData] = useState({ name: '', address: '', managerId: '', capacity: '' });
    const isEditing = warehouse !== null;

    useEffect(() => {
        if (isOpen) {
            if (warehouse) {
                setFormData({ name: warehouse.name, address: warehouse.address, managerId: warehouse.managerId, capacity: warehouse.capacity?.toString() || '' });
            } else {
                setFormData({ name: '', address: '', managerId: '', capacity: '' });
            }
        }
    }, [isOpen, warehouse]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const warehouseToSave: Warehouse = {
            id: isEditing ? warehouse!.id : getNextWarehouseId(warehouses),
            name: formData.name,
            address: formData.address,
            managerId: formData.managerId,
            capacity: formData.capacity ? Number(formData.capacity) : undefined,
        };
        onSave(warehouseToSave);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa Kho' : 'Thêm Kho mới'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên Kho</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Người quản lý</label>
                                <select name="managerId" value={formData.managerId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" required>
                                    <option value="">Chọn quản lý</option>
                                    {employees.filter(e => e.status === 'Đang làm').map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sức chứa (tùy chọn)</label>
                                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md" placeholder="e.g. 1000" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-green-primary text-white rounded-md">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface AssignEmployeeToWarehouseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (employeeIds: string[]) => void;
    availableEmployees: Employee[];
    warehouseName?: string;
    warehouses: Warehouse[];
}

const AssignEmployeeToWarehouseModal: React.FC<AssignEmployeeToWarehouseModalProps> = ({ isOpen, onClose, onSave, availableEmployees, warehouseName, warehouses }) => {
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSelectedEmployeeIds([]);
            setSearchTerm('');
        }
    }, [isOpen]);

    const handleToggleEmployee = (employeeId: string) => {
        setSelectedEmployeeIds(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const handleSave = () => {
        onSave(selectedEmployeeIds);
    };
    
    const filteredEmployees = availableEmployees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 flex flex-col" style={{height: '80vh'}}>
                <h3 className="text-xl font-semibold mb-2">Gán Nhân viên cho Kho <span className="text-green-primary font-bold">{warehouseName}</span></h3>
                <p className="text-sm text-gray-500 mb-4">Chọn một hoặc nhiều nhân viên để gán vào kho này.</p>
                <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <div className="flex-grow overflow-y-auto border rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {filteredEmployees.map(e => (
                            <li key={e.id} onClick={() => handleToggleEmployee(e.id)} className={`p-3 flex items-center justify-between cursor-pointer ${selectedEmployeeIds.includes(e.id) ? 'bg-green-100' : 'hover:bg-gray-50'}`}>
                                <div>
                                    <p className="font-medium text-gray-800">{e.name}</p>
                                    <p className="text-xs text-gray-500">{e.id} - {e.warehouseId ? warehouses.find(w => w.id === e.warehouseId)?.name : '(Chưa phân công)'}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    readOnly
                                    checked={selectedEmployeeIds.includes(e.id)}
                                    className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                            </li>
                        ))}
                         {filteredEmployees.length === 0 && (
                            <li className="p-4 text-center text-gray-500">Không tìm thấy nhân viên phù hợp.</li>
                         )}
                    </ul>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Hủy</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-green-primary text-white rounded-md">Gán {selectedEmployeeIds.length > 0 ? `(${selectedEmployeeIds.length})` : ''}</button>
                </div>
            </div>
        </div>
    );
};

// --- WAREHOUSE MANAGEMENT PAGE ---
interface WarehouseManagementPageProps {
    warehouses: Warehouse[];
    setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
    employees: Employee[];
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
    inventory: Inventory[];
    setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
    materials: Material[];
}

const WarehouseManagementPage: React.FC<WarehouseManagementPageProps> = ({ warehouses, setWarehouses, employees, setEmployees, inventory, setInventory, materials }) => {
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(warehouses[0]?.id || null);
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [warehouseSearchTerm, setWarehouseSearchTerm] = useState('');
    const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

    const filteredWarehouses = useMemo(() => {
        if (!warehouseSearchTerm) return warehouses;
        return warehouses.filter(w => w.name.toLowerCase().includes(warehouseSearchTerm.toLowerCase()));
    }, [warehouses, warehouseSearchTerm]);

    useEffect(() => {
        if (selectedWarehouseId && !filteredWarehouses.some(w => w.id === selectedWarehouseId)) {
            setSelectedWarehouseId(filteredWarehouses[0]?.id || null);
        }
        if (!selectedWarehouseId && filteredWarehouses.length > 0) {
            setSelectedWarehouseId(filteredWarehouses[0].id);
        }
    }, [filteredWarehouses, selectedWarehouseId]);

    const selectedWarehouse = useMemo(() => warehouses.find(w => w.id === selectedWarehouseId), [warehouses, selectedWarehouseId]);

    const handleAddNewWarehouse = () => {
        setEditingWarehouse(null);
        setIsWarehouseModalOpen(true);
    };

    const handleEditWarehouse = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
        setIsWarehouseModalOpen(true);
    };

    const handleDeleteWarehouse = (warehouseId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa kho này? Mọi vật tư tồn kho và phân công nhân viên liên quan cũng sẽ bị xóa vĩnh viễn.')) {
            const remainingWarehouses = warehouses.filter(w => w.id !== warehouseId);
            setWarehouses(remainingWarehouses);
            setEmployees(prev => prev.map(e => e.warehouseId === warehouseId ? { ...e, warehouseId: undefined } : e));
            setInventory(prev => prev.filter(i => i.warehouseId !== warehouseId));
            
            if (selectedWarehouseId === warehouseId) {
                setSelectedWarehouseId(remainingWarehouses[0]?.id || null);
            }
        }
    };

    const handleSaveWarehouse = (warehouse: Warehouse) => {
        if (editingWarehouse) {
            setWarehouses(prev => prev.map(w => (w.id === warehouse.id ? warehouse : w)));
        } else {
            setWarehouses(prev => [...prev, warehouse]);
            setSelectedWarehouseId(warehouse.id);
        }
        setIsWarehouseModalOpen(false);
    };

    const handleUnassignEmployee = (employeeId: string) => {
         setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, warehouseId: undefined } : e));
    };

    const handleSaveAssignment = (employeeIds: string[]) => {
        if (!selectedWarehouseId) return;
        setEmployees(prev => prev.map(e => employeeIds.includes(e.id) ? { ...e, warehouseId: selectedWarehouseId } : e));
        setIsAssignModalOpen(false);
    };
    
    const manager = useMemo(() => employees.find(e => e.id === selectedWarehouse?.managerId), [employees, selectedWarehouse]);
    const employeesInWarehouse = useMemo(() => {
        const emps = employees.filter(e => e.warehouseId === selectedWarehouseId);
        if(!employeeSearchTerm) return emps;
        return emps.filter(e => e.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()));
    }, [employees, selectedWarehouseId, employeeSearchTerm]);
    
    const availableEmployees = useMemo(() => employees.filter(e => e.status === 'Đang làm' && e.warehouseId !== selectedWarehouseId), [employees, selectedWarehouseId]);

    const inventoryInWarehouse = useMemo(() => inventory.filter(i => i.warehouseId === selectedWarehouseId), [inventory, selectedWarehouseId]);
    const uniqueMaterialCount = useMemo(() => new Set(inventoryInWarehouse.map(i => i.materialId)).size, [inventoryInWarehouse]);
    const totalItemCount = useMemo(() => inventoryInWarehouse.reduce((sum, i) => sum + i.quantity, 0), [inventoryInWarehouse]);
    
    return (
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                     <h3 className="text-lg font-semibold text-gray-800 mb-3">Danh sách Kho</h3>
                     <input 
                        type="text"
                        placeholder="Tìm kiếm kho..."
                        value={warehouseSearchTerm}
                        onChange={(e) => setWarehouseSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                     />
                </div>
                <div className="p-2">
                    {filteredWarehouses.length > 0 ? filteredWarehouses.map(w => (
                         <div key={w.id} onClick={() => setSelectedWarehouseId(w.id)} className={`p-4 rounded-lg cursor-pointer mb-2 transition-all duration-200 ${selectedWarehouseId === w.id ? 'bg-green-100 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}>
                            <p className="font-bold text-gray-800">{w.name}</p>
                            <p className="text-sm text-gray-500">{w.address}</p>
                        </div>
                    )) : (
                        <div className="p-4 text-center text-gray-500">Không tìm thấy kho.</div>
                    )}
                </div>
                 <div className="p-4 mt-auto border-t">
                    <button onClick={handleAddNewWarehouse} className="w-full bg-green-primary hover:bg-green-secondary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
                        <IconPlus /> Thêm Kho mới
                    </button>
                </div>
            </div>

            <div className="w-full md:w-2/3 lg:w-3/4 p-4 sm:p-6 lg:p-8">
                {selectedWarehouse ? (
                    <div className="space-y-8">
                        <div className="bg-white rounded-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{selectedWarehouse.name}</h3>
                                    <p className="text-gray-600 mt-2"><span className="font-semibold">Địa chỉ:</span> {selectedWarehouse.address}</p>
                                    {manager && <p className="text-gray-600"><span className="font-semibold">Quản lý:</span> {manager.name} ({manager.phone})</p>}
                                    {selectedWarehouse.capacity && <p className="text-gray-600"><span className="font-semibold">Sức chứa:</span> {selectedWarehouse.capacity.toLocaleString()} đơn vị</p>}
                                </div>
                                <div className="flex space-x-2 flex-shrink-0 mt-4 sm:mt-0">
                                     <button onClick={() => handleEditWarehouse(selectedWarehouse)} className="p-2 rounded-full hover:bg-blue-100" title="Chỉnh sửa thông tin kho"><IconEdit /></button>
                                     <button onClick={() => handleDeleteWarehouse(selectedWarehouse.id)} className="p-2 rounded-full hover:bg-red-100" title="Xóa kho"><IconDelete /></button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center"><div className="p-3 bg-blue-100 rounded-full text-blue-500"><IconUsers/></div><div className="ml-4"><p className="text-sm text-gray-500">Tổng số Nhân viên</p><p className="text-xl font-bold text-gray-800">{employees.filter(e => e.warehouseId === selectedWarehouse.id).length}</p></div></div>
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center"><div className="p-3 bg-yellow-100 rounded-full text-yellow-500"><IconBox/></div><div className="ml-4"><p className="text-sm text-gray-500">Loại Vật tư</p><p className="text-xl font-bold text-gray-800">{uniqueMaterialCount}</p></div></div>
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center"><div className="p-3 bg-green-100 rounded-full text-green-500"><IconInventory/></div><div className="ml-4"><p className="text-sm text-gray-500">Tổng Tồn kho</p><p className="text-xl font-bold text-gray-800">{totalItemCount.toLocaleString()}</p></div></div>
                        </div>

                        <div>
                             <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                                <div><h4 className="text-xl font-semibold text-gray-700">Nhân viên tại Kho</h4><p className="text-sm text-gray-500">Danh sách nhân viên đang được phân công tại kho này.</p></div>
                                <button onClick={() => setIsAssignModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg flex items-center text-sm mt-3 sm:mt-0 w-full sm:w-auto justify-center"><IconPlus /> Gán Nhân viên</button>
                            </div>
                            <input type="text" placeholder="Tìm nhân viên trong kho..." value={employeeSearchTerm} onChange={(e) => setEmployeeSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mã NV</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th></tr></thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employeesInWarehouse.length > 0 ? employeesInWarehouse.map(e => (
                                            <tr key={e.id}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{e.id}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{e.name}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{e.phone}</td><td className="px-4 py-2 whitespace-nowrap text-right"><button onClick={() => handleUnassignEmployee(e.id)} className="text-red-500 text-xs font-semibold hover:underline">Bỏ phân công</button></td></tr>
                                        )) : (
                                            <tr><td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">{employeeSearchTerm ? 'Không tìm thấy nhân viên.' : 'Chưa có nhân viên nào tại kho này.'}</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <IconWarehouse />
                            <p className="mt-4 text-lg">{warehouses.length > 0 ? 'Chọn một kho để xem chi tiết' : 'Chưa có kho nào, hãy thêm một kho mới.'}</p>
                        </div>
                    </div>
                )}
            </div>

            <WarehouseModal isOpen={isWarehouseModalOpen} onClose={() => setIsWarehouseModalOpen(false)} onSave={handleSaveWarehouse} warehouse={editingWarehouse} warehouses={warehouses} employees={employees} />
            <AssignEmployeeToWarehouseModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onSave={handleSaveAssignment} availableEmployees={availableEmployees} warehouseName={selectedWarehouse?.name} warehouses={warehouses} />
        </div>
    );
};


// --- INVENTORY & TRANSACTIONS PAGE ---

const generateTransactionId = (type: TransactionType, warehouseId: string, allTransactions: Transaction[]): string => {
    const prefix = {
        'Nhập kho': 'NK',
        'Xuất kho': 'XK',
        'Chuyển kho': 'CK'
    }[type];

    const relevantTransactions = allTransactions.filter(t => 
        t.id.startsWith(`${prefix}-${warehouseId}`)
    );
    const nextId = relevantTransactions.length + 1;
    return `${prefix}-${warehouseId}-${nextId.toString().padStart(4, '0')}`;
};

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Transaction) => void;
    type: TransactionType;
    warehouses: Warehouse[];
    materials: Material[];
    inventory: Inventory[];
    transactions: Transaction[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, type, warehouses, materials, inventory, transactions }) => {
    const [formData, setFormData] = useState<Partial<Transaction>>({ type });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData({ type });
            setError('');
        }
    }, [isOpen, type]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const { materialId, quantity, sourceWarehouseId, destinationWarehouseId } = formData;
        const numQuantity = Number(quantity);

        if (type === 'Xuất kho' || type === 'Chuyển kho') {
            const stock = inventory.find(i => i.warehouseId === sourceWarehouseId && i.materialId === materialId)?.quantity ?? 0;
            if (numQuantity > stock) {
                setError(`Không đủ tồn kho. Tồn kho hiện tại: ${stock}`);
                return;
            }
        }

        const baseWarehouseId = sourceWarehouseId || destinationWarehouseId;
        if (!baseWarehouseId) {
             setError('Cần chọn kho nguồn hoặc kho đích.');
             return;
        }

        const newTransaction: Transaction = {
            id: generateTransactionId(type, baseWarehouseId, transactions),
            date: new Date().toISOString().split('T')[0],
            ...formData,
            quantity: numQuantity,
        } as Transaction;

        onSave(newTransaction);
    };

    if (!isOpen) return null;
    
    const title = {
        'Nhập kho': 'Tạo Phiếu Nhập Kho',
        'Xuất kho': 'Tạo Phiếu Xuất Kho',
        'Chuyển kho': 'Tạo Phiếu Chuyển Kho'
    }[type];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {(type === 'Xuất kho' || type === 'Chuyển kho') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Từ Kho (Nguồn)</label>
                                <select name="sourceWarehouseId" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                    <option value="">Chọn kho nguồn</option>
                                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                        )}
                        {(type === 'Nhập kho' || type === 'Chuyển kho') && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Đến Kho (Đích)</label>
                                <select name="destinationWarehouseId" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                     <option value="">Chọn kho đích</option>
                                     {warehouses.filter(w => w.id !== formData.sourceWarehouseId).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vật tư</label>
                            <select name="materialId" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required>
                                <option value="">Chọn vật tư</option>
                                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                             <input type="number" name="quantity" min="1" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                        </div>
                        {type === 'Nhập kho' && (
                            <div>
                               <label className="block text-sm font-medium text-gray-700">Đơn giá</label>
                               <input type="number" name="unitPrice" min="0" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                            </div>
                        )}
                         {type === 'Xuất kho' && (
                            <div>
                               <label className="block text-sm font-medium text-gray-700">Lý do xuất</label>
                               <input type="text" name="reason" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                            </div>
                        )}
                    </div>
                     {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-green-primary text-white rounded-md hover:bg-green-secondary">Tạo Phiếu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface TransactionsPageProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    inventory: Inventory[];
    setInventory: React.Dispatch<React.SetStateAction<Inventory[]>>;
    materials: Material[];
    warehouses: Warehouse[];
}
const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, setTransactions, inventory, setInventory, materials, warehouses }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<TransactionType>('Nhập kho');

    const handleOpenModal = (type: TransactionType) => {
        setTransactionType(type);
        setIsModalOpen(true);
    };

    const handleSaveTransaction = (transaction: Transaction) => {
        setTransactions(prev => [transaction, ...prev]);

        // Update inventory
        setInventory(prevInventory => {
            const newInventory = [...prevInventory];
            const { type, materialId, quantity, sourceWarehouseId, destinationWarehouseId } = transaction;

            if (type === 'Nhập kho' && destinationWarehouseId) {
                const itemIndex = newInventory.findIndex(i => i.warehouseId === destinationWarehouseId && i.materialId === materialId);
                if (itemIndex > -1) {
                    newInventory[itemIndex].quantity += quantity;
                } else {
                    newInventory.push({ warehouseId: destinationWarehouseId, materialId, quantity });
                }
            } else if (type === 'Xuất kho' && sourceWarehouseId) {
                const itemIndex = newInventory.findIndex(i => i.warehouseId === sourceWarehouseId && i.materialId === materialId);
                if (itemIndex > -1) {
                    newInventory[itemIndex].quantity -= quantity;
                }
            } else if (type === 'Chuyển kho' && sourceWarehouseId && destinationWarehouseId) {
                const sourceIndex = newInventory.findIndex(i => i.warehouseId === sourceWarehouseId && i.materialId === materialId);
                if (sourceIndex > -1) {
                    newInventory[sourceIndex].quantity -= quantity;
                }
                 const destIndex = newInventory.findIndex(i => i.warehouseId === destinationWarehouseId && i.materialId === materialId);
                if (destIndex > -1) {
                    newInventory[destIndex].quantity += quantity;
                } else {
                    newInventory.push({ warehouseId: destinationWarehouseId, materialId, quantity });
                }
            }
            return newInventory.filter(i => i.quantity > 0);
        });

        setIsModalOpen(false);
    };
    
    const getName = (id: string, type: 'material' | 'warehouse') => {
        if (type === 'material') return materials.find(m => m.id === id)?.name || 'N/A';
        return warehouses.find(w => w.id === id)?.name || 'N/A';
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-end mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
                <button onClick={() => handleOpenModal('Nhập kho')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Nhập Kho</button>
                <button onClick={() => handleOpenModal('Xuất kho')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Xuất Kho</button>
                <button onClick={() => handleOpenModal('Chuyển kho')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">Chuyển Kho</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Lịch sử Giao dịch</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Phiếu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vật tư</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ Kho</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến Kho</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                             {transactions.map(t => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getName(t.materialId, 'material')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.sourceWarehouseId ? getName(t.sourceWarehouseId, 'warehouse') : '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.destinationWarehouseId ? getName(t.destinationWarehouseId, 'warehouse') : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <TransactionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTransaction}
                type={transactionType}
                warehouses={warehouses}
                materials={materials}
                inventory={inventory}
                transactions={transactions}
             />
        </div>
    );
};

interface InventoryPageProps {
    inventory: Inventory[];
    materials: Material[];
    warehouses: Warehouse[];
    minStockThreshold: number;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ inventory, materials, warehouses, minStockThreshold }) => {
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    const getName = (id: string, type: 'material' | 'warehouse') => {
        if (type === 'material') return materials.find(m => m.id === id)?.name || 'N/A';
        return warehouses.find(w => w.id === id)?.name || 'N/A';
    };
    
    const filteredInventory = useMemo(() => {
        if (!selectedWarehouse) return inventory;
        return inventory.filter(item => item.warehouseId === selectedWarehouse);
    }, [inventory, selectedWarehouse]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h3 className="text-xl font-semibold">Báo cáo Tồn kho</h3>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                     <label htmlFor="warehouse-filter" className="text-sm font-medium text-gray-700">Lọc theo kho:</label>
                     <select
                        id="warehouse-filter"
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className="block w-full sm:w-48 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                        <option value="">Tất cả các kho</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kho</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Vật tư</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Vật tư</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng Tồn</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInventory.map(item => (
                            <tr key={`${item.warehouseId}-${item.materialId}`} className={item.quantity < minStockThreshold ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getName(item.warehouseId, 'warehouse')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.materialId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getName(item.materialId, 'material')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                                    {item.quantity}
                                    {item.quantity < minStockThreshold && (
                                        <span className="ml-3 px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
                                            Tồn kho thấp
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

interface DetailedInventoryReportPageProps {
    inventory: Inventory[];
    materials: Material[];
    warehouses: Warehouse[];
    minStockThreshold: number;
}

const DetailedInventoryReportPage: React.FC<DetailedInventoryReportPageProps> = ({ inventory, materials, warehouses, minStockThreshold }) => {
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    const inventoryByWarehouse = useMemo(() => {
        const grouped: { [key: string]: (Inventory & { material?: Material })[] } = {};

        inventory.forEach(item => {
            if (!grouped[item.warehouseId]) {
                grouped[item.warehouseId] = [];
            }
            const material = materials.find(m => m.id === item.materialId);
            grouped[item.warehouseId].push({ ...item, material });
        });

        return grouped;
    }, [inventory, materials]);

    const filteredWarehouses = useMemo(() => {
        if (!selectedWarehouse) return warehouses;
        return warehouses.filter(w => w.id === selectedWarehouse);
    }, [warehouses, selectedWarehouse]);

    return (
        <div>
            <div className="flex flex-col md:flex-row flex-wrap justify-between items-center mb-6 gap-4">
                 <div>
                    <h3 className="text-2xl font-bold text-gray-800">Báo cáo Tồn kho chi tiết</h3>
                    <p className="text-gray-600">Xem số lượng tồn kho của từng vật tư tại mỗi kho hàng.</p>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <label htmlFor="detailed-warehouse-filter" className="text-sm font-medium text-gray-700">Lọc theo kho:</label>
                    <select
                        id="detailed-warehouse-filter"
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                         className="block w-full md:w-48 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                        <option value="">Tất cả các kho</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
            </div>
            
            {filteredWarehouses.map(warehouse => (
                <div key={warehouse.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h4 className="text-xl font-semibold text-green-primary">{warehouse.name}</h4>
                    <p className="text-sm text-gray-500 mb-4">{warehouse.address}</p>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Vật tư</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Vật tư</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quy cách</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn vị</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số lượng Tồn</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventoryByWarehouse[warehouse.id] && inventoryByWarehouse[warehouse.id].length > 0 ? (
                                    inventoryByWarehouse[warehouse.id].map(item => (
                                        <tr key={item.materialId} className={item.quantity < minStockThreshold ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.materialId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.material?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.material?.specification || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.material?.unit || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-800">
                                                {item.quantity}
                                                {item.quantity < minStockThreshold && (
                                                    <span className="ml-3 px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
                                                        Tồn kho thấp
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Kho này chưa có vật tư.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- NEW INVENTORY REPORT PAGE ---
interface InventoryReportPageProps {
    inventory: Inventory[];
    materials: Material[];
    warehouses: Warehouse[];
}

const InventoryReportPage: React.FC<InventoryReportPageProps> = ({ inventory, materials, warehouses }) => {
    const reportData = useMemo(() => {
        return materials.map(material => {
            const inventoryForMaterial = inventory.filter(inv => inv.materialId === material.id);
            const totalQuantity = inventoryForMaterial.reduce((sum, inv) => sum + inv.quantity, 0);
            
            const warehouseQuantities = warehouses.reduce((acc, warehouse) => {
                const inventoryItem = inventoryForMaterial.find(inv => inv.warehouseId === warehouse.id);
                acc[warehouse.id] = inventoryItem ? inventoryItem.quantity : 0;
                return acc;
            }, {} as { [key: string]: number });

            return {
                material,
                totalQuantity,
                warehouseQuantities,
            };
        });
    }, [materials, inventory, warehouses]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Báo cáo Tồn kho Tổng hợp</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">Mã VT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-16 bg-gray-50 z-10">Tên Vật tư</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">Tổng Tồn</th>
                            {warehouses.map(w => (
                                <th key={w.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{w.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.map(row => (
                            <tr key={row.material.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">{row.material.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 sticky left-16 bg-white">{row.material.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.material.unit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.totalQuantity}</td>
                                {warehouses.map(w => (
                                    <td key={w.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.warehouseQuantities[w.id] || 0}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [minStockThreshold, setMinStockThreshold] = useState(50);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State Management for data
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [inventory, setInventory] = useState<Inventory[]>(mockInventory);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(mockTimesheets);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setLoginError('');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage(Page.Dashboard);
  };
  
  const handleSaveSettings = (newThreshold: number) => {
    setMinStockThreshold(newThreshold);
  };

  const handleSetPage = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
        case Page.Dashboard:
            return <DashboardPage employees={employees} warehouses={warehouses} inventory={inventory} />;
        case Page.HR:
            return <HRManagementPage employees={employees} setEmployees={setEmployees} warehouses={warehouses} timesheets={timesheets} setTimesheets={setTimesheets} />;
        case Page.Warehouse:
            return <WarehouseManagementPage 
                warehouses={warehouses} 
                setWarehouses={setWarehouses} 
                employees={employees} 
                setEmployees={setEmployees} 
                inventory={inventory}
                setInventory={setInventory}
                materials={materials}
            />;
        case Page.Materials:
            return <MaterialsManagementPage 
                materials={materials} 
                setMaterials={setMaterials} 
                inventory={inventory}
                setInventory={setInventory}
            />;
        case Page.Inventory:
            return <InventoryPage inventory={inventory} materials={materials} warehouses={warehouses} minStockThreshold={minStockThreshold} />;
        case Page.InventoryReport:
            return <InventoryReportPage inventory={inventory} materials={materials} warehouses={warehouses} />;
        case Page.DetailedInventory:
            return <DetailedInventoryReportPage inventory={inventory} materials={materials} warehouses={warehouses} minStockThreshold={minStockThreshold} />;
        case Page.Transactions:
            return <TransactionsPage 
                transactions={transactions} 
                setTransactions={setTransactions} 
                inventory={inventory} 
                setInventory={setInventory}
                materials={materials}
                warehouses={warehouses}
             />;
        default:
            return <DashboardPage employees={employees} warehouses={warehouses} inventory={inventory} />;
    }
  };


  if (!user) {
    return <LoginPage onLogin={handleLogin} error={loginError} setError={setLoginError} />;
  }

  return (
    <div className="relative min-h-screen md:flex bg-gray-100">
      {isSidebarOpen && (
        <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            aria-hidden="true"
        ></div>
      )}
      <Sidebar 
        currentPage={currentPage} 
        setPage={handleSetPage} 
        userRole={user.role}
        isOpen={isSidebarOpen} 
      />
      <div className="flex-1 flex flex-col max-w-full overflow-hidden">
        <Header 
            user={user} 
            onLogout={handleLogout} 
            currentPage={currentPage} 
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-200 p-4 sm:p-6 lg:p-8">
            {renderPage()}
        </main>
      </div>
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentThreshold={minStockThreshold}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
