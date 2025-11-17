/*import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/selectIndex';
import { Play, Terminal, ChevronsLeftRightEllipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Listbox } from '@headlessui/react';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const { t } = useTranslation();

  const languageIds = {
    python: 71, // Python 3
    java: 62,   // Java
  };

  const executeCode = async () => {
    setIsExecuting(true);
    try {
      // Step 1: Submit the code to Judge0
      const submissionResponse = await fetch('https://judge.tadrisino.org/submissions?base64_encoded=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: btoa(code), // Base64 encode the source code
          language_id: languageIds[codeLanguage],
        }),
      });

      const submission = await submissionResponse.json();
      if (!submission.token) {
        throw new Error('Failed to create submission');
      }

      // Step 2: Poll Judge0 for the result
      const token = submission.token;
      let resultResponse;
      let result;

      do {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        resultResponse = await fetch(`https://judge.tadrisino.org/submissions/${token}?base64_encoded=true`);
        result = await resultResponse.json();
      } while (resultResponse.status === 204); // Status 204 indicates processing

      // Step 3: Decode and display the result
      const decodedOutput = atob(result.stdout || result.stderr || 'No output');
      setCodeOutput(decodedOutput);
    } catch (error) {
      setCodeOutput('Execution failed: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="w-full text-left ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="flex gap-4 items-center">
            <Terminal className="w-5 h-5" />
            {t('Code Laboratory')}
          </div>

        </CardTitle>
        <div className="flex items-center gap-4 ">
        <Button
            onClick={executeCode}
            disabled={isExecuting || !code.trim()}
            className="flex items-center gap-2 bg-gray-800 text-white"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? t('Running...') : t('Execute')}
            </Button>
          <Select
            value={codeLanguage}
            onValueChange={setCodeLanguage}
          >
            
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('Language')} className="text-black dark:text-black"/>
            </SelectTrigger>
           
            <SelectContent className="bg-white text-black border border-gray-200 shadow-md w-32 text-right">
            
              <SelectItem value="python" className="text-right">{t('Python')}</SelectItem>
              <SelectItem value="java" className="text-right" >{t('Java')}</SelectItem>
             
            </SelectContent>
           
          </Select>
         
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
            {/* <CardTitle className="text-sm ">{t('Output')}</CardTitle> *//*}

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
  );
};

export default CodeEditor;*/











import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';

import { Play, Terminal, ChevronsLeftRightEllipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const CustomListbox = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-32 text-right">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center justify-between w-full border border-gray-300 bg-white dark:bg-gray-900 text-black dark:text-white px-3 py-2 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span>{t(value.label)}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 z-10 mt-2 w-full bg-gray-400 dark:text-black rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`block w-full text-right px-4 py-2 text-sm bg-gray-600 dark:bg-gray-800 text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-900 ${
                  option.value === value.value ? 'font-semibold text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{t(option.label)}</span>
                  {option.value === value.value && <Check className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [language, setLanguage] = useState({ label: 'Python', value: 'python' });

  const { t } = useTranslation();

  const languageIds = {
    python: 71, // Python 3
    java: 62,   // Java
  };

  
      // Step 1: Submit the code to Judge0
      const executeCode = async () => {
        setIsExecuting(true);
        try {
          // Step 1: Submit the code to Judge0
          const submissionResponse = await fetch('https://judge.tadrisino.org/submissions?base64_encoded=true', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source_code: btoa(code), // Base64 encode the source code
              language_id: languageIds[language.value],
            }),
          });
    
          const submission = await submissionResponse.json();
          if (!submission.token) {
            throw new Error('Failed to create submission');
          }
    
          // Step 2: Poll Judge0 for the result
          const token = submission.token;
          let resultResponse;
          let result;
    
          do {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
            resultResponse = await fetch(`https://judge.tadrisino.org/submissions/${token}?base64_encoded=true`);
            result = await resultResponse.json();
          } while (resultResponse.status === 204); // Status 204 indicates processing
    
          // Step 3: Decode and display the result
          const decodedOutput = atob(result.stdout || result.stderr || 'No output');
          setCodeOutput(decodedOutput);
        } catch (error) {
          setCodeOutput('Execution failed: ' + error.message);
        } finally {
          setIsExecuting(false);
        }
      };
    

  return (
    <Card className="w-full text-left ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="flex gap-4 items-center">
            <Terminal className="w-5 h-5" />
            {t('Code Laboratory')}
          </div>

        </CardTitle>
        <div className="flex items-center gap-4 ">
        <Button
            onClick={executeCode}
            disabled={isExecuting || !code.trim()}
            className="flex items-center gap-2 bg-gray-800 text-white"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? t('Running...') : t('Execute')}
            </Button>
            <CustomListbox
              value={language}
              onChange={setLanguage}
              className={`text-white bg-gray-200`}
              options={[
                { label: 'Python', value: 'python' },
                { label: 'Java', value: 'java' },
              ]}
            />

        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card className="border-2">
          <CodeMirror
            value={code}
            height="400px"
            extensions={[language.value === 'python' ? python() : java()]}

            onChange={(value) => setCode(value)}
            theme="dark"
            className="rounded-lg ltr:ml-1 text-left"
          />
        </Card>
        <Card>
          <CardHeader>
            {/* <CardTitle className="text-sm ">{t('Output')}</CardTitle> */}

            <div className="flex gap-4 items-center">
            <ChevronsLeftRightEllipsis className="w-5 h-5" />
            {t('Output')}
          </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg min-h-[100px] max-h-[200px] overflow-auto" dir='ltr'>
              {codeOutput || 'No output yet'}
            </pre>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
