import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Save, Trash2, XCircle } from 'lucide-react';

const Notes = ({ lessonId, courseId }) => {
  const [note, setNote] = useState('');
  const [noteId, setnoteId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);



  
  const fetchNotesApi = 'https://bagelapi.bagelcademy.org/courses/user-notes/get-notes/';
  const createNoteApi = 'https://bagelapi.bagelcademy.org/courses/user-notes/create-note/';
  const deleteNoteApi = (noteId) => `https://bagelapi.bagelcademy.org/courses/user-notes/${noteId}/delete-note/`;

  const fetchNote = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(fetchNotesApi, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: parseInt(courseId),
          lesson: parseInt(lessonId),
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setNote(data?.[0].content || '');
      setnoteId(data?.[0].id)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching note:', error);
      setError('Failed to fetch note. Please try again.');
      setLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(createNoteApi, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: parseInt(courseId),
          lesson: parseInt(lessonId),
          title: new Date().toLocaleString(),
          content: note,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note. Please try again.');
    }
  };

  const deleteNote = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(deleteNoteApi(noteId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      setNote('');
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note. Please try again.');
    }
  };

  useEffect(() => {
    fetchNote();
  }, [lessonId, courseId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lesson Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && (
              <div className="text-red-500 text-sm mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={!isEditing}
              className="w-full mb-4"
              placeholder="Add your note here..."
            />

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={saveNote} disabled={!note.trim()}>
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={deleteNote} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Notes;
