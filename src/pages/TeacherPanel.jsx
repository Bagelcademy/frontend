import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  BookMarked,
  Trophy,
  Sparkles,
  DollarSign,
  Save,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/**
 * API CLIENT
 * ----------------------------------------------------
 * Base set to your domain (swap to real fetch calls when ready).
 * Keeping the same shape so the rest of the code works unchanged.
 */
const API_BASE = 'https://api.tadrisino.org/teacher';

const api = {
  // NOTE: these are written to call a real backend using a token from localStorage.
  // Each method falls back to the previous mock shape if the network call fails so
  // the UI continues to work during development.

  getCourses: async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('getCourses failed:', err);
    throw err;
  }
},

  getCourse: async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${id}/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch course ${id}: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('getCourse failed:', err);
    throw err;
    }
  },

  createCourse: async (data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create course: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('getCourse failed:', err);
    throw err;
    }
  },

  updateCourse: async (id, data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update course ${id}: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('getCourse failed:', err);
    throw err;
    }
  },

  deleteCourse: async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok && res.status !== 204) throw new Error(`Failed to delete course ${id}: ${res.status}`);
      return;
    } catch (err) {
      console.warn('deleteCourse failed (no-op fallback)', err);
      return;
    }
  },

  getLessons: async (courseId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/get_lessons/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch lessons for course ${courseId}: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('getLessons failed:', err);
    throw err;
    }
  },

  createLesson: async (courseId, data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/add_lesson/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create lesson: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('createLesson failed:', err);
    throw err;
    }
  },

  updateLesson: async (courseId, lessonId, data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/lessons/${lessonId}/update_lesson/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update lesson ${lessonId}: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('updateLesson failed:', err);
    throw err;
    }
  },

  getQuizzes: async (courseId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/get_quizzes/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch quizzes for course ${courseId}: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('getQuizzes failed:', err);
    throw err;
    }
  },

  createQuiz: async (courseId, lessonId, data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/lessons/${lessonId}/add_quiz/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...data, lesson: lessonId }),
      });
      if (!res.ok) throw new Error(`Failed to create quiz: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('createQuiz failed:', err);
    throw err;
    }
  },

  getQuestions: async (quizId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/quiz/${quizId}/get_question/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch questions for quiz ${quizId}: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('getQuestions failed:', err);
    throw err;
    }
  },

  updateQuiz: async (courseId, lessonId, quizId, data) => {
  const token = localStorage.getItem('accessToken');
  try {
    const res = await fetch(
      `${API_BASE}/courses/${courseId}/lessons/${lessonId}/quiz/${quizId}/update_quiz/`,
      {
        method: 'PATCH', // or 'PUT' if your backend expects full replacement
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok)
      throw new Error(
        `Failed to update quiz ${quizId} in lesson ${lessonId} (course ${courseId}): ${res.status}`
      );

    return await res.json();
  } catch (err) {
    console.error('updateQuiz failed:', err);
    throw err;
    }
},


  createQuestion: async (quizId, data) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/quiz/${quizId}/add_question/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create question: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('createQuestion failed:', err);
    throw err;
    }
  },

  updateQuestion: async (courseId, quizId, questionId, data) => {
  const token = localStorage.getItem('accessToken');
  try {
    const res = await fetch(
      `${API_BASE}/courses/${courseId}/quiz/${quizId}/question/${questionId}/update_question/`,
      {
        method: 'PATCH', // or 'PUT' if full replacement is required
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok)
      throw new Error(
        `Failed to update question ${questionId} in quiz ${quizId} (course ${courseId}): ${res.status}`
      );

    return await res.json();
  } catch (err) {
    console.error('updateQuestion:', err);
    throw err;
    }
},


  getChallenges: async (courseId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/get_challenges/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch challenges for course ${courseId}: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('getChallenges failed:', err);
    throw err;
    }
  },

  //backend needed
  generateAIChallenges: async (courseId, number) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/generate_challenges/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ number }),
      });
      if (!res.ok) throw new Error(`Failed to generate AI challenges: ${res.status}`);
      return await res.json();
    } catch (err) {
    console.error('generateAIChallenges failed:', err);
    throw err;
    }
  },

  generateAIImage: async (courseTitle) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_BASE}/courses/img_generate_ai/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title: courseTitle }),
      });
      if (!res.ok) throw new Error(`Failed to generate AI image: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('generateAIImage failed, returning fallback mock', err);
      return { image_url: 'https://via.placeholder.com/400x200' };
    }
  },
};

/**
 * ROOT
 */
const TeacherDashboard = () => {
  const { t } = useTranslation();
  const [view, setView] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const data = await api.getCourses();
    setCourses(data);
    setLoading(false);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await api.deleteCourse(id);
      loadCourses();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-gradient-to-r from-blue-500 to-purple-600 dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-x-2">
              <BookOpen className="w-8 h-8" />
              <span className="text-xl font-bold">{t('Teacher Portal')}</span>
            </div>
            <div className="flex gap-x-4">
              <button
                onClick={() => setView(t('dashboard'))}
                className={`px-4 py-2 rounded-lg ${
                  view === 'dashboard'
                    ? 'bg-gray-700 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {t('Dashboard')}
              </button>
              <button
                onClick={() => setView('courses')}
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center ${
                  view === 'courses'
                    ? 'bg-gray-700 text-white'
                    : 'bg-blue-600 text-white transition-colors hover:bg-blue-700'
                }`}
              >
                {t('My Courses')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <Dashboard
            courses={courses}
            setView={setView}
            setSelectedCourse={setSelectedCourse}
          />
        )}
        {view === 'courses' && (
          <CourseList
            courses={courses}
            onDelete={handleDeleteCourse}
            setView={setView}
            setSelectedCourse={setSelectedCourse}
            loadCourses={loadCourses}
          />
        )}
        {view === 'create-course' && (
          <CourseForm onSave={loadCourses} setView={setView} />
        )}
        {view === 'edit-course' && selectedCourse && (
          <CourseForm course={selectedCourse} onSave={loadCourses} setView={setView} />
        )}
        {view === 'course-detail' && selectedCourse && (
          <CourseDetail course={selectedCourse} setView={setView} />
        )}
      </div>
    </div>
  );
};

/**
 * Dashboard
 */
const Dashboard = ({ courses, setView, setSelectedCourse }) => {
  const { t } = useTranslation();
  const totalEnrollments = courses.reduce(
    (sum, c) => sum + (c.enroll_count || 0),
    0
  );
  const totalLessons = courses.reduce((sum, c) => sum + (c.lesson_count || 0), 0);
  const publishedCourses = courses.filter((c) => c.published).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('Dashboard')}</h1>
        <p className="text-gray-600 mt-2 dark:text-gray-300">{t('Manage your courses and track performance')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={BookOpen} label={t("Total Courses")} value={courses.length} color="blue" />
        <StatCard icon={Users} label={t("Total Enrollments")} value={totalEnrollments} color="green" />
        <StatCard icon={BookMarked} label={t("Total Lessons")} value={totalLessons} color="purple" />
        <StatCard icon={Eye} label={t("Published")} value={publishedCourses} color="orange" />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6 dark:bg-blue-900/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('Recent Courses')}</h2>
          <button
            onClick={() => setView('create-course')}
            className="flex items-center gap-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>{t('New Course')}</span>
          </button>
        </div>
        <div className="space-y-4">
          {courses.slice(0, 5).map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 dark:bg-purple-700/20 border dark:border-blue-950/20 rounded-lg hover:bg-gray-50 dark:hover:bg-purple-500/20"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">{course.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{course.description}</p>
                <div className="flex gap-x-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>{course.lesson_count} {t('teachPanel.lessons')}</span>
                  <span>{course.enroll_count} {t('teachPanel.students')}</span>
                  <span
                    className={`px-2 py-0.5 items-center rounded ${
                      course.published
                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                        : 'bg-blue-200 text-gray-800 dark:bg-blue-800 dark:text-gray-200'
                    }`}
                  >
                    {course.published ? t('Published') : t('Draft')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setView('edit-course');
                }}
                className="flex h-12 items-center justify-center border border-gray-300 dark:border-blue-900 bg-gray-600 dark:bg-gray-800 rounded-lg hover:bg-blue-500"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setView('course-detail');
                }}
                className="mx-4 h-12 text-blue-600 dark:text-blue-400 hover:text-blue-800 bg-gray-300 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {t('View Details')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-700/40 text-blue-600 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-700/40 text-green-600 dark:text-green-300',
    purple: 'bg-purple-100 dark:bg-purple-700/40 text-purple-600 dark:text-purple-300',
    orange: 'bg-orange-100 dark:bg-orange-700/40 text-orange-600 dark:text-orange-200',
  };

  return (
    <div className="bg-white dark:bg-blue-900/30 rounded-lg shadow p-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2 dark:text-blue-300">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

/**
 * Course List
 */
const CourseList = ({ courses, onDelete, setView, setSelectedCourse }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('My Courses')}</h1>
          <p className="text-gray-600 mt-2">{t('Manage all your courses')}</p>
        </div>
        <button
          onClick={() => setView('create-course')}
          className="flex items-center gap-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>{t('Create New Course')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {course.image_url ? (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="w-16 h-16 text-white opacity-50" />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{course.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded dark:bg-blue-800 dark:text-blue-100 ${
                    course.published ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-blue-200 text-gray-800'
                  }`}
                >
                  {course.published ? t('Published') : t('Draft')}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-200">{course.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-800 mb-4 dark:text-gray-200">
                <span className="flex items-center gap-x-1">
                  <BookMarked className="w-4 h-4 mx-1" />
                  <span>{course.lesson_count} {t('teachPanel.lessons')}</span>
                </span>
                <span className="flex items-center gap-x-1">
                  <Users className="w-4 h-4 mx-1" />
                  <span>{course.enroll_count} {t('teachPanel.students')}</span>
                </span>
              </div>
              <div className="flex gap-x-2">
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setView('course-detail');
                  }}
                  className="flex-1 flex items-center justify-center gap-x-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t('View')}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setView('edit-course');
                  }}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-blue-900 bg-blue-600 dark:bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="flex items-center justify-center px-4 py-2 border border-red-300 bg-red-300/90 dark:bg-red-700/60 dark:border-red-800 text-red-600 dark:text-red-200 rounded-lg hover:bg-red-400 dark:hover:bg-red-600/90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Course Form
 * (Fixed: removed undefined refs, added language options, preserved style)
 */
const CourseForm = ({ course, onSave, setView }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category ?? 1,
    published: course?.published || false,
    image_url: course?.image_url || '',
    language: course?.language || 'English',
    level: course?.level || 'beginner',
    price: course?.price ?? 0,
  });
  const [generating, setGenerating] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (course) {
      await api.updateCourse(course.id, formData);
    } else {
      await api.createCourse(formData);
    }
    onSave();
    setView('courses');
  };

  const handleGenerateImage = async () => {
    setGenerating(true);
    const result = await api.generateAIImage(formData.title);
    setFormData((prev) => ({ ...prev, image_url: result.image_url || prev.image_url }));
    setGenerating(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
          {course ? t('Edit Course') : t('Create New Course')}
        </h1>
        <p className="text-gray-600 mt-2 dark:text-purple-300">{t('Fill in the details below')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6 dark:bg-blue-950">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Course Title')}</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Description')}</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Language')}</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
              required
            >
              <option value="English">English</option>
              <option value="Persian">Persian</option>
              <option value="Arabic">Arabic</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Level')}</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Category ID')}</label>
            <input
              type="number"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: Number.isNaN(parseInt(e.target.value)) ? 1 : parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Price')} ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number.isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Image URL')}</label>
          <div className="flex gap-x-2">
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
              required
            />
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={generating}
              className="flex items-center gap-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'Generating...' : t('AI Generate')}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 dark:accent-purple-500 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-purple-300">
            {t('Publish this course')}
          </label>
        </div>

        <div className="flex gap-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5" />
            <span>{course ? ('Update Course') : t('Create Course')}</span>
          </button>
          <button
            type="button"
            onClick={() => setView('courses')}
            className="flex items-center justify-center gap-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
            <span>{t('Cancel')}</span>
          </button>
        </div>

        {/*
          ------------------------------------------------------------
          NOTE: The following block was accidentally merged from LessonsTab
          into CourseForm in your original file. It referenced undefined
          variables (editingId, setShowForm, lessons, expandedLesson, etc.)
          and caused compile errors. I'm preserving it inside a comment to
          honor "don't delete anything".
          If you need it, it's already implemented properly inside LessonsTab.
          ------------------------------------------------------------

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input ... />
          </div>
          <div className="flex gap-x-2">
            <button type="submit">...</button>
            <button type="button">Cancel</button>
          </div>
          <div className="space-y-3">{lessons.map(...)}</div>
        */}
      </form>
    </div>
  );
};

/**
 * Course Detail w/ Tabs
 */
const CourseDetail = ({ course, setView }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('lessons');
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false); // kept for parity (not used directly)
  const [selectedLesson, setSelectedLesson] = useState(null); // kept (not used)
  const [expandedLesson, setExpandedLesson] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  const loadData = async () => {
    const [lessonsData, quizzesData, challengesData] = await Promise.all([
      api.getLessons(course.id),
      api.getQuizzes(course.id),
      api.getChallenges(course.id),
    ]);
    setLessons(lessonsData);
    setQuizzes(quizzesData);
    setChallenges(challengesData);
  };

  const handleGenerateChallenges = async () => {
    const number = window.prompt('How many challenges do you want to generate?', '3');
    if (number) {
      await api.generateAIChallenges(course.id, parseInt(number));
      loadData();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => setView('courses')}
          className="text-blue-400 hover:text-blue-800 mb-4"
        >
          {t('← Back to Courses')}
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">{course.title}</h1>
            <p className="text-gray-600 mt-2 dark:text-gray-400">{course.description}</p>
          </div>
          <div className="flex gap-x-2">
            <span
              className={`px-3 py-1 rounded-lg ${
                course.published ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-300' : 'bg-blue-200 text-gray-800 dark:bg-blue-800 dark:text-gray-200'
              }`}
            >
              {course.published ? t('Published') : t('Draft')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow dark:bg-blue-900/60">
        <div className="border-b dark:border-blue-500">
          <div className="flex gap-x-8 p-6">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`py-3 px-2 border-b-2 dark:border-blue-500 font-medium ${
                activeTab === 'lessons'
                  ? 'border-blue-600 bg-gray-800 dark:bg-gray-800 text-blue-400'
                  : 'border-transparent bg-blue-700 text-gray-100 hover:text-gray-800'
              }`}
            >
              {t('Lessons')} ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-3 px-2 border-b-2 dark:border-blue-500 font-medium ${
                activeTab === 'quizzes'
                  ? 'border-blue-600 bg-gray-800 dark:bg-gray-800 text-blue-400'
                  : 'border-transparent bg-blue-700 text-gray-100 hover:text-gray-800'
              }`}
            >
              {t('Quizzes')} ({quizzes.length})
            </button>
            {/* <button
              onClick={() => setActiveTab('challenges')}
              className={`py-3 px-2 border-b-2 dark:border-blue-500 font-medium ${
                activeTab === 'challenges'
                  ? 'border-blue-600 bg-gray-800 dark:bg-gray-800 text-blue-400'
                  : 'border-transparent bg-blue-700 text-gray-100 hover:text-gray-800'
              }`}
            >
              {t('Challenges')} ({challenges.length})
            </button> */}
          </div>
        </div>

        <div className="p-6 rounded-lg dark:bg-blue-950 ">
          {activeTab === 'lessons' && (
            <LessonsTab
              courseId={course.id}
              lessons={lessons}
              showForm={showLessonForm}
              setShowForm={setShowLessonForm}
              onUpdate={loadData}
              expandedLesson={expandedLesson}
              setExpandedLesson={setExpandedLesson}
            />
          )}
          {activeTab === 'quizzes' && (
            <QuizzesTab
              courseId={course.id}
              lessons={lessons}
              quizzes={quizzes}
              showForm={showQuizForm}
              setShowForm={setShowQuizForm}
              onUpdate={loadData}
            />
          )}
          {activeTab === 'challenges' && (
            <ChallengesTab challenges={challenges} onGenerate={handleGenerateChallenges} />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Lessons Tab
 */
const LessonsTab = ({
  courseId,
  lessons,
  showForm,
  setShowForm,
  onUpdate,
  expandedLesson,
  setExpandedLesson,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    order: 1,
  });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.updateLesson(courseId, editingId, formData);
    } else {
      await api.createLesson(courseId, formData);
    }
    setFormData({ title: '', description: '', content: '', order: 1 });
    setEditingId(null);
    setShowForm(false);
    onUpdate();
  };

  const handleEdit = (lesson) => {
    setFormData({
      title: lesson.title || '',
      description: lesson.description || '',
      content: lesson.content || '',
      order: lesson.order || 1,
    });
    setEditingId(lesson.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('Course Lessons')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>{t('Add Lesson')}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg space-y-4 dark:border-blue-950/20">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Lesson Title')}</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Description')}</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Content')}</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-purple-300">{t('Order')}</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number.isNaN(parseInt(e.target.value)) ? 1 : parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-purple-500/20 dark:border-purple-800/20 dark:text-white"
              required
            />
          </div>

          <div className="flex gap-x-2">
            <button
              type="submit"
              className="flex items-center gap-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? t('Update') : t('Create')} {t('Lesson')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ title: '', description: '', content: '', order: 1 });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 "
            >
              {t('Cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {lessons
          .slice()
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((lesson) => (
            <div key={lesson.id} className="border border-gray-200 rounded-lg dark:border-blue-950/20">
              <div className="flex items-center justify-between p-4 rounded-2xl dark:bg-violet-900/60 border-gray-200 dark:border-violet-950 hover:bg-gray-50 dark:hover:bg-purple-800/20">
                <div className="flex-1">
                  <div className="flex items-center gap-x-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      {lesson.order}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-200">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-200">{lesson.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <button
                    onClick={() =>
                      setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)
                    }
                    className="lex items-center justify-center p-2 border border-blue-700 dark:border-blue-900 bg-gray-700 dark:bg-blue-600/30 rounded-lg hover:bg-blue-500"
                  >
                    {expandedLesson === lesson.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="flex items-center justify-center p-2 border border-blue-700 dark:border-blue-900 bg-gray-700 dark:bg-blue-600/30 rounded-lg hover:bg-blue-500"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedLesson === lesson.id && (
                <div className="px-4 pb-4 pt-4">
                  <div className="rounded-lg p-4 bg-gray-200 dark:bg-violet-700/60">
                    <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                      {t('Content')}:
                    </h4>
                    <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {lesson.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

/**
 * Quizzes Tab
 */
const QuizzesTab = ({ courseId, lessons, quizzes, showForm, setShowForm, onUpdate }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ title: '', lesson: '' });
  const [editingId, setEditingId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionData, setQuestionData] = useState({
    question_text: '',
    option_1: '',
    option_2: '',
    option_3: '',
    option_4: '',
    correct_option: '1',
  });

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateQuiz(courseId, parseInt(formData.lesson), editingId, {
          title: formData.title,
        });
      } else {
        await api.createQuiz(courseId, parseInt(formData.lesson), {
          title: formData.title,
        });
      }
      setFormData({ title: '', lesson: '' });
      setEditingId(null);
      setShowForm(false);
      onUpdate();
      Notify.success(t(editingId ? 'Quiz updated successfully' : 'Quiz created successfully'));
    } catch (error) {
      console.error('Error creating/updating quiz:', error);
      Notify.failure(t('Failed to save quiz'));
    }
  };

  const handleEdit = (quiz) => {
    // Immediately open the edit form and pre-fill values.
    // This will replace any create form that might be open.
    setFormData({
      title: quiz.title || '',
      lesson: quiz.lesson?.toString() || ''
    });
    setEditingId(quiz.id);
    setShowForm(true);
  };

  const handleSelectQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    const questionsData = await api.getQuestions(quiz.id);
    setQuestions(questionsData);
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;
    if (editingQuestionId) {
      // update existing question
      await api.updateQuestion(courseId, selectedQuiz.id, editingQuestionId, questionData);
    } else {
      // create new question
      await api.createQuestion(selectedQuiz.id, questionData);
    }

    setQuestionData({
      question_text: '',
      option_1: '',
      option_2: '',
      option_3: '',
      option_4: '',
      correct_option: '1',
    });
    setShowQuestionForm(false);
    setEditingQuestionId(null);
    handleSelectQuiz(selectedQuiz);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('Course Quizzes')}</h2>
        <button
          onClick={() => {
            // If currently editing a quiz, switch straight to create mode
            if (editingId) {
              setEditingId(null);
              setFormData({ title: '', lesson: '' });
              setShowForm(true);
            } else {
              setShowForm(!showForm);
            }
          }}
          className="flex items-center gap-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>{t('Add Quiz')}</span>
        </button>
      </div>

      {showForm && !editingId && (
        <form onSubmit={handleSubmitQuiz} className="mb-6 p-6 border border-gray-200 rounded-lg space-y-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('Create New Quiz')}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">{t('Quiz Title')}</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">{t('Select Lesson')}</label>
            <select
              value={formData.lesson}
              onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">{t('Choose a lesson...')}</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-x-2">
            <button
              type="submit"
              className="flex items-center gap-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>{t('Create Quiz')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ title: '', lesson: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              {t('Cancel')}
            </button>
          </div>
        </form>
      )}

      {showForm && editingId && (
        <form onSubmit={handleSubmitQuiz} className="mb-6 p-6 border text-gray-800 dark:text-white border-gray-200 rounded-lg space-y-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">{t('Edit Quiz')}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Quiz Title')}</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 mb-1 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">{t('Select Lesson')}</label>
            <select
              value={formData.lesson}
              onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">{t('Choose a lesson...')}</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div> */}
          <div className="flex gap-x-2">
            <button
              type="submit"
              className="flex items-center gap-x-2 bg-green-600 dark:bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              <span>{t('Update Quiz')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ title: '', lesson: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-200 hover:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {t('Cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-200">{t('Quizzes')}</h3>
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleSelectQuiz(quiz)}
                className={`p-4 border rounded-lg cursor-pointer bg-slate-300 dark:bg-slate-800 hover:bg-gray-50 ${
                  selectedQuiz?.id === quiz.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                {/* Header row with title and edit button */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200">{quiz.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                      {t('Lesson ID:')} {quiz.lesson}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent selecting the quiz when clicking edit
                      handleEdit(quiz);
                    }}
                    className="flex items-center justify-center p-2 border border-blue-700 dark:border-blue-900 bg-gray-700 dark:bg-blue-600/30 rounded-lg hover:bg-blue-500"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div>
          {selectedQuiz && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-200">
                  {t('Questions for')} {selectedQuiz.title}
                </h3>
                <button
                  onClick={() => {
                    // If the question form is open and we're currently editing a question,
                    // switch immediately to create mode (clear inputs and editing state).
                    if (showQuestionForm && editingQuestionId) {
                      setEditingQuestionId(null);
                      setQuestionData({
                        question_text: '',
                        option_1: '',
                        option_2: '',
                        option_3: '',
                        option_4: '',
                        correct_option: '1',
                      });
                      // keep the form open in create mode
                      setShowQuestionForm(true);
                      return;
                    }

                    // Otherwise toggle the question form
                    setShowQuestionForm(!showQuestionForm);
                  }}
                  className="flex items-center gap-x-2 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('Add Question')}</span>
                </button>
              </div>

              {showQuestionForm && (
                <form
                  onSubmit={handleSubmitQuestion}
                  className="mb-4 p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                      {t('Question')}
                    </label>
                    <input
                      type="text"
                      value={questionData.question_text}
                      onChange={(e) =>
                        setQuestionData({ ...questionData, question_text: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-700"
                      required
                    />
                  </div>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                        {t('Option')} {num}
                      </label>
                      <input
                        type="text"
                        value={questionData[`option_${num}`]}
                        onChange={(e) =>
                          setQuestionData({
                            ...questionData,
                            [`option_${num}`]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-700"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                      {t('Correct Option')}
                    </label>
                    <select
                      value={questionData.correct_option}
                      onChange={(e) =>
                        setQuestionData({ ...questionData, correct_option: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-700"
                    >
                      <option value="1">{t('Option')} 1</option>
                      <option value="2">{t('Option')} 2</option>
                      <option value="3">{t('Option')} 3</option>
                      <option value="4">{t('Option')} 4</option>
                    </select>
                  </div>
                  <div className="flex gap-x-2">
                    <button
                      type="submit"
                      className="flex items-center gap-x-2 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingQuestionId ? t('Update') : t('Add')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setEditingQuestionId(null);
                        setQuestionData({
                          question_text: '',
                          option_1: '',
                          option_2: '',
                          option_3: '',
                          option_4: '',
                          correct_option: '1',
                        });
                      }}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      {t('Cancel')}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 border border-gray-200 dark:border-gray-900 dark:bg-slate-900/70 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-justify text-gray-900 dark:text-gray-100">
                        {idx + 1}. {q.question_text}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <button
                          onClick={() => {
                            // populate form for editing this question
                            setQuestionData({
                              question_text: q.question_text || '',
                              option_1: q.option_1 || '',
                              option_2: q.option_2 || '',
                              option_3: q.option_3 || '',
                              option_4: q.option_4 || '',
                              correct_option: q.correct_option ? String(q.correct_option) : '1',
                            });
                            setEditingQuestionId(q.id);
                            setShowQuestionForm(true);
                          }}
                          className="flex items-center justify-center p-1 mx-2 border border-blue-700 dark:border-blue-900 bg-gray-700 dark:bg-sky-600/50 rounded-lg hover:bg-blue-500"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      {[1, 2, 3, 4].map((num) => (
                        <div
                          key={num}
                          className={`p-2 rounded break-words overflow-hidden text-ellipsis ${
                            q.correct_option === num.toString()
                              ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-100'
                              : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-50'
                          }`}
                        >
                          <span className="inline-block w-full break-words">
                            {num}. {q[`option_${num}`]}{' '}
                            {q.correct_option === num.toString() && '✓'}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Challenges Tab
 */
const ChallengesTab = ({ challenges, onGenerate }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Course Challenges</h2>
        <button
          onClick={onGenerate}
          className="flex items-center gap-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate AI Challenges</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-lg">{challenge.topic}</h3>
                <div className="flex items-center gap-x-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      challenge.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : challenge.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {challenge.language}
                  </span>
                </div>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700">{challenge.challenge_text}</p>
            </div>
            {challenge.answers && challenge.answers.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Sample Solution:</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{challenge.answers[0]}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
