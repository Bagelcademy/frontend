import React, { useState } from 'react';
// import { useRouter } from 'next/router';
import { Link, useNavigate } from 'react-router-dom';

const CourseCreationPage = () => {
//   const router = useRouter();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    duration: '',
    prerequisites: '',
    learningOutcomes: '',
    thumbnail: null,
    previewVideo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCourseData({ ...courseData, [name]: files[0] });
  };

  const handleLearningOutcomes = (e) => {
    setCourseData({ ...courseData, learningOutcomes: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would send data to your backend
      // const response = await fetch('/api/courses', {
      //   method: 'POST',
      //   body: JSON.stringify(courseData),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      
      // Navigate to lesson creation page for this course
      const mockCourseId = '123'; // In production, this would come from your API response
      navigate(`/courses/${mockCourseId}/lessons/create`);
    } catch (error) {
      console.error('Error creating course:', error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create a New Course</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to set up your course. You'll add individual lessons in the next step.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">Course Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={courseData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">Course Description</label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
              <select
                id="category"
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="science">Science</option>
                <option value="language">Language</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-1">Difficulty Level</label>
              <select
                id="level"
                name="level"
                value={courseData.level}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all-levels">All Levels</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="duration" className="block text-sm font-medium mb-1">Estimated Duration (hours)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={courseData.duration}
              onChange={handleInputChange}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Course Details</h2>
          
          <div className="mb-4">
            <label htmlFor="prerequisites" className="block text-sm font-medium mb-1">Prerequisites</label>
            <textarea
              id="prerequisites"
              name="prerequisites"
              value={courseData.prerequisites}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="List any knowledge or skills students should have before taking this course"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="learningOutcomes" className="block text-sm font-medium mb-1">Learning Outcomes</label>
            <textarea
              id="learningOutcomes"
              name="learningOutcomes"
              value={courseData.learningOutcomes}
              onChange={handleLearningOutcomes}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="What will students be able to do after completing this course? Enter each outcome on a new line."
            />
            <p className="text-sm text-gray-500 mt-1">Enter each learning outcome on a new line</p>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Course Media</h2>
          
          <div className="mb-4">
            <label htmlFor="thumbnail" className="block text-sm font-medium mb-1">Course Thumbnail</label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">Recommended size: 1280x720 pixels (16:9 ratio)</p>
          </div>
          
          <div>
            <label htmlFor="previewVideo" className="block text-sm font-medium mb-1">Preview Video (optional)</label>
            <input
              type="file"
              id="previewVideo"
              name="previewVideo"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">A short preview video to showcase your course</p>
          </div>
        </div>

        {/* Submission */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            // onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : "Create Course & Add Lessons"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreationPage;