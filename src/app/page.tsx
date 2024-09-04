"use client";

import { InteractionsTable } from "@/components/InteractionsTable";

export default function Dashboard() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recent Bot Interactions</h1>
      <InteractionsTable />
    </main>
  );
}
