import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Bell, Clock } from 'lucide-react';

const NotificationsList = ({ notifications, t }) => (
    <Card className="border-0 bg-white dark:bg-gray-800 shadow-md">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        <CardTitle className="text-xl font-bold">
          {t('myNotifications')}
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by date (newest first)
            .map((notification, index) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-700 ${index === 0 && !notification.message_seen ? 'border-l-4 border-blue-500' : ''
                  }`}
              >
                <p className="text-gray-600 dark:text-gray-300">
                  {notification.text}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(notification.created_at).toLocaleDateString()}
                  </div>
                  {index === 0 && !notification.message_seen && ( // Only show "new" label for the first notification
                    <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                      {t('new')}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('no New Notifications')}</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default NotificationsList;
