"use client";

import React, { useState } from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Lock, Trash2 } from "lucide-react";

export default function AccountSettingsPage() {
  const [userInfo, setUserInfo] = useState({
    name: "Pavan Kumar",
    email: "pavan@vellari.com",
    phone: "+91 98765 43210",
    dob: "1998-08-15",
    gender: "Male"
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AccountLayout>
      <div className="flex flex-col" style={{ gap: "48px" }}>
        <div>
          <span className="text-[13px] font-accent uppercase tracking-[4px] font-bold text-v-gold block" style={{ marginBottom: "8px" }}>
            ACCOUNT CONTROL
          </span>
          <h2 className="font-display font-bold text-3xl text-white">Account Settings</h2>
        </div>

        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-[18px] text-emerald-400 text-sm font-bold flex items-center"
            style={{ gap: "8px", marginBottom: "-16px" }}
          >
            <Check size={18} /> Profile details saved successfully!
          </motion.div>
        )}

        {/* Edit Personal Info Form */}
        <form onSubmit={handleSubmit} className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col" style={{ padding: "36px", gap: "32px" }}>
          <h3 className="font-display font-bold text-xl text-white">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "24px" }}>
            <div>
              <label className="text-xs font-accent uppercase tracking-wider font-bold text-white/50 block" style={{ marginBottom: "12px" }}>Full Name</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="w-full p-4 rounded-[16px] border border-white/10 bg-white/[0.03] text-sm text-white focus:outline-none focus:border-v-gold font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-accent uppercase tracking-wider font-bold text-white/50 block" style={{ marginBottom: "12px" }}>Email Address</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                className="w-full p-4 rounded-[16px] border border-white/10 bg-white/[0.03] text-sm text-white focus:outline-none focus:border-v-gold font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-accent uppercase tracking-wider font-bold text-white/50 block" style={{ marginBottom: "12px" }}>Phone Number</label>
              <input
                type="text"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                className="w-full p-4 rounded-[16px] border border-white/10 bg-white/[0.03] text-sm text-white focus:outline-none focus:border-v-gold font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-accent uppercase tracking-wider font-bold text-white/50 block" style={{ marginBottom: "12px" }}>Date of Birth (Optional)</label>
              <input
                type="date"
                value={userInfo.dob}
                onChange={(e) => setUserInfo({ ...userInfo, dob: e.target.value })}
                className="w-full p-4 rounded-[16px] border border-white/10 bg-white/[0.03] text-sm text-white focus:outline-none focus:border-v-gold font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="self-start px-8 py-4 text-xs font-accent font-bold uppercase tracking-wider bg-v-gold text-v-black rounded-[16px] hover:brightness-110 shadow-[0_4px_20px_rgba(212,150,26,0.2)] active:scale-95 transition-all mt-2"
          >
            Save Changes
          </button>
        </form>

        {/* Security Preferences */}
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col" style={{ padding: "36px", gap: "24px" }}>
          <h3 className="font-display font-bold text-xl text-white" style={{ marginBottom: "8px" }}>Security & Privacy</h3>
          
          <div className="flex items-center justify-between border-b border-white/[0.08]" style={{ paddingBottom: "24px" }}>
            <div>
              <h4 className="font-bold text-base text-white">Change Password</h4>
              <p className="text-xs text-white/50 font-light" style={{ marginTop: "4px" }}>Send a secure password reset link to your email.</p>
            </div>
            <button
              type="button"
              onClick={() => alert("Password reset email sent!")}
              className="px-5 py-2.5 text-xs font-accent uppercase font-bold bg-white/5 border border-white/10 text-white rounded-[14px] hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Reset Password
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-bold text-base text-red-400">Delete Account</h4>
              <p className="text-xs text-white/40 font-light" style={{ marginTop: "4px" }}>Permanently remove your Vellari profile and order history.</p>
            </div>
            <button
              type="button"
              onClick={() => alert("Please contact support at hello@vellari.com to request account deletion.")}
              className="px-5 py-2.5 text-xs font-accent uppercase font-bold bg-red-500/10 border border-red-500/20 text-red-400 rounded-[14px] hover:bg-red-500/20 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
