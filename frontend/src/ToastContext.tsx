import React from "react";

const TOAST_HIDE_TIMEOUT = 3000;

export enum ToastType {
  Success = "alert-success",
  Error = "alert-error",
  Warning = "alert-warning",
  Info = "alert-info",
}

export interface ToastInterface {
  message: string;
  type: ToastType;
}

interface ToastContextInterface {
  addToast(toast: ToastInterface): void;
}

const ToastContext = React.createContext<ToastContextInterface>({
  addToast: (t) => {
    console.error("empty toast context");
  },
});

function Toast({
  toast,
  toastId,
  onDismiss,
}: {
  toast: ToastInterface;
  toastId: number;
  onDismiss: (toastId: number) => void;
}) {
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    const hideTimeout = setTimeout(() => {
      setShow(false);
    }, TOAST_HIDE_TIMEOUT);

    return () => {
      clearTimeout(hideTimeout);
    };
  }, [toastId]);

  return (
    <div
      className={
        `alert ${toast.type} transition-opacity` + (show ? "" : " opacity-0")
      }
      onTransitionEnd={() => onDismiss(toastId)}
    >
      <div>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

var numToasts = 0;

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<
    (ToastInterface & { toastId: number })[]
  >([]);

  const addToast = (toast: ToastInterface) => {
    setToasts([{ ...toast, toastId: numToasts }, ...toasts]);
    numToasts++;
  };

  const onDismiss = (toastId: number) => {
    setToasts(toasts.filter((t) => t.toastId !== toastId));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast">
        {toasts.map((toast) => (
          <Toast
            key={toast.toastId}
            toastId={toast.toastId}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => React.useContext(ToastContext);
