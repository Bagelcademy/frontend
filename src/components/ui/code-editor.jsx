import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/selectIndex';
import { Play, Terminal, ChevronsLeftRightEllipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      const submissionResponse = await fetch('https://judge.bagelcademy.org/submissions?base64_encoded=true', {
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
        resultResponse = await fetch(`https://judge.bagelcademy.org/submissions/${token}?base64_encoded=true`);
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
    <Card className="w-full text-left ltr:mr-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="flex gap-4 items-center">
            <Terminal className="w-5 h-5" />
            {t('Code Laboratory')}
          </div>

        </CardTitle>
        <div className="flex items-center gap-4">
          <Select
            value={codeLanguage}
            onValueChange={setCodeLanguage}
          >
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
            {/* <CardTitle className="text-sm ">{t('Output')}</CardTitle> */}

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

export default CodeEditor;
