export type ToastPosition = 'top' | 'bottom' | 'middle';
export type ToastColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';

export interface ToastConfig {
  message: string;
  duration?: number;
  position: ToastPosition;
  color: ToastColor;
  buttons?: Array<{
    text: string;
    role?: 'cancel' | 'destructive' | 'primary' | 'secondary' | 'tertiary';
    handler?: () => void;
  }>;
}
