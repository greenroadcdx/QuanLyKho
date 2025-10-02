import type { Employee, Warehouse, Material, Inventory, Transaction, TimesheetEntry } from '../types';

export const mockEmployees: Employee[] = [
  { id: 'CDX01', name: 'Nguyễn Văn A', cccd: '012345678901', phone: '0901234567', taxCode: 'MST001', email: 'a.nv@cdx.vn', address: '123 Đường ABC, Quận 1, TP.HCM', status: 'Đang làm', warehouseId: 'KCDX001' },
  { id: 'CDX02', name: 'Trần Thị B', cccd: '012345678902', phone: '0902345678', taxCode: 'MST002', email: 'b.tt@cdx.vn', address: '456 Đường DEF, Quận 2, TP.HCM', status: 'Đang làm', warehouseId: 'KCDX002' },
  { id: 'CDX03', name: 'Lê Văn C', cccd: '012345678903', phone: '0903456789', taxCode: 'MST003', email: 'c.lv@cdx.vn', address: '789 Đường GHI, Quận 3, TP.HCM', status: 'Nghỉ việc' },
];

export const mockWarehouses: Warehouse[] = [
  { id: 'KCDX001', name: 'Kho Trung Tâm', address: 'Khu công nghiệp Sóng Thần, Bình Dương', managerId: 'CDX01', capacity: 5000 },
  { id: 'KCDX002', name: 'Kho Vệ Tinh', address: 'Khu công nghiệp Tân Bình, TP.HCM', managerId: 'CDX02', capacity: 2000 },
];

export const mockMaterials: Material[] = [
  { id: 'VT0001', name: 'Xi măng PCB40', supplier: 'Nhà cung cấp X', specification: 'Bao 50kg', unit: 'Bao' },
  { id: 'VT0002', name: 'Thép cây D10', supplier: 'Nhà cung cấp Y', specification: 'Cây 11.7m', unit: 'Cây' },
  { id: 'VT0003', name: 'Gạch ống 4 lỗ', supplier: 'Nhà cung cấp Z', specification: '8x8x18 cm', unit: 'Viên' },
  { id: 'VT0004', name: 'Cát xây tô', supplier: 'Nhà cung cấp X', specification: 'Loại 1', unit: 'm³' },
];

export const mockInventory: Inventory[] = [
  { warehouseId: 'KCDX001', materialId: 'VT0001', quantity: 1000 },
  { warehouseId: 'KCDX001', materialId: 'VT0002', quantity: 500 },
  { warehouseId: 'KCDX001', materialId: 'VT0003', quantity: 10000 },
  { warehouseId: 'KCDX002', materialId: 'VT0001', quantity: 200 },
  { warehouseId: 'KCDX002', materialId: 'VT0004', quantity: 50 },
];

export const mockTransactions: Transaction[] = [
    { id: 'NK-KCDX001-0001', type: 'Nhập kho', materialId: 'VT0001', quantity: 1000, date: '2023-10-01', destinationWarehouseId: 'KCDX001', unitPrice: 85000 },
    { id: 'NK-KCDX001-0002', type: 'Nhập kho', materialId: 'VT0002', quantity: 500, date: '2023-10-02', destinationWarehouseId: 'KCDX001', unitPrice: 120000 },
    { id: 'XK-KCDX001-0001', type: 'Xuất kho', materialId: 'VT0003', quantity: 2000, date: '2023-10-05', sourceWarehouseId: 'KCDX001', reason: 'Dự án A' },
    { id: 'CK-KCDX001-0001', type: 'Chuyển kho', materialId: 'VT0001', quantity: 200, date: '2023-10-10', sourceWarehouseId: 'KCDX001', destinationWarehouseId: 'KCDX002' },
];

export const mockTimesheets: TimesheetEntry[] = [
    { id: 'TS001', employeeId: 'CDX01', date: '2023-11-01', status: 'Đi làm' },
    { id: 'TS002', employeeId: 'CDX02', date: '2023-11-01', status: 'Đi làm' },
    { id: 'TS003', employeeId: 'CDX01', date: '2023-11-02', status: 'Nghỉ phép' },
    { id: 'TS004', employeeId: 'CDX02', date: '2023-11-02', status: 'Đi làm' },
];