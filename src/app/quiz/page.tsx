// quiz/page.tsx - UPDATE
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  { text: "Apakah kamu senang mencoba hal-hal baru?", type: "exploration" },
  {
    text: "Apakah kamu suka mencari tahu cara kerja suatu benda?",
    type: "logic",
  },
  { text: "Apakah kamu sering punya ide kreatif?", type: "art" },
  {
    text: "Apakah kamu mudah bergaul dan suka berbicara dengan orang baru?",
    type: "social",
  },
  { text: "Apakah kamu lebih suka kegiatan di luar ruangan?", type: "outdoor" },
  {
    text: "Apakah kamu menikmati membantu teman yang kesulitan belajar?",
    type: "social",
  },
  {
    text: "Apakah kamu lebih suka tugas yang jelas dan teratur?",
    type: "structure",
  },
  {
    text: "Apakah kamu tertarik mempelajari teknologi atau komputer?",
    type: "tech",
  },
  { text: "Apakah kamu mudah fokus saat memecahkan teka-teki?", type: "logic" },
  { text: "Apakah kamu senang bekerja dalam kelompok?", type: "social" },
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    Array(questions.length).fill(null)
  );
  const router = useRouter();

  const handleAnswer = (value: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);

    // Simpan ke localStorage
    localStorage.setItem('quizAnswers', JSON.stringify(newAnswers));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Redirect tanpa parameter URL yang berantakan
      router.push("/result");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-blue-900 flex flex-col items-center justify-center px-4">
      <h1 className="text-white text-4xl py-10">Tes Minat Bakat</h1>
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 relative">
        <div className="absolute top-4 right-4 w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}></div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Pertanyaan {currentIndex + 1} dari {questions.length}
        </h2>
        <p className="text-gray-700 text-base mb-6">
          {questions[currentIndex].text}
        </p>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`font-semibold transition ${
              currentIndex === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-700 hover:underline"
            }`}>
            Sebelumnya
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg">
              Ya
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg">
              Tidak
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}