import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

const StepDate = ({ title, value, onChange, onNext, t }) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-");
      setDay(d);
      setMonth(m);
      setYear(y);
    }
  }, [value]);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    if (field === "day") setDay(val);
    if (field === "month") setMonth(val);
    if (field === "year") setYear(val);

    const newDay = field === "day" ? val : day;
    const newMonth = field === "month" ? val : month;
    const newYear = field === "year" ? val : year;

    if (newDay && newMonth && newYear) {
      onChange(
        `${newYear}-${String(newMonth).padStart(2, "0")}-${String(
          newDay
        ).padStart(2, "0")}`
      );
    } else {
      onChange("");
    }
  };

  const canProceed = day && month && year;

  return (
    <div className="mb-6 w-full max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <Calendar size={24} className="text-blue-500 mr-2" />
        <label className="text-lg font-medium">{title}</label>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <select value={day} onChange={handleChange("day")} className="...">
          <option value="">{t ? t("day") : "روز"}</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <option key={d} value={String(d).padStart(2, "0")}>
              {d}
            </option>
          ))}
        </select>

        <select value={month} onChange={handleChange("month")} className="...">
          <option value="">{t ? t("month") : "ماه"}</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={String(m).padStart(2, "0")}>
              {m}
            </option>
          ))}
        </select>

        <select value={year} onChange={handleChange("year")} className="...">
          <option value="">{t ? t("year") : "سال"}</option>
          {Array.from({ length: 61 }, (_, i) => 1330 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`mt-4 w-full p-3 rounded-lg font-medium transition-all ${
          canProceed
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg"
            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        }`}
      >
        {t ? t("Continue") : "ادامه"}
      </button>
    </div>
  );
};

export default StepDate;
