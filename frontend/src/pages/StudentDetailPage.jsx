import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bot, CalendarDays, LoaderCircle, SendHorizontal, UserCircle2 } from "lucide-react";
import Skeleton from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import { analyzeStudent, fetchStudentById } from "../services/api";

function generateFallbackResponse(student) {
  const marks = student?.subjectMarks || [];
  if (!marks.length) {
    return "Focus on consistent daily practice and review weak concepts with short revision blocks.";
  }

  const strongestSubject = [...marks].sort((a, b) => b.marks - a.marks)[0];
  const weakestSubject = [...marks].sort((a, b) => a.marks - b.marks)[0];
  return `Based on ${student.name}'s profile, reinforce ${weakestSubject.subject} with two short revision blocks daily and maintain advanced practice in ${strongestSubject.subject}.`;
}

function StudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoadingStudent, setIsLoadingStudent] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    async function loadStudent() {
      if (!studentId) {
        setIsLoadingStudent(false);
        setStudent(null);
        return;
      }

      setIsLoadingStudent(true);
      setLoadError("");
      try {
        const result = await fetchStudentById(studentId);
        setStudent(result);
      } catch {
        setStudent(null);
        setLoadError("Unable to fetch student details from backend.");
      } finally {
        setIsLoadingStudent(false);
      }
    }

    loadStudent();
  }, [studentId]);

  useEffect(() => {
    if (!student) {
      setMessages([]);
      return;
    }

    setMessages([
      {
        id: `intro-${student.id}`,
        role: "assistant",
        text: `Hi, I am your AI academic assistant. Ask me anything about ${student.name}'s attendance, marks, and study strategy.`,
      },
    ]);
  }, [student]);

  useEffect(() => {
    if (!chatScrollRef.current) {
      return;
    }
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages, isSending]);

  const attendanceValue = student?.attendanceValue ?? 0;

  const submitMessage = async () => {
    const text = messageInput.trim();
    if (!text || !student || isSending) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setIsSending(true);

    try {
      const response = await analyzeStudent(student.id, text);
      const assistantText = response?.answer?.trim() || generateFallbackResponse(student);
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", text: assistantText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `assistant-fallback-${Date.now()}`, role: "assistant", text: generateFallbackResponse(student) },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    await submitMessage();
  };

  if (isLoadingStudent) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
        <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <LoaderCircle className="animate-spin" size={14} />
          Loading student profile...
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </section>
    );
  }

  if (!student) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{loadError || "Profile not found"}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Student record unavailable</h2>
        <Link className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900" to="/students">
          Back to Students
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        to="/students"
      >
        <ArrowLeft size={15} />
        Back to Students
      </Link>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-2">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
            <div className="bg-gradient-to-r from-brand-600 to-cyan-500 px-5 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Student Profile</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold">
                  {student.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{student.name}</h2>
                  <p className="text-sm text-blue-100">{student.cohort}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Email</span>
                <span className="font-medium text-slate-900 dark:text-white">{student.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Risk status</span>
                <StatusBadge status={student.status || (student.risk === "Low" ? "Good" : "Risk")} compact />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">AI sessions</span>
                <span className="font-semibold text-slate-900 dark:text-white">{student.sessions}</span>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays size={16} className="text-brand-600 dark:text-brand-300" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Attendance</h3>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Current rate</span>
                <span className="font-bold text-slate-900 dark:text-white">{student.attendance}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400 transition-all duration-500"
                  style={{ width: `${attendanceValue}%` }}
                />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Subject Marks</h3>
            <ul className="mt-4 space-y-3">
              {student.subjectMarks.map((item) => (
                <li key={item.subject}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{item.subject}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{item.marks}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400 transition-all duration-500"
                      style={{ width: `${item.marks}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className="flex h-[720px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark xl:col-span-3">
          <div className="border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center gap-2">
              <Bot size={17} className="text-brand-600 dark:text-brand-300" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Academic Chat</h3>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Ask for interventions, study plans, or parent-ready summaries.</p>
          </div>

          <div ref={chatScrollRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50/80 p-5 scroll-smooth dark:bg-slate-950/40">
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "rounded-br-md bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })}

            {isSending ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  Thinking...
                </div>
              </div>
            ) : null}
          </div>

          <form className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" onSubmit={handleSendMessage}>
            <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-500 dark:border-slate-700 dark:bg-slate-800/80">
              <UserCircle2 size={18} className="mb-1 text-slate-400" />
              <textarea
                className="h-10 max-h-28 min-h-[40px] flex-1 resize-y bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                onChange={(event) => setMessageInput(event.target.value)}
                onKeyDown={async (event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    await submitMessage();
                  }
                }}
                placeholder={`Ask about ${student.name}'s performance...`}
                value={messageInput}
              />
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSending || !messageInput.trim()}
                type="submit"
              >
                <SendHorizontal size={15} />
              </button>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}

export default StudentDetailPage;
