"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coins } from "lucide-react";

interface Reward {
  id: string;
  amount: number;
  message: string;
}

interface RewardContextType {
  addReward: (amount: number, message: string) => void;
}

const RewardContext = createContext<RewardContextType | undefined>(undefined);

export function RewardProvider({ children }: { children: React.ReactNode }) {
  const [rewards, setRewards] = useState<Reward[]>([]);

  const addReward = useCallback((amount: number, message: string) => {
    const id = Math.random().toString(36).substring(7);
    setRewards((prev) => [...prev, { id, amount, message }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setRewards((prev) => prev.filter((r) => r.id !== id));
    }, 4000);
  }, []);

  return (
    <RewardContext.Provider value={{ addReward }}>
      {children}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] pointer-events-none flex flex-col items-center gap-4">
        <AnimatePresence>
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="bg-[#111a10] border-2 border-[#00ff66] rounded-2xl px-6 py-4 shadow-[0_0_40px_rgba(0,255,102,0.3)] flex items-center gap-4 pointer-events-auto overflow-hidden relative group"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff66]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="w-12 h-12 rounded-full bg-[#00ff66] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.5)]">
                <Coins className="text-[#0a0b09] w-7 h-7" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-[Bebas_Neue] text-[#00ff66] tracking-wider">
                    +{reward.amount}
                  </span>
                  <span className="text-[#00ff66] font-bold text-sm tracking-widest uppercase">
                    BB Earned!
                  </span>
                </div>
                <p className="text-[rgba(255,255,240,0.8)] text-xs font-bold tracking-tight">
                  {reward.message}
                </p>
              </div>

              {/* Shimmer Effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                initial={{
                  background:
                    "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                  x: "-100%",
                }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </RewardContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error("useRewards must be used within a RewardProvider");
  }
  return context;
}
