'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase/client'
import { useAuth } from '@/app/contexts/authContext'

export default function NotificationsPage() {
  const { user } = useAuth()

  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  async function fetchNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', {
        ascending: false,
      })

    setNotifications(data || [])
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 && (
        <p>No notifications yet</p>
      )}

      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="border p-4 rounded mb-4"
        >
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  )
}