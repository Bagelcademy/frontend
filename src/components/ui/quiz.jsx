import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Trophy, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useTranslation } from 'react-i18next';

const Quiz = ({ lessonId, onComplete }) => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  const fetchQuestions = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(
        `https://bagelapi.bagelcademy.org/courses/exams/${lessonId}/Qlist/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data['0']?.questions?.length > 0) {
        const formattedQuestions = data['0'].questions.map(q => ({
          id: q.id,
          text: q.question_text,
          options: [
            { id: '1', text: q.option_1 },
            { id: '2', text: q.option_2 },
            { id: '3', text: q.option_3 },
            { id: '4', text: q.option_4 },
          ].filter(option => option.text),
        }));
        setQuestions(formattedQuestions);
      }
      else {
        onComplete?.();
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    console.log(`Answer changed for Question ${questionId}: ${value}`);
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
    setShowAlert(false);
  };

  const validateAnswers = () => {
    const allAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);
    console.log('All questions answered:', allAnswered);
    console.log('Selected Answers:', selectedAnswers);
    return allAnswered;
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      setShowAlert(true);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(
        `https://bagelapi.bagelcademy.org/courses/quizzes/${lessonId}/submit_answers/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lessonId,
            answers: Object.entries(selectedAnswers).map(([questionId, answer]) => ({
              questionId: parseInt(questionId),
              answer: parseInt(answer),
            })),
          }),
        }
      );
      const data = await response.json();
      setResults(data);
      if (data.passed) onComplete?.();
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!questions.length) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-slate-500">{t('quiz.noQuestions')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {t('quiz.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {t('quiz.answerAllAlert')}
            </AlertDescription>
          </Alert>
        )}
        {!results ? (
          <div className="flex flex-col gap-8">
            {questions.map((question, index) => (
              <div key={question.id} className="flex flex-col gap-6">
                <h3 className="font-medium">
                  {index + 1}. {question.text}
                </h3>
                <div className="flex flex-col gap-6">
                  <RadioGroup
                    name={`question-${question.id}`}
                    value={selectedAnswers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="flex flex-col gap-2"
                  >
                    {question.options.map((option) => (
                      <RadioGroupItem key={option.id} value={option.id} className="flex gap-2 mx-4">
                        {option.text}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            ))}
            <Button className="w-full text-white" onClick={handleSubmit}>
              {t('quiz.submitButton')}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                {results.passed ? t('quiz.congratulations') : t('quiz.keepLearning')}
              </div>
              <div className="text-slate-500">
                {t('quiz.scoreMessage', { score: results.total_score })}
              </div>
            </div>
            <div className="space-y-4">
              {questions.map(question => {
                const isCorrect = results.answers[question.id];
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${isCorrect
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1" />
                      )}
                      <div>
                        <div className="font-medium">{question.text}</div>
                        <div className="text-sm mt-1">
                          {isCorrect
                            ? t('quiz.correctAnswer')
                            : t('quiz.correctAnswerWas', {
                              answer: question.options.find(
                                o => o.id === results.answers[question.id]
                              )?.text
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {!results.passed && (
              <Button className="w-full text-white" onClick={() => setResults(null)}>
                {t('quiz.tryAgainButton')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Quiz;