import React, { useState } from 'react';

const TeacherPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sample data
  const courses = [
    { id: 1, title: 'Introduction to Data Science', students: 245, completion: 68, lastUpdated: '2025-02-28' },
    { id: 2, title: 'Advanced Web Development', students: 189, completion: 72, lastUpdated: '2025-03-01' },
    { id: 3, title: 'Machine Learning Fundamentals', students: 312, completion: 45, lastUpdated: '2025-02-15' }
  ];
  
  const announcements = [
    { id: 1, title: 'Midterm project deadline extended', course: 'Introduction to Data Science', date: '2025-02-25' },
    { id: 2, title: 'New module released', course: 'Machine Learning Fundamentals', date: '2025-03-02' }
  ];
  
  const assignments = [
    { id: 1, title: 'Data Cleaning Exercise', course: 'Introduction to Data Science', submissions: 198, toGrade: 45 },
    { id: 2, title: 'Responsive Design Challenge', course: 'Advanced Web Development', submissions: 167, toGrade: 23 },
    { id: 3, title: 'Regression Models Assignment', course: 'Machine Learning Fundamentals', submissions: 287, toGrade: 102 }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Coursera for Teachers</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded">Create New Course</button>
          <div className="relative">
            <span className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-xl">
              JS
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="py-4">
            <ul>
              <li>
                <button 
                  className={`w-full text-left px-6 py-3 ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-800' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-6 py-3 ${activeTab === 'courses' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-800' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('courses')}
                >
                  Courses
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-6 py-3 ${activeTab === 'assignments' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-800' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('assignments')}
                >
                  Assignments & Grading
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-6 py-3 ${activeTab === 'analytics' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-800' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-6 py-3 ${activeTab === 'announcements' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-800' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('announcements')}
                >
                  Announcements
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-6 py-3 ${activeTab === 'discussions' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-800' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('discussions')}
                >
                  Discussion Forums
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-6 py-3 ${activeTab === 'settings' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-800' : 'text-gray-700'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
              
              {/* Overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
                  <p className="text-3xl font-bold text-blue-800">746</p>
                  <p className="text-green-600 text-sm mt-2">+12% from last month</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Completion</h3>
                  <p className="text-3xl font-bold text-blue-800">62%</p>
                  <p className="text-green-600 text-sm mt-2">+5% from last month</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Grading</h3>
                  <p className="text-3xl font-bold text-orange-500">170</p>
                  <p className="text-red-600 text-sm mt-2">+24 since yesterday</p>
                </div>
              </div>

              {/* Recent activity & tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Course Activity</h3>
                  <ul className="divide-y">
                    {courses.map(course => (
                      <li key={course.id} className="py-3">
                        <p className="font-medium text-gray-800">{course.title}</p>
                        <p className="text-sm text-gray-600">
                          {course.students} students | Last updated: {course.lastUpdated}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Pending Tasks</h3>
                  <ul className="divide-y">
                    {assignments.map(assignment => (
                      <li key={assignment.id} className="py-3">
                        <p className="font-medium text-gray-800">
                          {assignment.toGrade} submissions to grade: {assignment.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignment.course}
                        </p>
                      </li>
                    ))}
                    {announcements.map(announcement => (
                      <li key={announcement.id} className="py-3">
                        <p className="font-medium text-gray-800">
                          New announcement: {announcement.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {announcement.course} | Posted: {announcement.date}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded">Create New Course</button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completion Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map(course => (
                      <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{course.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{course.students}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${course.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{course.completion}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-gray-600 hover:text-gray-900">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Assignments & Grading</h2>
                <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded">Create Assignment</button>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submissions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending Grading
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map(assignment => (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{assignment.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{assignment.course}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{assignment.submissions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-orange-500 font-medium">{assignment.toGrade}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2">
                            Grade
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Engagement</h3>
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Engagement chart would appear here</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Completion Rates</h3>
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Completion rate chart would appear here</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Performance</h3>
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">Performance metrics would appear here</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
                <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded">New Announcement</button>
              </div>
              
              <div className="bg-white rounded-lg shadow divide-y">
                {announcements.map(announcement => (
                  <div key={announcement.id} className="p-6">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                      <span className="text-sm text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{announcement.course}</p>
                    <div className="flex mt-4">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'discussions' || activeTab === 'settings') && (
            <div className="bg-white rounded-lg shadow p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {activeTab === 'discussions' ? 'Discussion Forums' : 'Settings'}
              </h2>
              <p className="text-gray-600">
                This section is under development. Check back soon!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherPanel;