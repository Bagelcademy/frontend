import {
  Flame,
  Mail,
  Calendar,
  Edit3,
  Upload,
  Bell,
  Trophy,
  Target,
  CircleSlash,
  Gift,
  CreditCard,
  Clock,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";

import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Notiflix from "notiflix";

import HeroSection from "../components/userProfile/HeroSection";
import StatsGrid from "../components/userProfile/StatsGrid";
import ProfileDetails from "../components/userProfile/ProfileDetails";
import NotificationsList from "../components/userProfile/NotificationsList";
import CertificatesList from "../components/userProfile/CertificatesList";

const UserProfilePage = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [birthDate, setBirthDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  Notiflix.Notify.init({
    width: "280px",
    position: "right-top",
    distance: "10px",
    opacity: 0.9,
    fontSize: "20px",
    borderRadius: "5px",
  });

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, t("invalidName"))
      .max(40, t("nameTooLong")),
    birthDay: Yup.number().min(1, t("invalidDay")).max(31, t("invalidDay")),
    birthMonth: Yup.number()
      .min(1, t("invalidMonth"))
      .max(12, t("invalidMonth")),
    birthYear: Yup.number()
      .min(1330, t("invalidYear"))
      .max(1390, t("invalidYear")),
    national_code: Yup.string().matches(
      /^[0-9]{10}$/,
      t("invalidNationalCode")
    ),
  });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [userResponse, notificationsResponse] = await Promise.all([
        fetch("https://api.tadrisino.org/account/user-info/", { headers }),
        fetch("https://api.tadrisino.org/account/NotifyUser/", { headers }),
      ]);

      if (!userResponse.ok || !notificationsResponse.ok) {
        throw new Error(t("fetchError"));
      }

      const userData = await userResponse.json();
      const notificationsData = await notificationsResponse.json();

      // Parse birthdate into separate fields
      if (userData.birthdate) {
        const [year, month, day] = userData.birthdate.split("-");
        setBirthDate({
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year),
        });
      }

      setUser(userData);
      setBio(userData.bio || "");
      setNotifications(notificationsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [t]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      Notiflix.Notify.failure(t("fileTooLarge"));
      return;
    }

    try {
      Notiflix.Notify.info(t("uploadInProgress"));

      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("image", file);

      const filePreview = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, profile_picture: filePreview }));

      const uploadResponse = await fetch(
        "https://api.tadrisino.org/account/MyImage/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error(t("uploadProfilePicError"));
      }

      const uploadData = await uploadResponse.json();

      const updateProfileResponse = await fetch(
        "https://api.tadrisino.org/account/profile/update_profile/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...user,
            pic_url: uploadData.image,
          }),
        }
      );

      if (!updateProfileResponse.ok) {
        throw new Error(t("updateProfileError"));
      }

      const updatedUserData = await updateProfileResponse.json();
      setUser((prev) => ({
        ...prev,
        profile_picture: updatedUserData.profile_picture || uploadData.image,
      }));

      Notiflix.Notify.success(t("profilePictureUpdated"));
    } catch (err) {
      setError(err.message);
      Notiflix.Notify.failure(err.message);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    // Only validate if the field has a value
    if (value.trim() !== "") {
      try {
        await validationSchema.validateAt(name, { [name]: value });
        setValidationErrors((prev) => ({ ...prev, [name]: null }));
      } catch (err) {
        setValidationErrors((prev) => ({ ...prev, [name]: err.message }));
      }
    } else {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBirthDateChange = (field) => (e) => {
    const value = e.target.value;

    setBirthDate((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update the main user object with the combined date
    const updatedBirthDate = {
      ...birthDate,
      [field]: value,
    };

    if (
      updatedBirthDate.day &&
      updatedBirthDate.month &&
      updatedBirthDate.year
    ) {
      const formattedDate = `${updatedBirthDate.year}-${String(
        updatedBirthDate.month
      ).padStart(2, "0")}-${String(updatedBirthDate.day).padStart(2, "0")}`;

      setUser((prev) => ({
        ...prev,
        birthdate: formattedDate,
      }));
    }

    // Only validate if the field has a value
    if (value.trim() !== "") {
      try {
        validationSchema.validateAt(
          `birth${field.charAt(0).toUpperCase() + field.slice(1)}`,
          { [`birth${field.charAt(0).toUpperCase() + field.slice(1)}`]: value }
        );
        setValidationErrors((prev) => ({ ...prev, [field]: null }));
      } catch (err) {
        setValidationErrors((prev) => ({ ...prev, [field]: err.message }));
      }
    } else {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleBioChange = (e) => setBio(e.target.value);

  const handleSave = async () => {
    try {
      // Only validate fields that have values
      const fieldsToValidate = {};

      if (user.first_name && user.first_name.trim() !== "") {
        fieldsToValidate.first_name = user.first_name;
      }

      if (birthDate.day && birthDate.day.toString().trim() !== "") {
        fieldsToValidate.birthDay = birthDate.day;
      }

      if (birthDate.month && birthDate.month.toString().trim() !== "") {
        fieldsToValidate.birthMonth = birthDate.month;
      }

      if (birthDate.year && birthDate.year.toString().trim() !== "") {
        fieldsToValidate.birthYear = birthDate.year;
      }

      if (user.national_code && user.national_code.trim() !== "") {
        fieldsToValidate.national_code = user.national_code;
      }

      // Only validate if there are fields to validate
      if (Object.keys(fieldsToValidate).length > 0) {
        await validationSchema.validate(fieldsToValidate, {
          abortEarly: false,
        });
      }

      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://api.tadrisino.org/account/profile/update_profile/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...user,
            bio,
            pic_url: user.profile_picture,
          }),
        }
      );

      const updatedUserData = await response.json();

      if (!response.ok) {
        throw new Error(t("updateProfileError"));
      }

      setUser({ ...user, ...updatedUserData });
      setEditMode(false);
      Notiflix.Notify.success(t("profileUpdated"));

      // Refresh data after successful update
      await fetchUserData();
    } catch (err) {
      if (err.name === "ValidationError") {
        err.inner.forEach((error) => {
          Notiflix.Notify.failure(error.message);
        });
      } else {
        setError(err.message);
        Notiflix.Notify.failure(err.message);
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!user)
    return (
      <div className="text-center p-4 text-gray-500">{t("noUserData")}</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection
        user={user}
        editMode={editMode}
        setEditMode={setEditMode}
        handleImageUpload={handleImageUpload}
        t={t}
      />

      <div className="container mx-auto px-4 -mt-12 space-y-6 pb-12 max-w-4xl">
        {/* Stats Grid */}
        <StatsGrid user={user} t={t} />

        {/* Profile Details */}

        <ProfileDetails
          user={user}
          editMode={editMode}
          t={t}
          validationErrors={validationErrors}
          birthDate={birthDate}
          handleInputChange={handleInputChange}
          handleBirthDateChange={handleBirthDateChange}
          handleBioChange={handleBioChange}
          handleSave={handleSave}
          bio={bio}
        />

       
        {/* بالای JSX یا انتهای صفحه */}
        <CertificatesList notifications={notifications} t={t} />
         {/* Notifications */}
         <NotificationsList notifications={notifications} t={t} />
      </div>
    </div>
  );
};

export default UserProfilePage;
