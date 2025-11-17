/*import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Save, Trash2, XCircle } from 'lucide-react';

const Notes = ({ lessonId, courseId }) => {
  const { t } = useTranslation();
  const [note, setNote] = useState('');
  const [noteId, setNoteId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNotesApi = 'https://api.tadrisino.org/courses/user-notes/get-notes/';
  const createNoteApi = 'https://api.tadrisino.org/courses/user-notes/create-note/';
  const deleteNoteApi = (noteId) => `https://api.tadrisino.org/courses/user-notes/${noteId}/delete-note/`;

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
      // Only set note content if there's actual data
      if (data && data.length > 0) {
        setNote(data[0].content);
        setNoteId(data[0].id);
      } else {
        setNote('');
        setNoteId('');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching note:', error);
      setError(t('notes.errors.fetchError'));
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
      setError(t('notes.errors.saveError'));
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
      setNoteId('');
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(t('notes.errors.fetchError'));
    }
  };

  useEffect(() => {
    fetchNote();
  }, [lessonId, courseId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('notes.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>{t('notes.loading')}</p>
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
              className="w-full mb-4 dark:text-black"
              placeholder={t('notes.placeholder')}
              
            />

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={saveNote} disabled={!note.trim()} className="dark:text-gray-800">
                    <Save className="w-4 h-4" />
                    {t('notes.buttons.save')}
                  </Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)} className="dark:text-black">
                    {t('notes.buttons.cancel')}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} className="dark:text-black">
                    {t('notes.buttons.edit')}
                  </Button>
                  <Button variant="ghost" onClick={deleteNote} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                    {t('notes.buttons.delete')}
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

export default Notes;*/





/*
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Save, Trash2, XCircle, Edit } from "lucide-react";

const Notes = ({ lessonId, courseId }) => {
  const { t } = useTranslation();
  const [noteContent, setNoteContent] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotesApi =
    "https://api.tadrisino.org/courses/user-notes/get-notes/";
  const createNoteApi =
    "https://api.tadrisino.org/courses/user-notes/create-note/";
  const updateNoteApi = (id) =>
    `https://api.tadrisino.org/courses/user-notes/${id}/update-note/`;
  const deleteNoteApi = (id) =>
    `https://api.tadrisino.org/courses/user-notes/${id}/delete-note/`;

  // 📥 دریافت نوت‌ها
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(fetchNotesApi, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: parseInt(courseId),
          lesson: parseInt(lessonId),
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(t("notes.errors.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  // 💾 ذخیره یا ویرایش نوت
  const saveNote = async () => {
    if (!noteContent.trim()) return;
    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");
      const isUpdate = !!noteId;
      const url = isUpdate ? updateNoteApi(noteId) : createNoteApi;

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: parseInt(courseId),
          lesson: parseInt(lessonId),
          title: new Date().toLocaleString(),
          content: noteContent,
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      // پاک کردن فرم و بروزرسانی لیست
      
      
      await fetchNotes();
      setError(null);
    } catch (err) {
      console.error("Error saving note:", err);
      setError(t("notes.errors.saveError"));
    } finally {
      setSaving(false);
    }
  };

  // 🗑️ حذف نوت
  const deleteNote = async (id) => {
    if (!window.confirm(t("notes.confirmDelete"))) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(deleteNoteApi(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      await fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
      setError(t("notes.errors.deleteError"));
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [lessonId, courseId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("notes.title")}</CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* ✏️ فرم ایجاد / ویرایش *//*}
        <div className="mb-6">
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder={t("notes.placeholder")}
            className="mb-3 dark:text-black"
          />

          <div className="flex gap-2">
            <Button onClick={saveNote} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {noteId ? t("notes.buttons.update") : t("notes.buttons.save")}
            </Button>

            {noteId && (
              <Button
                variant="ghost"
                onClick={() => {
                 
                  setNoteContent("");
                }}
              >
                {t("notes.buttons.cancel")}
              </Button>
            )}
          </div>
        </div>

        {/* 🗒️ لیست نوت‌ها *//*}
        {loading ? (
          <p>{t("notes.loading")}</p>
        ) : notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{item.title}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setNoteId(item.id);
                        setNoteContent(item.content);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => deleteNote(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">{t("notes.noNotes")}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Notes;*/




















import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Save, Trash2, XCircle, Edit } from "lucide-react";

const Notes = ({ lessonId, courseId }) => {
  const { t } = useTranslation();
  const [noteContent, setNoteContent] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isTextareaOpen, setIsTextareaOpen] = useState(false);

  const fetchNotesApi =
    "https://api.tadrisino.org/courses/user-notes/get-notes/";
  const createNoteApi =
    "https://api.tadrisino.org/courses/user-notes/create-note/";
  const deleteNoteApi = (id) =>
    `https://api.tadrisino.org/courses/user-notes/${id}/delete-note/`;

  // 📥 دریافت نوت‌ها
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(fetchNotesApi, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: parseInt(courseId),
          lesson: parseInt(lessonId),
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(t("notes.errors.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  // 💾 ذخیره یا ویرایش نوت
  const saveNote = async () => {
    if (!noteContent.trim()) return;
    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");

      // اگر در حالت ویرایش هستیم، ابتدا نوت قبلی را حذف کن
      if (noteId) {
        await deleteNote(noteId, false); // حذف بدون تأیید کاربر
      }

      // ایجاد نوت جدید
      const response = await fetch(createNoteApi, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: parseInt(courseId),
          lesson: parseInt(lessonId),
          title: new Date().toLocaleString(),
          content: noteContent,
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      // پاک کردن فرم و بروزرسانی لیست
      setNoteContent("");
      setNoteId(null);
      await fetchNotes();
      setError(null);
      setIsTextareaOpen(false); // بستن Textarea بعد از ذخیره
    } catch (err) {
      console.error("Error saving note:", err);
      setError(t("notes.errors.saveError"));
    } finally {
      setSaving(false);
    }
  };

  // 🗑️ حذف نوت
  const deleteNote = async (id, withConfirm = true) => {
    if (withConfirm && !window.confirm(t("notes.confirmDelete"))) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(deleteNoteApi(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      await fetchNotes();
      setNoteContent("");
      setNoteId(null);
      setIsTextareaOpen(notes.length <= 1); // اگر آخرین نوت حذف شد، باز کن
    } catch (err) {
      console.error("Error deleting note:", err);
      setError(t("notes.errors.deleteError"));
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [lessonId, courseId]);

  useEffect(() => {
    // اگر نوت وجود دارد، Textarea بسته باشد، در غیر این صورت باز
    if (notes.length > 0) {
      setIsTextareaOpen(false);
    } else {
      setIsTextareaOpen(true);
    }
  }, [notes]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("notes.title")}</CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* ✏️ فرم ایجاد / ویرایش */}
        {isTextareaOpen && (
          <div className="mb-6">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={t("notes.placeholder")}
              className="mb-3 dark:text-black"
            />

            <div className="flex gap-2 text-green-200">
              <Button 
              onClick={saveNote} 
              disabled={saving}
              className="bg-green-700 dark:bg-green-900">
                <Save className="w-4 h-4 mr-2 " />
                {noteId ? t("notes.buttons.save") : t("notes.buttons.save")}
              </Button>

              {noteId && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setNoteContent("");
                    setNoteId(null);
                    setIsTextareaOpen(false); // بستن Textarea در Cancel
                  }}
                >
                  {t("notes.buttons.cancel")}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 🗒️ لیست نوت‌ها */}
        {loading ? (
          <p>{t("notes.loading")}</p>
        ) : notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{item.title}</span>
                  <div className="flex gap-2 dark:text-black">
                    <Button
                      size="sm"
                      variant="ghost"
                      
                      onClick={() => {
                        setNoteId(item.id);
                        setNoteContent(item.content);
                        setIsTextareaOpen(true); // باز کردن Textarea برای ویرایش
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => deleteNote(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">{t("notes.noNotes")}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Notes;




























































