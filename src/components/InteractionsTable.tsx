"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Interaction {
  _id: string;
  type: string;
  user: string;
  timestamp: string;
}

export function InteractionsTable() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    fetch("/api/interactions")
      .then((res) => res.json())
      .then((data) => setInteractions(data))
      .catch((err) => console.error("Error fetching interactions:", err));
  }, []);

  return (
    <Table>
      <TableCaption>A list of recent bot interactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interactions.map((interaction) => (
          <TableRow key={interaction._id}>
            <TableCell className="font-medium">{interaction.type}</TableCell>
            <TableCell>{interaction.user}</TableCell>
            <TableCell>
              {new Date(interaction.timestamp).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
