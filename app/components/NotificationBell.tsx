"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase/client";

export default function NotificationBell() {
  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
        ) {
        setOpen(false);
        }
    }

    if (open) {
        document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, [open]);

  async function fetchNotifications() {
    const { data: userData } =
      await supabase.auth.getUser();

    const email = userData?.user?.email;

    const unreadCount = notifications.filter(
     (n) => n.is_read === false
    ).length;

    if (!email) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false });

    setNotifications(data || []);
  }

  async function markAsRead() {
    const { data: userData } =
        await supabase.auth.getUser();

    const email = userData?.user?.email;

    if (!email) return;

    await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_email", email)
        .eq("is_read", false);

    fetchNotifications();
    }

  const [selectedNotification, setSelectedNotification] =
  useState<any | null>(null);

  const unreadCount = notifications.filter(
     (n) => n.is_read === false
    ).length;

  return (
    <div className="relative">
      <button
        onClick={() => {
        setOpen(!open);

        if (!open) {
            markAsRead();
        }
        }}
        className="relative"
      >
        <Bell size={24} />

        {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
            </span>
        )}
      </button>

      {open && (
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-80 bg-[#1c1e21] border border-gray-700 rounded-2xl shadow-xl z-50"
        >
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-bold">
              Notifications
            </h2>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-400">
                No notifications
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                    key={notif.id}
                    onClick={() => setSelectedNotification(notif)}
                    className="p-4 border-b border-gray-800 hover:bg-[#2a2d31] cursor-pointer"
                    >
                    <p className="text-sm">
                        {notif.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(
                        notif.created_at
                        ).toLocaleString()}
                    </p>
                </div>
              ))
            )}
            {selectedNotification && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
                    
                    <div className="bg-[#1c1e21] w-[90%] max-w-md p-6 rounded-2xl shadow-xl relative">

                    {/* CLOSE BUTTON */}
                    <button
                        onClick={() => setSelectedNotification(null)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>

                    {/* CONTENT */}
                    <h2 className="text-lg font-bold mb-3">
                        Notification
                    </h2>

                    <p className="text-white text-sm leading-relaxed">
                        {selectedNotification.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-4">
                        {new Date(
                        selectedNotification.created_at
                        ).toLocaleString()}
                    </p>

                    </div>

                </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
}