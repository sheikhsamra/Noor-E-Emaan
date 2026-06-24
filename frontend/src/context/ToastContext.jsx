import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let nextId = 0;

const CONFIG = {
  success: {
    bg:     'bg-gradient-to-r from-[#3F312B] to-[#5C3D2A]',
    border: 'border-[#C9A646]/40',
    icon:   '✓',
    iconBg: 'bg-[#C9A646]',
  },
  error: {
    bg:     'bg-gradient-to-r from-[#5C1A1A] to-[#7B2020]',
    border: 'border-red-300/30',
    icon:   '✕',
    iconBg: 'bg-red-400',
  },
  info: {
    bg:     'bg-gradient-to-r from-[#27211E] to-[#3F312B]',
    border: 'border-[#8A5A44]/40',
    icon:   'ℹ',
    iconBg: 'bg-[#8A5A44]',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800);
  }, []);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-[340px] pointer-events-none">
        {toasts.map(t => {
          const c = CONFIG[t.type] ?? CONFIG.info;
          return (
            <div
              key={t.id}
              className={`
                ${c.bg} ${c.border}
                animate-toast-in pointer-events-auto
                flex items-center gap-3.5
                px-4 py-3.5 rounded-2xl
                border shadow-[0_8px_32px_rgba(0,0,0,0.22)]
                backdrop-blur-sm
              `}
            >
              {/* icon circle */}
              <span className={`${c.iconBg} h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-md animate-toast-icon`}>
                {c.icon}
              </span>

              {/* message */}
              <p className="text-white text-sm font-semibold flex-1 leading-snug">{t.message}</p>

              {/* dismiss */}
              <button
                onClick={() => dismiss(t.id)}
                className="text-white/50 hover:text-white text-base leading-none flex-shrink-0 transition-colors ml-1"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
