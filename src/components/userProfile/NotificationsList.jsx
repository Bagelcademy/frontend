import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Bell, Clock, CheckCircle } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const NotificationsList = ({ t }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken"); // گرفتن توکن ذخیره شده

  // 📌 گرفتن لیست اعلان‌ها
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "https://api.tadrisino.org/account/NotifyUser/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📌 علامت‌گذاری اعلان به عنوان خوانده‌شده
  const markAsRead = async (notif_id) => {
    try {
      await axios.post(
        "https://api.tadrisino.org/account/NotifyUser/seenMsg/",
        { notif_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev
          .map((n) => (n.id === notif_id ? { ...n, message_seen: true } : n))
          .sort((a, b) => {
            // ابتدا اعلان‌های نخوانده، بعد خوانده‌شده
            if (a.message_seen === b.message_seen) {
              return new Date(b.created_at) - new Date(a.created_at); // جدیدترین اول
            }
            return a.message_seen ? 1 : -1; // خوانده شده پایین‌تر
          })
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <Card className="border-0 bg-white dark:bg-gray-800 shadow-md p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t("loading")}...</p>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white dark:bg-gray-800 shadow-md h-96 overflow-y-auto">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-2">
  <div className="flex items-center gap-2">
    <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 relative top-[1px]" />
    <span className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-none">
      {t("myNotifications")}
    </span>
  </div>
</CardHeader>



      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications
              .slice() // کپی از آرایه اصلی
              .sort((a, b) => {
                if (a.message_seen === b.message_seen) {
                  return new Date(b.created_at) - new Date(a.created_at);
                }
                return a.message_seen ? 1 : -1;
              })
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg flex flex-col gap-2 ${
                    notification.message_seen
                      ? "bg-gray-50 dark:bg-gray-700"
                      : "bg-blue-50 dark:bg-indigo-900 border-l-4 border-blue-500"
                  }`}
                >
            <div className="flex justify-between items-center">
  <p className="text-gray-700 dark:text-gray-200 inline-block">
    {notification.text}
  </p>
  {notification.message_seen && (
    <span className="inline-block self-start text-gray-500 dark:text-gray-400 text-xs">
      {t("read")}
    </span>
  )}
</div>


                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(notification.created_at).toLocaleDateString()}
                    </div>
                    {!notification.message_seen && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs font-medium"

                      >
                        <CheckCircle className="w-4 h-4" /> {t("markAsRead")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t("noNewNotifications")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsList;

  
  
  
  