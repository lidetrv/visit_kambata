// app/routes/admin/MessageSection.tsx
import React from "react";
import MessageCard from "./MessageCard";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

// Define the Message type locally or import from appwrite
interface Message {
  $id: string;
  name: string;
  email: string;
  message: string;
  $createdAt: string;
  createdAt?: string;
}

interface MessageSectionProps {
  messages: Message[];
  title?: string;
  totalMessages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function MessageSection({
  messages = [],
  title = "Recent Messages",
  totalMessages = 0,
  currentPage = 1,
  onPageChange,
}: MessageSectionProps) {
  return (
    <section className="container mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-dark-100">{title}</h1>
        <span className="text-sm text-gray-500">
          {totalMessages > 0 ? totalMessages : messages?.length || 0} message
          {(totalMessages > 0 ? totalMessages : messages?.length || 0) !== 1
            ? "s"
            : ""}
        </span>
      </div>

      <div className="space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <MessageCard
              key={msg.$id}
              name={msg.name}
              email={msg.email}
              message={msg.message}
              date={msg.$createdAt || msg.createdAt || ""}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm mt-2">
              Messages from the contact form will appear here
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls - SAME spacing as BlogContent */}
      {totalMessages > 5 && onPageChange && (
        <PagerComponent
          totalRecordsCount={totalMessages}
          pageSize={5}
          currentPage={currentPage}
          click={(args) => onPageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      )}
    </section>
  );
}
