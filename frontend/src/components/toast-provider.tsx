"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type ToastType = "success" | "error";

type ToastState = {
  id: number;
  type: ToastType;
  message: string;
} | null;

type ToastContextValue = {
  showToast: (toast: { type: ToastType; message: string }) => void;
  clearToast: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function ToastViewport({ toast }: { toast: ToastState }) {
  if (!toast) {
    return null;
  }

  const isSuccess = toast.type === "success";

  return (
    <div className="toast-viewport">
      <div
        key={toast.id}
        className={`toast-card ${isSuccess ? "toast-success" : "toast-error"}`}
      >
        <div
          className={`toast-icon ${isSuccess ? "toast-icon-success" : "toast-icon-error"}`}
        >
          {isSuccess ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <p className="toast-label">{isSuccess ? "Success" : "Error"}</p>
          <p className="toast-message">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    ({ type, message }: { type: ToastType; message: string }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast({
        id: Date.now(),
        type,
        message
      });

      timeoutRef.current = setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, 3000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      clearToast
    }),
    [showToast, clearToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <ToastViewport toast={toast} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
