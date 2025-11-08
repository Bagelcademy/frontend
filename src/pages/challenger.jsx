import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Textarea } from '../components/ui/textarea';
import { Loader2, Code, FileText, Send, Save, Bold, Italic, List, Link, Subscript, Superscript } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/selectIndex';
import { Play, Terminal, ChevronsLeftRightEllipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CharacterWelcomePopup from '../components/ui/CharacterPopup';

const toPersianDigits = (num) => {
  return num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

const ChallengePage = ({ setIsLoggedIn }) => {
  const { courseId, challengeNumber } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [userChallengeId, setUserChallengeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [characterData, setCharacterData] = useState(null);
  
  // Code editor states
  const [code, setCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('python');
  
  // Text editor states
  const [textAnswer, setTextAnswer] = useState('');
  const textareaRef = useRef(null);
  
  const { t, i18n } = useTranslation();

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const languageIds = {
    python: 71,
    java: 62,
  };

  // Determine challenge type based on content
  const isCodeChallenge = (challengeText) => {
    const codeKeywords = ['code', 'program', 'function', 'algorithm', 'implement', 'write a function', 'solve', 'debug', 'python', 'java'];
    return codeKeywords.some(keyword => challengeText.toLowerCase().includes(keyword));
  };

  // Load challenge data
  useEffect(() => {
    const startChallenge = async () => {
      try {
        setLoading(true);
        console.log('Fetching challenge:', { challengeNumber, courseId });
        
        const response = await fetch(`https://api.tadrisino.org/challenge/challenges/start/?challenge_number=${challengeNumber}&course_id=${courseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

       if (!response.ok) {
          const errorText = await response.text();
        
          console.log(t('error_response'), errorText);
  throw new Error(t('error_start_challenge', { status: response.status, details: errorText }));
        }
       

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.log('Non-JSON response:', responseText);
          throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();
        console.log('Challenge data:', data);
        setChallenge(data);
        setUserChallengeId(data.user_challenge_id);
      } catch (err) {
        console.error('Error loading challenge:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (challengeNumber && courseId) {
      startChallenge();
    }
  }, [challengeNumber, courseId]);

  // Execute code for programming challenges
  const executeCode = async () => {
    setIsExecuting(true);
    try {
      const submissionResponse = await fetch('https://judge.tadrisino.org/submissions?base64_encoded=true', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          source_code: btoa(code),
          language_id: languageIds[codeLanguage],
        }),
      });

      const submission = await submissionResponse.json();
      if (!submission.token) {
        throw new Error('Failed to create submission');
      }

      const token = submission.token;
      let resultResponse;
      let result;

      do {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        resultResponse = await fetch(`https://judge.tadrisino.org/submissions/${token}?base64_encoded=true`);
        result = await resultResponse.json();
      } while (resultResponse.status === 204);

      const decodedOutput = atob(result.stdout || result.stderr || 'No output');
      setCodeOutput(decodedOutput);
    } catch (error) {
      setCodeOutput('Execution failed: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  // Text formatting functions for descriptive challenges
  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textAnswer.substring(start, end);
    const newText = textAnswer.substring(0, start) + before + selectedText + after + textAnswer.substring(end);
    setTextAnswer(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatText = (type) => {
    switch (type) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'list':
        insertText('- ');
        break;
      case 'link':
        insertText('[', '](url)');
        break;
      case 'subscript':
        insertText('_{', '}');
        break;
      case 'superscript':
        insertText('^{', '}');
        break;
      case 'equation':
        insertText('$$', '$$');
        break;
      case 'fraction':
        insertText('\\frac{numerator}{denominator}');
        break;
      case 'square':
        insertText('^2');
        break;
      case 'sqrt':
        insertText('\\sqrt{', '}');
        break;
    }
  };

  // Submit challenge answer
  const submitChallenge = async () => {
    const answer = challenge && isCodeChallenge(challenge.challenge_text) ? code : textAnswer;
    
    if (!answer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Submitting challenge:', { userChallengeId, answer });
      
      const response = await fetch('https://api.tadrisino.org/challenge/challenges/submit/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_challenge_id: userChallengeId,
          user_answer: answer,
        }),
      });

      console.log('Submit response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Submit error response:', errorText);
        throw new Error(`Failed to submit challenge: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Non-JSON submit response:', responseText);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('Submit result:', data);
      setResult(data);
      
      // Handle character data if present
      if (data.character && data.character.main_character) {
        setCharacterData(data.character.main_character);
        setShowCharacterPopup(true);
      }
    } catch (err) {
      console.error('Error submitting challenge:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-800 dark:text-gray-300">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">{t('Loading challenge...')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const isCodingChallenge = challenge && isCodeChallenge(challenge.challenge_text);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Challenge Description */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
            {isCodingChallenge ? <Code className="w-5 h-5" /> : <FileText className="w-5 h-5 mb-2" />}
            {i18n.language === 'fa' ? t("challenge_title", { number: toPersianDigits(challengeNumber) }) : t("challenge_title",{ number : challengeNumber})}
            {/* {t("challenge_title", i18n.language === 'fa' ? { number: toPersianDigits(challengeNumber) } : challengeNumber)} */}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{challenge?.challenge_text}</p>
          </div>
        </CardContent>
      </Card>

      {/* Code Challenge Interface */}
      {isCodingChallenge && (
        <Card className="w-full text-left ltr:mr-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="flex gap-4 items-center">
                <Terminal className="w-5 h-5" />
                {t('Code Laboratory')}
              </div>
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">{t('Python')}</SelectItem>
                  <SelectItem value="java">{t('Java')}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={executeCode}
                disabled={isExecuting || !code.trim()}
                className="flex items-center gap-2 bg-gray-800 text-white"
              >
                <Play className="w-4 h-4" />
                {isExecuting ? 'Running...' : 'Execute'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="border-2">
              <CodeMirror
                value={code}
                height="400px"
                extensions={[codeLanguage === 'python' ? python() : java()]}
                onChange={(value) => setCode(value)}
                theme="dark"
                className="rounded-lg ltr:ml-1 text-left"
              />
            </Card>
            <Card>
              <CardHeader>
                <div className="flex gap-4 items-center">
                  <ChevronsLeftRightEllipsis className="w-5 h-5" />
                  {t('Output')}
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg min-h-[100px] max-h-[200px] overflow-auto">
                  {codeOutput || 'No output yet'}
                </pre>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Descriptive Challenge Interface */}
      {!isCodingChallenge && (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 mb-2" />
                {t("Your Answer")}
              </div>
            </CardTitle>
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap gap-2 p-2 bg-gray-200 dark:bg-indigo-900 rounded-lg">
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('bold')}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('italic')}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('list')}
                title="List"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('link')}
                title="Link"
              >
                <Link className="w-4 h-4" />
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('subscript')}
                title="Subscript"
              >
                <Subscript className="w-4 h-4" />
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('superscript')}
                title="Superscript"
              >
                <Superscript className="w-4 h-4" />
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('equation')}
                title="Equation"
              >
                ∑
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('fraction')}
                title="Fraction"
              >
                ½
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('square')}
                title="Square"
              >
                x²
              </Button>
              <Button className="w-10 h-8 bg-slate-800 hover:bg-slate-700 text-gray-200"
                size="sm"
                variant="outline"
                onClick={() => formatText('sqrt')}
                title="Square Root"
              >
                √
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              ref={textareaRef}
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder={t("Write your detailed answer here. You can use markdown formatting and mathematical expressions...")}
              className="min-h-[300px] text-gray-800 dark:text-gray-200 text-base leading-relaxed"
            />
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{t("Tip: Use ** for bold, * for italic, $$ for equations, ^{} for superscript, _{} for subscript")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={submitChallenge}
          disabled={submitting || (!code.trim() && !textAnswer.trim())}
          className="flex items-center gap-2 px-8 py-3 dark:bg-indigo-900 text-lg"
          size="lg"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {submitting ? t('Submitting...'): t('Submit Challenge')}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <Card className={`border-2 ${result.status === 'Passed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${result.status === 'Passed' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {result.status === 'Passed' ? '✅' : '❌'} {result.status === 'Passed' ? t('Passed') : t('Failed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <strong>{t("Score Challenge")}:</strong> {result.score}/100
              </div>
              {result.feedback && (
                <div>
                  <strong>{t("Feedback Challenge")}:</strong>
                  <p className="mt-1 p-3 bg-white dark:bg-gray-800 rounded border">
                    {result.feedback}
                  </p>
                </div>
              )}
              
            </div>
          </CardContent>
        </Card>
      )}

      {/* Character Welcome Popup */}
      <CharacterWelcomePopup
        characters={characterData}
        isOpen={showCharacterPopup}
        onClose={() => {
          setShowCharacterPopup(false);
          setCharacterData(null);
        }}
        onContinue={() => {
          setShowCharacterPopup(false);
          setCharacterData(null);
        }}
      />
    </div>
  );
};

export default ChallengePage;