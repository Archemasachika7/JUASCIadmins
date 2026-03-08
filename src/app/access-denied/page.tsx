"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="font-heading text-3xl font-bold text-red-400 mb-2">
          Access Denied
        </h1>
        <p className="text-text/50 mb-8 max-w-md">
          Your account does not have admin privileges. Contact an administrator
          if you believe this is an error.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-orbit-blue text-white rounded-lg text-sm font-medium hover:bg-orbit-blue/90 transition-colors"
        >
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
