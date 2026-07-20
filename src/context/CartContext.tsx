"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products } from "@/data/products";

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  flavor: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem("vellari_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("vellari_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (slug: string, quantity: number) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.slug === slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === slug
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          slug,
          name: product.name,
          price: product.price,
          image: product.image,
          flavor: product.flavor,
          quantity,
        },
      ];
    });

    // Fire custom event to animate cart icon
    window.dispatchEvent(new CustomEvent("cart-item-added"));
  };

  const removeFromCart = (slug: string) => {
    setCart((prev) => prev.filter((item) => item.slug !== slug));
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.slug === slug ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 40; // Free shipping over 500
  const tax = Math.round(subtotal * 0.05); // 5% GST/tax
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shipping,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cart: [],
      addToCart: (_slug: string, _qty: number) => {},
      removeFromCart: (_slug: string) => {},
      updateQuantity: (_slug: string, _qty: number) => {},
      clearCart: () => {},
      cartCount: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    };
  }
  return context;
}
