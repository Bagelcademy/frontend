import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useTranslation } from 'react-i18next';
import { Notify } from 'notiflix';
import { useNavigate } from 'react-router-dom';

const ExamPage = () => {
  const [exam, setExam] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/courses/paths/1/generate_exam/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 4002) {
          Notify.failure("You have not completed all courses in the learning path.");
          navigate('/learning-paths');
        }

        const data = await response.json();
        setExam(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExam();
  }, []);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/courses/paths/1/generate_exam/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: selectedAnswers })
      });

      if (!response.ok) {
        throw new Error('Failed to submit exam');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const sampleExam = {
    questions: [
      {
        id: 1,
        text: "What is the capital of France?",
        options: [
          { id: 'a', text: "London" },
          { id: 'b', text: "Berlin" },
          { id: 'c', text: "Paris" },
          { id: 'd', text: "Rome" }
        ]
      },
      {
        id: 2,
        text: "Which planet is known as the Red Planet?",
        options: [
          { id: 'a', text: "Venus" },
          { id: 'b', text: "Mars" },
          { id: 'c', text: "Jupiter" },
          { id: 'd', text: "Saturn" }
        ]
      },
      {
        id: 3,
        text: "What is 2 + 2?",
        options: [
          { id: 'a', text: "3" },
          { id: 'b', text: "4" },
          { id: 'c', text: "5" },
          { id: 'd', text: "6" }
        ]
      },
      {
        id: 4,
        text: "Who painted the Mona Lisa?",
        options: [
          { id: 'a', text: "Vincent van Gogh" },
          { id: 'b', text: "Pablo Picasso" },
          { id: 'c', text: "Leonardo da Vinci" },
          { id: 'd', text: "Michelangelo" }
        ]
      },
      {
        id: 5,
        text: "What is the largest mammal on Earth?",
        options: [
          { id: 'a', text: "Elephant" },
          { id: 'b', text: "Blue Whale" },
          { id: 'c', text: "Giraffe" },
          { id: 'd', text: "Hippopotamus" }
        ]
      }
    ]
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (result) return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Exam Result</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Score: {result.score}%</p>
          <p>Passed: {result.passed ? 'Yes' : 'No'}</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="mt-24 flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-darkBase p-4">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Online Exam</h1>
      {sampleExam.questions.map((question) => (
        <Card key={question.id} className="w-full max-w-xl mb-4 dark:bg-gray-700">
          <CardHeader>
            <CardTitle>{question.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedAnswers[question.id] === option.id ? 'default' : 'outline'}
                  className={`w-full justify-start ${selectedAnswers[question.id] === option.id ? 'bg-blue-500 text-white' : ''
                    }`}
                  onClick={() => handleAnswerSelect(question.id, option.id)}
                >
                  {option.text}
                </Button>
              ))}

            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={handleSubmitExam}
        disabled={submitting || Object.keys(selectedAnswers).length !== sampleExam.questions.length}
      >
        Submit Exam
      </Button>
    </div>
  );
};

export default ExamPage;