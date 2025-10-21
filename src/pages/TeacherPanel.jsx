import React, { useState, useEffect } from 'react';
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
  // NOTE: keep mock shape; replace internals with fetch when your backend is ready.
  getCourses: async () => {
    // Example real call:
    // const res = await fetch(`${API_BASE}/courses/`, { credentials: 'include' });
    // return await res.json();
    return [
      {
        id: 1,
        title: 'Python for Beginners',
        description: 'Learn Python from scratch',
        published: true,
        enroll_count: 45,
        lesson_count: 15,
        level: 'beginner',
        language: 'English',
        category: 1,
        image_url: '',
        price: 0,
      },
    ];
  },
  getCourse: async (id) => {
    return {
      id,
      title: 'Python for Beginners',
      description: 'Learn Python',
      published: true,
      image_url: '',
      language: 'English',
      level: 'beginner',
      category: 1,
      price: 0,
    };
  },
  createCourse: async (data) => {
    // const res = await fetch(`${API_BASE}/courses/`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data), credentials:'include' });
    // return await res.json();
    return { id: Date.now(), ...data };
  },
  updateCourse: async (id, data) => {
    // const res = await fetch(`${API_BASE}/courses/${id}/`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data), credentials:'include' });
    // return await res.json();
    return { id, ...data };
  },
  deleteCourse: async (id) => {
    // await fetch(`${API_BASE}/courses/${id}/`, { method: 'DELETE', credentials:'include' });
    return;
  },
  getLessons: async (courseId) => {
    return [
      {
        id: 1,
        title: 'Introduction',
        description: 'Getting started',
        content: 'Welcome to the course',
        order: 1,
        course: courseId,
      },
    ];
  },
  createLesson: async (courseId, data) => {
    return { id: Date.now(), ...data, course: courseId };
  },
  updateLesson: async (courseId, lessonId, data) => {
    return { id: lessonId, ...data, course: courseId };
  },
  getQuizzes: async (courseId) => {
    return [{ id: 1, title: 'Quiz 1', lesson: 1 }];
  },
  createQuiz: async (courseId, lessonId, data) => {
    return { id: Date.now(), ...data, lesson: lessonId };
  },
  getQuestions: async (quizId) => {
    return [
      {
        id: 1,
        question_text: 'What is Python?',
        option_1: 'Language',
        option_2: 'Snake',
        option_3: 'Tool',
        option_4: 'Framework',
        correct_option: '1',
        quiz: quizId,
      },
    ];
  },
  createQuestion: async (quizId, data) => {
    return { id: Date.now(), ...data, quiz: quizId };
  },
  getChallenges: async (courseId) => {
    return [
      {
        id: 1,
        topic: 'Loops',
        challenge_text: 'Write a for loop',
        difficulty: 'easy',
        language: 'English',
        answers: ['for i in range(10): print(i)'],
      },
    ];
  },
  generateAIChallenges: async (courseId, number) => {
    return { message: `${number} challenges created`, challenges: [] };
  },
  generateAIImage: async (courseTitle) => {
    // return { image_url: "https://..." }
    return { image_url: 'https://via.placeholder.com/400x200' };
  },
};

/**
 * ROOT
 */
const TeacherDashboard = () => {
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Teacher Portal</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('courses')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'courses'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Courses
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
  const totalEnrollments = courses.reduce(
    (sum, c) => sum + (c.enroll_count || 0),
    0
  );
  const totalLessons = courses.reduce((sum, c) => sum + (c.lesson_count || 0), 0);
  const publishedCourses = courses.filter((c) => c.published).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your courses and track performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={BookOpen} label="Total Courses" value={courses.length} color="blue" />
        <StatCard icon={Users} label="Total Enrollments" value={totalEnrollments} color="green" />
        <StatCard icon={BookMarked} label="Total Lessons" value={totalLessons} color="purple" />
        <StatCard icon={Eye} label="Published" value={publishedCourses} color="orange" />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <button
            onClick={() => setView('create-course')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>New Course</span>
          </button>
        </div>
        <div className="space-y-4">
          {courses.slice(0, 5).map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.description}</p>
                <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                  <span>{course.lesson_count} lessons</span>
                  <span>{course.enroll_count} students</span>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      course.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setView('course-detail');
                }}
                className="ml-4 text-blue-600 hover:text-blue-800"
              >
                View Details
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
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
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
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Manage all your courses</p>
        </div>
        <button
          onClick={() => setView('create-course')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
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
                <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    course.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {course.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center space-x-1">
                  <BookMarked className="w-4 h-4" />
                  <span>{course.lesson_count} lessons</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enroll_count} students</span>
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setView('course-detail');
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setView('edit-course');
                  }}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
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
        <h1 className="text-3xl font-bold text-gray-900">
          {course ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="text-gray-600 mt-2">Fill in the details below</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="English">English</option>
              <option value="Persian">Persian</option>
              <option value="Arabic">Arabic</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category ID</label>
            <input
              type="number"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: Number.isNaN(parseInt(e.target.value)) ? 1 : parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number.isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={generating}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'Generating...' : 'AI Generate'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            Publish this course
          </label>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5" />
            <span>{course ? 'Update Course' : 'Create Course'}</span>
          </button>
          <button
            type="button"
            onClick={() => setView('courses')}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
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
          <div className="flex space-x-2">
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
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Courses
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </div>
          <div className="flex space-x-2">
            <span
              className={`px-3 py-1 rounded-lg ${
                course.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {course.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'lessons'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Lessons ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'quizzes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Quizzes ({quizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'challenges'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Challenges ({challenges.length})
            </button>
          </div>
        </div>

        <div className="p-6">
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
        <h2 className="text-xl font-semibold">Course Lessons</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lesson</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number.isNaN(parseInt(e.target.value)) ? 1 : parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Update' : 'Create'} Lesson</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ title: '', description: '', content: '', order: 1 });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {lessons
          .slice()
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((lesson) => (
            <div key={lesson.id} className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      {lesson.order}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)
                    }
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {expandedLesson === lesson.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedLesson === lesson.id && (
                <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Content:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{lesson.content}</p>
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
  const [formData, setFormData] = useState({ title: '', lesson: '' });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
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
    await api.createQuiz(courseId, parseInt(formData.lesson), { title: formData.title });
    setFormData({ title: '', lesson: '' });
    setShowForm(false);
    onUpdate();
  };

  const handleSelectQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    const questionsData = await api.getQuestions(quiz.id);
    setQuestions(questionsData);
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuiz) return;
    await api.createQuestion(selectedQuiz.id, questionData);
    setQuestionData({
      question_text: '',
      option_1: '',
      option_2: '',
      option_3: '',
      option_4: '',
      correct_option: '1',
    });
    setShowQuestionForm(false);
    handleSelectQuiz(selectedQuiz);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Course Quizzes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Quiz</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmitQuiz} className="mb-6 p-6 border border-gray-200 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Lesson</label>
            <select
              value={formData.lesson}
              onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a lesson...</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>Create Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ title: '', lesson: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Quizzes</h3>
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleSelectQuiz(quiz)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedQuiz?.id === quiz.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                <p className="text-sm text-gray-600 mt-1">Lesson ID: {quiz.lesson}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedQuiz && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  Questions for {selectedQuiz.title}
                </h3>
                <button
                  onClick={() => setShowQuestionForm(!showQuestionForm)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              {showQuestionForm && (
                <form
                  onSubmit={handleSubmitQuestion}
                  className="mb-4 p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={questionData.question_text}
                      onChange={(e) =>
                        setQuestionData({ ...questionData, question_text: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Option {num}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Option
                    </label>
                    <select
                      value={questionData.correct_option}
                      onChange={(e) =>
                        setQuestionData({ ...questionData, correct_option: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                      <option value="3">Option 3</option>
                      <option value="4">Option 4</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQuestionForm(false)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">
                      {idx + 1}. {q.question_text}
                    </p>
                    <div className="space-y-1 text-sm">
                      {[1, 2, 3, 4].map((num) => (
                        <div
                          key={num}
                          className={`p-2 rounded ${
                            q.correct_option === num.toString()
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {num}. {q[`option_${num}`]} {q.correct_option === num.toString() && '✓'}
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
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
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
                <h3 className="font-semibold text-gray-900 text-lg">{challenge.topic}</h3>
                <div className="flex items-center space-x-2 mt-2">
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
