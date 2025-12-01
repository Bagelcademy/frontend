import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import LessonAudio from './LessonAudio';

const LessonContent = ({ lesson, audioProps, t }) => {
  return (
    <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{lesson?.title}</CardTitle>
                  <LessonAudio {...audioProps} />
                  {/* Enhanced Audio Section */}
                  
                </CardHeader>
                
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown className="text-justify"
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const content = String(children).trim();
                          // Check for LaTeX block math ($$...$$ or \[...\])
                          if (!inline && (
                            (content.startsWith('$$') && content.endsWith('$$')) ||
                            (content.startsWith('\\[') && content.endsWith('\\]'))
                          )) {
                            const math = content.startsWith('$$') 
                              ? content.slice(2, -2) 
                              : content.slice(2, -2);
                            return (
                              <BlockMath math={math} />
                            );
                          }
                          // Check for LaTeX inline math ($...$ or \(...\))
                          if (inline && (
                            (content.startsWith('$') && content.endsWith('$')) ||
                            (content.startsWith('\\(') && content.endsWith('\\)'))
                          )) {
                            const math = content.startsWith('$') 
                              ? content.slice(1, -1) 
                              : content.slice(2, -2);
                            return <InlineMath math={math} />;
                          }
                          return inline ? (
                            <code {...props}>{children}</code>
                          ) : (
                            <pre
                              style={{
                                direction: "ltr",
                                textAlign: "left",
                              }}
                              {...props}
                            >
                              <code>{children}</code>
                            </pre>
                          );
                        },
                      }}
                    >
                      {lesson?.content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
              );
            };
            
            export default LessonContent;