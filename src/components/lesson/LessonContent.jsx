import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import ReactMarkdown from 'react-markdown';
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