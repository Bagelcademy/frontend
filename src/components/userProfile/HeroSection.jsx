import React from "react";
import { Edit3, Upload, Zap } from "lucide-react";
import { Button } from "../ui/button";

const HeroSection = ({ user, editMode, setEditMode, handleImageUpload, t }) => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100">
    <div className="container mx-auto px-4 py-16 pt-32">
      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user.profile_picture || "/api/placeholder/150/150"}
              alt={user.first_name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {editMode && (
              <label
                htmlFor="profile-picture"
                className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full cursor-pointer shadow-lg hover:bg-opacity-90 transition-colors"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <input
                  id="profile-picture"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
            <div className="absolute -top-2 -right-2 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5" />
              <span className="text-xs font-bold ml-1">{user.streak}</span>
            </div>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white">
            {user.first_name}
          </h1>
          <p className="text-white/80 mt-2 max-w-xl text-center">
            {user.bio || t("noBio")}
          </p>

          <Button
            onClick={() => setEditMode(!editMode)}
            className="mt-4 bg-white/20 hover:bg-white/30 text-white"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {editMode ? t("cancel") : t("editProfile")}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;
