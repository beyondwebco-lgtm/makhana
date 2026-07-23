"use client";

import React, { useState } from "react";
import AccountLayout from "@/components/account/AccountLayout";
import { motion } from "framer-motion";
import { MapPin, Plus, Check, Trash2 } from "lucide-react";

const INITIAL_ADDRESSES = [
  {
    id: "addr-1",
    tag: "Home",
    isDefault: true,
    fullName: "Pavan Kumar",
    phone: "+91 98765 43210",
    street: "Flat 402, Royal Palms Apartments, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033"
  },
  {
    id: "addr-2",
    tag: "Office",
    isDefault: false,
    fullName: "Pavan Kumar (Work)",
    phone: "+91 98765 43210",
    street: "Level 8, Cyber Towers, Hitec City",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081"
  }
];

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    tag: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.street) return;
    const created = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, created]);
    setNewAddr({ tag: "Home", fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <AccountLayout>
      <div className="flex flex-col" style={{ gap: "48px" }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[13px] font-accent uppercase tracking-[4px] font-bold text-v-gold block" style={{ marginBottom: "8px" }}>
              DELIVERY LOCATIONS
            </span>
            <h2 className="font-display font-bold text-3xl text-white">Saved Addresses</h2>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-5 py-3 text-xs font-accent font-bold uppercase tracking-wider bg-v-gold text-v-black rounded-[16px] flex items-center gap-2 hover:brightness-110 shadow-[0_4px_20px_rgba(212,150,26,0.2)] active:scale-95 transition-all"
          >
            <Plus size={16} />
            Add New Address
          </button>
        </div>

        {/* Add Address Inline Form */}
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddSubmit}
            className="bg-[#111111]/90 border border-v-gold/40 rounded-[24px] shadow-xl flex flex-col"
            style={{ padding: "36px", gap: "16px" }}
          >
            <h3 className="font-bold text-base text-white">Add New Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px" }}>
              <input
                type="text"
                placeholder="Full Name"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="p-3.5 rounded-[14px] border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-v-gold"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="p-3.5 rounded-[14px] border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-v-gold"
                required
              />
              <input
                type="text"
                placeholder="Street / Flat / Apartment"
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="sm:col-span-2 p-3.5 rounded-[14px] border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-v-gold"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="p-3.5 rounded-[14px] border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-v-gold"
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                className="p-3.5 rounded-[14px] border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-v-gold"
                required
              />
            </div>
            <div className="flex justify-end mt-2" style={{ gap: "12px" }}>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 text-xs font-accent uppercase font-bold text-white/50 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-accent uppercase font-bold bg-v-gold text-v-black rounded-[14px]"
              >
                Save Address
              </button>
            </div>
          </motion.form>
        )}

        {/* Address Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "24px" }}>
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`bg-[#111111]/80 backdrop-blur-xl border rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between ${
                addr.isDefault ? "border-v-gold shadow-[0_0_30px_rgba(212,150,26,0.12)]" : "border-white/[0.08]"
              }`}
              style={{ padding: "36px" }}
            >
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
                  <span className="px-3.5 py-1 rounded-full bg-v-gold/10 border border-v-gold/30 text-v-gold font-accent text-[11px] font-bold uppercase tracking-wider">
                    {addr.tag}
                  </span>
                  {addr.isDefault && (
                    <span className="text-xs font-bold uppercase tracking-wider text-v-gold flex items-center gap-1">
                      <Check size={14} /> Default Address
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-base text-white" style={{ marginBottom: "8px" }}>{addr.fullName}</h4>
                <p className="text-xs text-white/60 font-light leading-relaxed" style={{ marginBottom: "12px" }}>
                  {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-xs text-white/40">Phone: {addr.phone}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] text-xs font-accent font-bold uppercase tracking-wider" style={{ marginTop: "32px", paddingTop: "24px" }}>
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-v-gold hover:underline"
                  >
                    Set as Default
                  </button>
                ) : <span />}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}
