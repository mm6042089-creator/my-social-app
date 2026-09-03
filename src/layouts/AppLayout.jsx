import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import MobileTabBar from "../components/MobileTabBar";
import { DeleteConfirmModal } from "../components/Modal";

export default function AppLayout() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); 
  const [deleteLoading, setDeleteLoading] = useState(false);
  function requestDelete(label, onConfirm) {
    setPendingDelete({ label, onConfirm });
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleteLoading(true);
    try {
      await pendingDelete.onConfirm();
    } catch {
    } finally {
      setDeleteLoading(false);
      setPendingDelete(null);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileNavOpen} closeMobile={() => setMobileNavOpen(false)} />
      <div className="app-main">
        <TopBar onMenu={() => setMobileNavOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="app-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet context={{ requestDelete }} />
          </motion.div>
        </AnimatePresence>
      </div>

      <MobileTabBar />

      {pendingDelete && (
        <DeleteConfirmModal
          label={pendingDelete.label}
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
