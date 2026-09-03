import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";
import { cx } from "../utils/helpers";

export function Modal({ children, onClose, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className={cx("modal-panel", wide && "modal-wide")}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function DeleteConfirmModal({ label, onCancel, onConfirm, loading }) {
  return (
    <Modal onClose={onCancel}>
      <div className="confirm-modal">
        <div className="confirm-icon">
          <Trash2 size={22} />
        </div>
        <h3>Delete {label}?</h3>
        <p>This can't be undone. It will be removed from MAIVEN for good.</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 size={16} className="maiven-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
