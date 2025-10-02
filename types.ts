export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export interface User {
  username: string;
  role: UserRole;
}

export interface Employee {
  id: string;
  name: string;
  cccd: string;
  phone: string;
  taxCode: string;
  email: string;
  address: string;
  status: 'Đang làm' | 'Nghỉ việc';
  warehouseId?: string; // Optional: ID of the warehouse the employee is assigned to
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  managerId: string; // Employee ID
  capacity?: number;
}

export interface Material {
  id: string;
  name: string;
  supplier: string;
  specification: string;
  unit: string;
}

export interface Inventory {
  warehouseId: string;
  materialId: string;
  quantity: number;
}

export type TransactionType = 'Nhập kho' | 'Xuất kho' | 'Chuyển kho';

export interface Transaction {
  id: string;
  type: TransactionType;
  materialId: string;
  quantity: number;
  date: string;
  sourceWarehouseId?: string;
  destinationWarehouseId?: string;
  reason?: string;
  unitPrice?: number;
}

export type AttendanceStatus = 'Đi làm' | 'Nghỉ phép' | 'Nghỉ không phép';

export interface TimesheetEntry {
    id: string;
    employeeId: string;
    date: string;
    status: AttendanceStatus;
}