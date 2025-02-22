import React, { useState, useEffect } from 'react';
import { Mic, Book, Award, Settings, User, BarChart2, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const LiliEducationalAI = () => {
  const [activeSubject, setActiveSubject] = useState('mathematics');
  const [isListening, setIsListening] = useState(false);
  const [characterMood, setCharacterMood] = useState('happy');

  const subjects = {
    mathematics: { icon: '123', name: 'ریاضیات', color: 'bg-blue-100' },
    science: { icon: '🔬', name: 'علوم', color: 'bg-green-100' },
    persian: { icon: '📚', name: 'فارسی', color: 'bg-yellow-100' },
    social: { icon: '🌍', name: 'مطالعات اجتماعی', color: 'bg-purple-100' },
    religious: { icon: '🕌', name: 'دینی', color: 'bg-orange-100' },
    art: { icon: '🎨', name: 'هنر', color: 'bg-pink-100' }
  };

  const achievements = [
    { id: 1, name: 'ستاره ریاضی', progress: 70 },
    { id: 2, name: 'دانشمند کوچک', progress: 45 },
    { id: 3, name: 'نویسنده خلاق', progress: 60 }
  ];

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-purple-600">لی‌لی</h1>
            <span className="text-gray-500">دوست هوشمند آموزشی</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-gray-500" />
            <User className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 flex gap-4">
        {/* Left Sidebar - Subjects */}
        <div className="w-64">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">موضوعات درسی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(subjects).map(([key, subject]) => (
                  <button
                    key={key}
                    className={`w-full p-2 rounded-lg flex items-center space-x-2 ${
                      activeSubject === key ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSubject(key)}
                  >
                    <span>{subject.icon}</span>
                    <span>{subject.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <Card className="h-full">
            <CardContent className="p-6">
              {/* Character Animation Area */}
              <div className="h-64 flex items-center justify-center bg-purple-50 rounded-lg mb-4">
                <div className="text-8xl animate-bounce">
                  {characterMood === 'happy' ? '😊' : '🤔'}
                </div>
              </div>

              {/* Interaction Area */}
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <button
                    className={`p-4 rounded-full ${
                      isListening ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
                    }`}
                    onClick={toggleListening}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                  <div className="text-sm text-gray-500">
                    {isListening ? 'در حال گوش دادن...' : 'برای شروع گفتگو کلیک کنید'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Progress & Achievements */}
        <div className="w-64">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">پیشرفت من</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div key={achievement.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{achievement.name}</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">دستاوردها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <Award className="w-8 h-8 text-yellow-500" />
                <Award className="w-8 h-8 text-gray-300" />
                <Award className="w-8 h-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiliEducationalAI;