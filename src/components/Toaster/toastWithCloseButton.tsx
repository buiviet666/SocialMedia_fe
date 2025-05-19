import { toast, ToastOptions } from 'react-hot-toast';

export function toastWithCloseButton(
  message: string,
  options?: ToastOptions
) {
  return toast((t) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    }}>
      <span>{message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        ✖
      </button>
    </div>
  ), options);
}
