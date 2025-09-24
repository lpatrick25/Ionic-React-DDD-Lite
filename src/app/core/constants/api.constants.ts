export const API_ENDPOINTS = {
  BASE_URL: 'http://192.168.100.8:8000/api', // Replace with your actual API URL
  USERS: '/users'
} as const;

export const ROLES = {
  ADMIN: 'Admin',
  METER_READER: 'Meter Reader',
  CASHIER: 'Cashier',
  HEAD: 'Head'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const;
