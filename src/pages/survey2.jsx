import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AISurvey = () => {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    customQ4: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('Access token not found. Please log in first.');
      return;
    }

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answers),
      });

      if (response.ok) {
        navigate('/interviewer');
      } else {
        alert('Failed to submit survey. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-blue-500 dark:text-blue-400 mb-8">
          Job Application Survey
        </h1>

        <div className="space-y-8 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
          {/* Question 1 */}
          <div>
            <label htmlFor="q1" className="block text-xl font-semibold mb-2">
              Q1. What job do you want to apply for?
            </label>
            <input
              id="q1"
              type="text"
              placeholder="Enter job title"
              value={answers.q1}
              onChange={(e) => handleInputChange('q1', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Question 2 */}
          <div>
            <label htmlFor="q2" className="block text-xl font-semibold mb-2">
              Q2. How experienced are you?
            </label>
            <select
              id="q2"
              value={answers.q2}
              onChange={(e) => handleInputChange('q2', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="">Select your experience</option>
              <option value="1-2 years">1-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-7 years">5-7 years</option>
              <option value="7+ years">7+ years</option>
            </select>
          </div>

          {/* Question 3 */}
          <div>
            <label htmlFor="q3" className="block text-xl font-semibold mb-2">
              Q3. What are your experienced projects and the most important thing you have done?
            </label>
            <textarea
              id="q3"
              placeholder="Describe your projects"
              value={answers.q3}
              onChange={(e) => handleInputChange('q3', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            ></textarea>
          </div>

          {/* Question 4 */}
          <div>
            <label htmlFor="q4" className="block text-xl font-semibold mb-2">
              Q4. What skills make you more qualified than others?
            </label>
            <div className="space-y-2">
              {['Leadership', 'Problem Solving', 'Technical Skills', 'Teamwork', 'Creativity'].map(
                (option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`q4-option-${index}`}
                      name="q4"
                      value={option}
                      checked={answers.q4 === option}
                      onChange={(e) => handleInputChange('q4', e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor={`q4-option-${index}`} className="text-gray-600 dark:text-gray-300">
                      {option}
                    </label>
                  </div>
                )
              )}
              {/* Custom Option */}
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="q4-custom"
                  name="q4"
                  value={answers.customQ4}
                  checked={answers.q4 === answers.customQ4}
                  onChange={() => handleInputChange('q4', answers.customQ4)}
                  className="mr-2"
                />
                <label htmlFor="q4-custom" className="text-gray-600 dark:text-gray-300">
                  Other:
                </label>
                <input
                  type="text"
                  placeholder="Enter your own answer"
                  value={answers.customQ4}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      customQ4: e.target.value,
                      q4: e.target.value,
                    }))
                  }
                  className="ml-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 dark:hover:bg-blue-400 transition flex items-center justify-center"
          >
            <CheckCircle className="mr-2" />
            Submit Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISurvey;
