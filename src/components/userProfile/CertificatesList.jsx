import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Award } from "lucide-react";

const CertificatesList = ({ notifications, t }) => {
  const certificates = notifications
    .slice()
    .reverse() // حذفش کن اگه می‌خوای جدیدترین بالا باشه
    .map((notif) => {
      const urlMatch = notif.text.match(
        /https:\/\/api\.tadrisino\.org\/[^\s]+/
      );
      if (!urlMatch) return null;

      return {
        title: "Certificate", // عنوان ثابت برای گواهینامه‌ها
        url: urlMatch[0],
      };
    })
    .filter(Boolean);

  if (certificates.length === 0) return null;

  return (
    <Card className="shadow-md border border-gray-200 bg-white dark:bg-gray-800 mb-4">
      <CardHeader className="flex items-center gap-2">
        <CardTitle>
          <div className="flex items-center gap-2 mt-3">
            <Award className="text-yellow-500 w-8 h-8" /> {/* بزرگ‌تر شد */}
            <span className="mt-1">{t("Certificates")}</span>{" "}
            {/* کمی پایین‌تر */}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 bg-black">
        {certificates.map((cert, index) => (
          <div key={index} className="flex flex-col">
            <span className="font-semibold text-black dark:text-white">
              {`${t(cert.title)} ${index + 1}`}
            </span>
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900 dark:text-indigo-300 hover:underline break-words max-w-full overflow-hidden"
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
