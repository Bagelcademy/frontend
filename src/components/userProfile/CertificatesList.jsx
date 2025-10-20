import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Award } from "lucide-react";

const CertificatesList = ({ notifications, t }) => {
  const certificates = notifications
    .slice()
    .reverse() // حذفش کن اگه می‌خوای جدیدترین بالا باشه
    .map((notif) => {
      const urlMatch = notif.text.match(/https:\/\/api\.tadrisino\.org\/[^\s]+/);
      if (!urlMatch) return null;

      return {
        title: "Certificate", // عنوان ثابت برای گواهینامه‌ها
        url: urlMatch[0],
      };
    })
    .filter(Boolean);

  if (certificates.length === 0) return null;

  return (
    <Card className="shadow-md border border-gray-200 dark:border-gray-700 mb-4">
      <CardHeader className="flex items-center gap-2">
        <Award className="text-yellow-500" />
        {/* عنوان اصلی کارت از فایل ترجمه */}
        <CardTitle>{t("Certificates")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {certificates.map((cert, index) => (
          <div key={index} className="flex flex-col">
            <span className="font-semibold text-black dark:text-white">
              {`${t(cert.title)} ${index + 1}`} {/* ترجمه عنوان "Certificate" */}
            </span>
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {cert.url}
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CertificatesList;
