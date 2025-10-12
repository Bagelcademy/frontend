import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CourseCard from "./CourseCard";

const PopularCourses = ({ courses }) => {
  const { t } = useTranslation();

  return (
    <div className=" mx-auto px-4 p-16 mt-2 mb-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-b5 text-gray-900 dark:text-white my-8 text-center">
          {t("PopularCourses")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} to={`/course/${course.id}`}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;
