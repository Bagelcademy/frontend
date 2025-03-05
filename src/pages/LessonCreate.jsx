import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

const LessonCreationPage = () => {
//   const router = useRouter();
//   const { courseId } = router.query;
  const { courseId } = 2;
const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    type: 'video',
    videoUrl: '',
    duration: '',
    content: '',
    attachments: [],
    quizQuestions: [],
  });

  // Fetch course information when component mounts
  useEffect(() => {
    if (courseId) {
      fetchCourseInfo();
    }
  }, [courseId]);

  const fetchCourseInfo = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to get course details
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock course data
      setCourseInfo({
        id: courseId,
        title: "Introduction to Web Development",
        description: "Learn the fundamentals of web development",
      });
      
      // Mock existing lessons (if any)
      setLessons([]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching course info:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData({ ...lessonData, [name]: value });
    setUnsavedChanges(true);
  };

  const handleContentChange = (e) => {
    setLessonData({ ...lessonData, content: e.target.value });
    setUnsavedChanges(true);
  };

  const handleLessonTypeChange = (e) => {
    setLessonData({ 
      ...lessonData, 
      type: e.target.value,
      // Reset content based on type
      videoUrl: e.target.value === 'video' ? lessonData.videoUrl : '',
      content: e.target.value === 'reading' ? lessonData.content : '',
      quizQuestions: e.target.value === 'quiz' ? lessonData.quizQuestions : [],
    });
    setUnsavedChanges(true);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setLessonData({
      ...lessonData,
      attachments: [...lessonData.attachments, ...files],
    });
    setUnsavedChanges(true);
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...lessonData.attachments];
    updatedAttachments.splice(index, 1);
    setLessonData({ ...lessonData, attachments: updatedAttachments });
    setUnsavedChanges(true);
  };

  // Add a new quiz question
  const addQuizQuestion = () => {
    setLessonData({
      ...lessonData,
      quizQuestions: [
        ...lessonData.quizQuestions,
        {
          question: '',
          options: ['', '', '', ''],
          correctOption: 0,
        },
      ],
    });
    setUnsavedChanges(true);
  };

  // Update a quiz question
  const updateQuizQuestion = (index, field, value) => {
    const updatedQuestions = [...lessonData.quizQuestions];
    
    if (field === 'option') {
      const [optionIndex, optionValue] = value;
      updatedQuestions[index].options[optionIndex] = optionValue;
    } else if (field === 'correctOption') {
      updatedQuestions[index].correctOption = parseInt(value);
    } else {
      updatedQuestions[index][field] = value;
    }
    
    setLessonData({ ...lessonData, quizQuestions: updatedQuestions });
    setUnsavedChanges(true);
  };

  // Remove a quiz question
  const removeQuizQuestion = (index) => {
    const updatedQuestions = [...lessonData.quizQuestions];
    updatedQuestions.splice(index, 1);
    setLessonData({ ...lessonData, quizQuestions: updatedQuestions });
    setUnsavedChanges(true);
  };

  const saveCurrentLesson = async () => {
    if (!lessonData.title) {
      alert('Please provide a lesson title');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call to save lesson
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update lessons array
      let updatedLessons = [...lessons];
      
      if (currentLessonIndex >= 0) {
        // Update existing lesson
        updatedLessons[currentLessonIndex] = { ...lessonData };
      } else {
        // Add new lesson
        updatedLessons.push({ 
          id: String(Date.now()), // Mock ID
          ...lessonData 
        });
        
        // Select the newly added lesson
        setCurrentLessonIndex(updatedLessons.length - 1);
      }
      
      setLessons(updatedLessons);
      setUnsavedChanges(false);
      
      // Show success message
      alert(`Lesson "${lessonData.title}" saved successfully!`);
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addNewLesson = () => {
    if (unsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to save them before creating a new lesson?'
      );
      
      if (confirmLeave) {
        saveCurrentLesson().then(() => resetLessonForm());
        return;
      }
    }
    
    resetLessonForm();
  };

  const resetLessonForm = () => {
    setLessonData({
      title: '',
      description: '',
      type: 'video',
      videoUrl: '',
      duration: '',
      content: '',
      attachments: [],
      quizQuestions: [],
    });
    setCurrentLessonIndex(-1);
    setUnsavedChanges(false);
  };

  const selectLesson = (index) => {
    if (unsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to save them before switching lessons?'
      );
      
      if (confirmLeave) {
        saveCurrentLesson().then(() => loadLesson(index));
        return;
      }
    }
    
    loadLesson(index);
  };

  const loadLesson = (index) => {
    setLessonData({ ...lessons[index] });
    setCurrentLessonIndex(index);
    setUnsavedChanges(false);
  };

  const publishCourse = async () => {
    if (lessons.length === 0) {
      alert('Please add at least one lesson before publishing the course');
      return;
    }

    if (unsavedChanges) {
      const confirmPublish = window.confirm(
        'You have unsaved changes. Do you want to save them before publishing the course?'
      );
      
      if (confirmPublish) {
        await saveCurrentLesson();
      }
    }

    setIsLoading(true);
    try {
      // Simulate API call to publish course
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Course published successfully!');
    //   router.push('/courses'); // Redirect to courses list
    } catch (error) {
      console.error('Error publishing course:', error);
      alert('Failed to publish course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !courseInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-gray-600">Loading course information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold truncate" title={courseInfo.title}>
            {courseInfo.title}
          </h2>
          <p className="text-sm text-gray-500">Course ID: {courseId}</p>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <button
            type="button"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={addNewLesson}
          >
            + Add New Lesson
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          <div className="p-2">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-2">
              Lessons ({lessons.length})
            </h3>
            
            {lessons.length === 0 ? (
              <p className="text-sm text-gray-500 px-2">No lessons added yet</p>
            ) : (
              <ul className="space-y-1">
                {lessons.map((lesson, index) => (
                  <li key={lesson.id}>
                    <button
                      className={`w-full text-left px-2 py-2 rounded-md text-sm ${
                        currentLessonIndex === index ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => selectLesson(index)}
                    >
                      <div className="flex items-center">
                        <span className="w-6 text-center">{index + 1}.</span>
                        <span className="truncate flex-grow">{lesson.title}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={publishCourse}
            disabled={isLoading}
          >
            {isLoading ? 'Publishing...' : 'Publish Course'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {currentLessonIndex >= 0 ? 'Edit Lesson' : 'Create New Lesson'}
            </h1>
            <div className="flex space-x-3">
              <button
                type="button"
                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={resetLessonForm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                onClick={saveCurrentLesson}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : "Save Lesson"}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold mb-4">Lesson Information</h2>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">Lesson Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={lessonData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter lesson title"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-1">Lesson Description</label>
              <textarea
                id="description"
                name="description"
                value={lessonData.description}
                onChange={handleInputChange}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Briefly describe what this lesson covers"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">Lesson Type</label>
                <select
                  id="type"
                  name="type"
                  value={lessonData.type}
                  onChange={handleLessonTypeChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="video">Video</option>
                  <option value="reading">Reading</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={lessonData.duration}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Estimated completion time"
                />
              </div>
            </div>
          </div>

          {/* Conditional content based on lesson type */}
          {lessonData.type === 'video' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold mb-4">Video Content</h2>
              
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-sm font-medium mb-1">Video URL</label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={lessonData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter YouTube, Vimeo or other video URL"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium mb-1">Video Transcript (optional)</label>
                <textarea
                  id="content"
                  name="content"
                  value={lessonData.content}
                  onChange={handleContentChange}
                  rows="8"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Provide a transcript of the video content"
                />
              </div>
            </div>
          )}

          {lessonData.type === 'reading' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold mb-4">Reading Content</h2>
              
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium mb-1">Lesson Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={lessonData.content}
                  onChange={handleContentChange}
                  rows="12"
                  className="w-full p-2 border border-gray-300 rounded-md font-mono"
                  placeholder="Enter lesson content here. Markdown is supported."
                />
                <p className="text-sm text-gray-500 mt-1">Supports Markdown formatting</p>
              </div>
            </div>
          )}

          {lessonData.type === 'quiz' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Quiz Questions</h2>
                <button
                  type="button"
                  onClick={addQuizQuestion}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  + Add Question
                </button>
              </div>
              
              {lessonData.quizQuestions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">No questions added yet</p>
                  <button
                    type="button"
                    onClick={addQuizQuestion}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Your First Question
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {lessonData.quizQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Question {qIndex + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeQuizQuestion(qIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="mb-3">
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => updateQuizQuestion(qIndex, 'question', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter your question"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center">
                            <input
                              type="radio"
                              id={`q${qIndex}-option${oIndex}`}
                              name={`q${qIndex}-correct`}
                              checked={q.correctOption === oIndex}
                              onChange={() => updateQuizQuestion(qIndex, 'correctOption', oIndex)}
                              className="mr-2"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateQuizQuestion(qIndex, 'option', [oIndex, e.target.value])}
                              className="flex-grow p-2 border border-gray-300 rounded-md"
                              placeholder={`Option ${oIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Select the radio button next to the correct answer</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attachments section - common for all lesson types */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Attachments</label>
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add PDF documents, worksheets, or other resources for students
              </p>
            </div>
            
            {lessonData.attachments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Uploaded Files</h3>
                <ul className="divide-y divide-gray-200 border rounded-md overflow-hidden">
                  {lessonData.attachments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCreationPage;