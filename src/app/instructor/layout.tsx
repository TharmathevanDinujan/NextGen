"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="instructor">
      {children}
    </ProtectedRoute>
  );
}

