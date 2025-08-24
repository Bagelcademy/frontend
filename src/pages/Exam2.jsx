import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Heart, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ExamPage = () => {
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [mistakes, setMistakes] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/api/exam', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exam');
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

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerId) => {
    const currentQuestion = exam.questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer === answerId;

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerId
    }));

    if (!isCorrect) {
      setMistakes(prev => prev - 1);
    }

    // Move to next question or submit if last question
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitExam();
    }
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/examAnswer', {
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
      setIsResultDialogOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (mistakes <= 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Exam Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You have used all your allowed mistakes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Header with Hearts, Timer, and Mistakes */}
      <div className="fixed top-4 right-4 flex items-center space-x-4">
        <div className="flex items-center">
          {[...Array(mistakes)].map((_, i) => (
            <Heart key={i} className="text-red-500 w-6 h-6" fill="currentColor" />
          ))}
          {[...Array(3 - mistakes)].map((_, i) => (
            <Heart key={i} className="text-gray-300 w-6 h-6" />
          ))}
        </div>
        <div className="flex items-center text-lg font-bold">
          <Clock className="mr-2 w-6 h-6" />
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Current Question */}
      <Card className="w-full max-w-xl mb-4">
        <CardHeader>
          <CardTitle>{exam.questions[currentQuestionIndex].text}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {exam.questions[currentQuestionIndex].options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAnswerSelect(option.id)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exam Result</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>Score: {result?.score}%</p>
            <p>Passed: {result?.passed ? 'Yes' : 'No'}</p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamPage;