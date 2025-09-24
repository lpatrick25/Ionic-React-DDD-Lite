import { environment } from 'src/environments/environment';

export const API_ENDPOINTS = {
  BASE_URL: environment.apiUrl,
  LOGIN: '/login',
  USERS: '/users',
  CONSUMERS: '/concessionaires',
  METERS: '/meters'
} as const;

export const ROLES = {
  ADMIN: 'Admin',
  METER_READER: 'Meter Reader',
  CASHIER: 'Cashier',
  HEAD: 'Head',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ADDRESSES = {
  Batug: 'Batug',
  Burabod: 'Burabod',
  Capudlosan: 'Capudlosan',
  Casuntingan: 'Casuntingan',
  Causwagan: 'Causwagan',
  Danao: 'Danao',
  'Doña Josefa': 'Doña Josefa',
  'General Luna': 'General Luna',
  Kiling: 'Kiling',
  Lanawan: 'Lanawan',
  Liwayway: 'Liwayway',
  Maya: 'Maya',
  Oguisan: 'Oguisan',
  Osmeña: 'Osmeña',
  'Palale 1': 'Palale 1',
  'Palale 2': 'Palale 2',
  'Poblacion District 1': 'Poblacion District 1',
  'Poblacion District 2': 'Poblacion District 2',
  'Poblacion District 3': 'Poblacion District 3',
  Pongon: 'Pongon',
  Quezon: 'Quezon',
  Romualdez: 'Romualdez',
  Salvacion: 'Salvacion',
  'San Antonio': 'San Antonio',
  'San Isidro': 'San Isidro',
  'San Pedro': 'San Pedro',
  'San Vicente': 'San Vicente',
  'Santa Isabel': 'Santa Isabel',
  Tinawan: 'Tinawan',
  Tuyo: 'Tuyo',
  'Villa Imelda': 'Villa Imelda',
} as const;

export type Address = (typeof ADDRESSES)[keyof typeof ADDRESSES];

export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;
