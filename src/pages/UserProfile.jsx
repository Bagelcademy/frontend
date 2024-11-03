import React, { useState, useEffect } from 'react';
import { Flame, Mail, Star, Calendar, Book, Edit3, Upload } from 'lucide-react';

// UI Components
const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 bg-buttonColor text-white rounded-md hover:bg-opacity-90 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-buttonColor ${className}`}
    ref={ref}
    {...props}
  />
));

const Textarea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-buttonColor ${className}`}
    ref={ref}
    {...props}
  />
));

const Progress = ({ value, max = 100, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div
      className="bg-buttonColor h-2.5 rounded-full"
      style={{ width: `${(value / max) * 100}%` }}
    ></div>
  </div>
);

// InfoCard Component
const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
    <div className="flex items-center text-gray-600 dark:text-gray-300">
      {icon}
      <span className="font-semibold ml-2">{title}</span>
    </div>
    <span className="font-medium dark:text-gray-400">{value}</span>
  </div>
);

// CourseProgressCard Component
const CourseProgressCard = ({ progress, streak, onCompleteLesson }) => (
  <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold">{progress.course.title}</h3>
      <Book className="w-6 h-6 text-blue-500" />
    </div>
    <Progress value={progress.total_score} className="mb-2" />
    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>Total Score: {progress.total_score}</span>
      <span>Points Earned: {progress.points_earned}</span>
      <span>Streak: {streak} days</span>
    </div>
    <div className="mt-2">
      <h4 className="font-semibold mb-1">Completed Lessons:</h4>
      <ul className="list-disc list-inside">
        {progress.completed_lessons.map((lesson, index) => (
          <li key={index}>{lesson.title}</li>
        ))}
      </ul>
    </div>
    {!progress.course_completed && (
      <Button 
        onClick={() => onCompleteLesson(progress.course.id, progress.completed_lessons.length + 1)} 
        className="mt-2"
      >
        Complete Next Lesson
      </Button>
    )}
    {progress.course_completed && (
      <div className="mt-2 text-green-500 font-semibold">Course Completed!</div>
    )}
  </div>
);

// Main UserProfilePage Component
const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [courses, setCourses] = useState([]);
  const [streaks, setStreaks] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { 'Authorization': `Bearer ${token}` };

        const [userResponse, progressResponse, streaksResponse, pointsResponse] = await Promise.all([
          fetch('https://bagelapi.artina.org/account/user-info/', { headers }),
          fetch('https://bagelapi.artina.org/courses/student-progress/', { headers }),
          fetch('https://bagelapi.artina.org/courses/student-progress/streak/', { headers }),
          fetch('https://bagelapi.artina.org/courses/student-progress/points-earned/', { headers })
        ]);

        if (!userResponse.ok || !progressResponse.ok || !streaksResponse.ok || !pointsResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        const progressData = await progressResponse.json();
        const streaksData = await streaksResponse.json();
        const pointsData = await pointsResponse.json();

        setUser(userData);
        setCourses(progressData);
        setStreaks(streaksData);
        setTotalPoints(pointsData.total_points_earned);
        setBio(userData.bio || '');
        setLoading(false);
        console.log('User data:', userData);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleBioChange = (e) => setBio(e.target.value);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch('https://bagelapi.artina.org/account/profile/update_profile/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setUser({ ...user, bio });
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch('https://bagelapi.artina.org/account/upload-profile-picture/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const data = await response.json();
      setUser({ ...user, profile_picture: data.profile_picture_url });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteLesson = async (courseId, lessonId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`https://bagelapi.artina.org/progress/${courseId}/complete-lesson/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lesson_id: lessonId }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete lesson');
      }

      // Refresh progress data
      const updatedProgressResponse = await fetch('https://bagelapi.artina.org/progress/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const updatedProgressData = await updatedProgressResponse.json();
      setCourses(updatedProgressData);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!user) return <div className="text-center p-4 text-gray-500">No user data found</div>;

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground transition-colors duration-500 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-buttonColor text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <Button onClick={() => setEditMode(!editMode)} variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <img
                src={user.profile_picture || '/api/placeholder/150/150'}
                alt={user.first_name}
                className="w-32 h-32 rounded-full border-4 border-buttonColor transition-transform duration-300 transform hover:scale-110"
              />
              {editMode && (
                <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-buttonColor text-white p-2 rounded-full cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <input
                    id="profile-picture"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              {editMode ? (
                <Textarea
                  value={bio}
                  onChange={handleBioChange}
                  placeholder="Write your bio here..."
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">{user.bio || 'No bio available'}</p>
              )}
            </div>
          </div>
          {editMode && (
            <Button onClick={handleSave} className="mb-4">
              Save Changes
            </Button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={<Flame className="w-6 h-6 text-orange-500" />} title="Total Streak" value={`${streaks.reduce((total, streak) => total + streak.streak, 0)} days`} />
            <InfoCard icon={<Mail className="w-6 h-6 text-gray-500" />} title="Email" value={user.email} />
            <InfoCard icon={<Star className="w-6 h-6 text-yellow-500" />} title="Total Points" value={totalPoints} />
            <InfoCard icon={<Calendar className="w-6 h-6 text-green-500" />} title="Subscription" value={`${user.subscriptionDaysLeft} days left`} />
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          {courses.map((progress, index) => (
            <CourseProgressCard 
              key={index} 
              progress={progress}
              streak={streaks.find(s => s.course__title === progress.course.title)?.streak || 0}
              onCompleteLesson={handleCompleteLesson}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;