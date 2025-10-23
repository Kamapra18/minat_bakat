// result/page.tsx - UPDATE
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<{
    category: string;
    description: string;
    scores: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const calculateResult = async () => {
      // Ambil dari localStorage, bukan URL
      const savedAnswers = localStorage.getItem('quizAnswers');
      
      if (!savedAnswers) {
        console.log('No answers found in localStorage');
        router.push("/"); // Redirect ke home jika tidak ada data
        return;
      }

      const parsed = JSON.parse(savedAnswers) as (boolean | null)[];
      console.log('Answers from localStorage:', parsed);

      const categories = [
        "logic", "social", "art", "tech", "outdoor", "structure", "exploration",
      ];
      const scores: Record<string, number> = {};
      categories.forEach((c) => (scores[c] = 0));

      const questionTypes = [
        "exploration", "logic", "art", "social", "outdoor", 
        "social", "structure", "tech", "logic", "social",
      ];

      parsed.forEach((ans, i) => {
        if (ans === true) scores[questionTypes[i]]++;
      });

      const topCategory = Object.entries(scores).sort(
        (a, b) => b[1] - a[1]
      )[0][0];

      const descriptions: Record<string, string> = {
        logic: "Kamu punya minat kuat di bidang logika, analisis, dan pemecahan masalah. Cocok untuk sains, matematika, dan teknologi.",
        social: "Kamu senang berinteraksi dan membantu orang lain. Cocok di bidang pendidikan, komunikasi, atau layanan sosial.",
        art: "Kamu kreatif dan punya rasa estetika tinggi. Cocok untuk desain, seni, musik, atau penulisan.",
        tech: "Kamu tertarik dengan dunia teknologi dan komputer. Cocok di bidang IT, rekayasa, atau inovasi digital.",
        outdoor: "Kamu lebih suka aktivitas lapangan dan petualangan. Cocok di bidang lingkungan, pertanian, atau olahraga.",
        structure: "Kamu menyukai keteraturan dan sistem yang jelas. Cocok di bidang administrasi, keuangan, atau manajemen.",
        exploration: "Kamu punya rasa ingin tahu tinggi dan suka hal baru. Cocok di bidang penelitian, penemuan, dan pengembangan ide.",
      };

      const resultData = {
        category: topCategory,
        description: descriptions[topCategory],
        scores: scores,
      };

      setResult(resultData);
      
      // Save to database
      await saveToDatabase(resultData, parsed);
      
      // Clear localStorage setelah save
      localStorage.removeItem('quizAnswers');
      
      setLoading(false);
    };

    calculateResult();
  }, [router]);

  const saveToDatabase = async (resultData: any, answers: (boolean | null)[]) => {
    try {
      console.log('💾 Saving to database...');

      // Clean answers - convert null to false
      const cleanAnswers = answers.map(answer => answer === true);

      const insertData = {
        category: resultData.category,
        description: resultData.description,
        scores: resultData.scores,
        answers: cleanAnswers,
        created_at: new Date().toISOString()
      };

      console.log('📤 Insert data:', insertData);

      const { data, error } = await supabase
        .from('quiz_results')
        .insert([insertData])
        .select();

      if (error) {
        console.error('❌ Database error:', error);
      } else {
        console.log('✅ Saved successfully:', data);
        setSaved(true);
      }
    } catch (error) {
      console.error('💥 Unexpected error:', error);
    }
  };

  // ... (rest of the component remains the same)
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Memproses hasil dan menyimpan data...</p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center">
          <p>Terjadi kesalahan dalam memproses hasil.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Kembali ke Beranda
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-900 px-6 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
        {saved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✅ Hasil berhasil disimpan!
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Hasil Tes Minat & Bakat
        </h1>
        <h2 className="text-xl font-semibold text-orange-500 mb-2 capitalize">
          {result.category}
        </h2>
        <p className="text-gray-700 mb-6">{result.description}</p>

        <div className="mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">Detail Skor:</h3>
          {Object.entries(result.scores).map(([category, score]) => (
            <div key={category} className="flex justify-between items-center mb-2">
              <span className="capitalize text-gray-600">{category}:</span>
              <span className="font-semibold text-black">{score}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Kembali ke Beranda
        </button>
      </div>
    </main>
  );
}