import React from "react";
import { getAllMessagesForAdmin } from "@/lib/supabase/projects";
import { MessagesClient } from "./messages-client";

export default async function AdminMessagesPage() {
  const messages = await getAllMessagesForAdmin();

  return <MessagesClient initialMessages={messages} />;
}
