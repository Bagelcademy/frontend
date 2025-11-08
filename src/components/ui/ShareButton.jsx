import { useState } from "react";
import { Share2, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const ShareButton = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check this out!",
      url: window.location.href,
    };

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Shared successfully!");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <button
        onClick={handleShare}
        className="flex items-center px-3 py-3 rounded-lg text-sm font-semibold text-white bg-gray-500 hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        {copied ? (
          <>
            <ClipboardCheck className="w-5 h-5 mx-2" />
            {t("Copied!")}
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5 mx-2" />
            {t("Share")}
          </>
        )}
      </button>
    </div>
  );
};

export default ShareButton;
