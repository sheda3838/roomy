import { toast } from "sonner";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// --- ANIMATION VARIANTS ---
const successDoorVariants = {
  initial: { scaleX: 1 },
  animate: {
    scaleX: [1, 0.15, 0.15, 0.15, 1],
    transition: { duration: 3, ease: "easeInOut", times: [0, 0.15, 0.85, 1] }
  }
};
const successLightVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 1, 1, 0],
    transition: { duration: 3, ease: "easeInOut", times: [0, 0.15, 0.85, 1] }
  }
};

const errorDoorVariants = {
  initial: { scaleX: 0.15 },
  animate: {
    scaleX: [0.15, 1, 1, 1, 0.15],
    transition: { duration: 3, ease: "easeInOut", times: [0, 0.15, 0.85, 1] }
  }
};
const errorShakeVariants = {
  initial: { x: 0 },
  animate: {
    x: [0, -3, 3, -3, 3, 0],
    transition: { duration: 0.4, delay: 0.2 }
  }
};

const infoPulseVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.2, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// --- TOAST COMPONENTS ---
const BaseToast = ({ t, children, title, message }: { t: string | number, children: React.ReactNode, title: string, message?: string }) => (
  <div className="flex items-start gap-4 p-4 w-[360px] bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl pointer-events-auto">
    <div className="shrink-0 pt-0.5">
      {children}
    </div>
    <div className="flex-1 min-w-0 pr-2">
      <h3 className="text-[13px] font-bold text-slate-900 leading-tight">{title}</h3>
      {message && <p className="text-[11px] font-medium text-slate-500 mt-1 leading-snug break-words">{message}</p>}
    </div>
    <button 
      onClick={() => toast.dismiss(t)} 
      className="shrink-0 p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

// --- EXPORTED UTILITIES ---
export function showSuccessToast(title: string, message?: string) {
  toast.custom((t) => (
    <BaseToast t={t} title={title} message={message}>
      <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-[rgb(34,142,222)]/10 border border-[rgb(34,142,222)]/20 overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-6 h-6 absolute overflow-visible drop-shadow-sm">
          <defs>
            <linearGradient id="toastLight" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(248,150,60)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(248,150,60)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="toastDoor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(46,219,244)" />
              <stop offset="100%" stopColor="rgb(29,93,185)" />
            </linearGradient>
          </defs>
          <path d="M 65 80 L 65 20 L 85 20 L 85 80" fill="none" stroke="rgb(203,213,225)" strokeWidth="4" />
          <motion.path 
            d="M 65 80 L 15 80 L 25 35 L 65 20 Z" 
            fill="url(#toastLight)" 
            style={{ transformOrigin: "65px 80px" }}
            variants={successLightVariants}
            initial="initial"
            animate="animate"
          />
          <motion.rect 
            x="66" y="22" width="18" height="56" fill="url(#toastDoor)" rx="2" 
            style={{ transformOrigin: "84px 50px" }}
            variants={successDoorVariants}
            initial="initial"
            animate="animate"
          />
        </svg>
      </div>
    </BaseToast>
  ), { duration: 5000 });
}

export function showErrorToast(title: string, message?: string) {
  toast.custom((t) => (
    <BaseToast t={t} title={title} message={message}>
      <motion.div 
        className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-orange-50 border border-orange-200 overflow-hidden"
        variants={errorShakeVariants}
        initial="initial"
        animate="animate"
      >
        <svg viewBox="0 0 100 100" className="w-6 h-6 absolute overflow-visible">
          <path d="M 65 80 L 65 20 L 85 20 L 85 80" fill="none" stroke="rgb(203,213,225)" strokeWidth="4" />
          <motion.rect 
            x="66" y="22" width="18" height="56" fill="rgb(246,137,83)" rx="2" 
            style={{ transformOrigin: "84px 50px" }}
            variants={errorDoorVariants}
            initial="initial"
            animate="animate"
          />
        </svg>
      </motion.div>
    </BaseToast>
  ), { duration: 6000 });
}

export function showInfoToast(title: string, message?: string) {
  toast.custom((t) => (
    <BaseToast t={t} title={title} message={message}>
      <motion.div 
        className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200"
        variants={infoPulseVariants}
        initial="initial"
        animate="animate"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[rgb(34,142,222)] shadow-[0_0_12px_rgba(34,142,222,0.6)] animate-pulse" />
      </motion.div>
    </BaseToast>
  ), { duration: 5000 });
}
