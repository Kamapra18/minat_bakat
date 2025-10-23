// result/page.tsx - PERBAIKAN
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ResultPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<{
    category: string;
    description: string;
    scores: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateResult = async () => {
      const answers = params.get("answers");
      console.log('📥 Raw answers from URL:', answers);
      
      if (!answers) {
        setError("No answers found in URL");
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(decodeURIComponent(answers)) as (boolean | null)[];
        console.log('📊 Parsed answers:', parsed);

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

        console.log('🎯 Calculated scores:', scores);

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

        console.log('🏆 Final result:', resultData);
        setResult(resultData);
        
        // Save to database
        await saveToDatabase(resultData, parsed);
        
      } catch (err) {
        console.error('❌ Error processing result:', err);
        setError("Error processing quiz results");
      } finally {
        setLoading(false);
      }
    };

    calculateResult();
  }, [params]);

  const saveToDatabase = async (resultData: any, answers: (boolean | null)[]) => {
    try {
      console.log('💾 Starting database save...');
      
      // Clean the answers array - convert null to false
      const cleanAnswers = answers.map(answer => answer === true);
      console.log('🧹 Cleaned answers:', cleanAnswers);

      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('quiz_results')
        .select('count')
        .limit(1);
      
      console.log('🔌 Connection test:', { testData, testError });

      if (testError) {
        console.error('❌ Database connection failed:', testError);
        setError(`Database connection failed: ${testError.message}`);
        return;
      }

      // Prepare data for insertion
      const insertData = {
        category: resultData.category,
        description: resultData.description,
        scores: resultData.scores,
        answers: cleanAnswers, // Use the cleaned array
        created_at: new Date().toISOString()
      };

      console.log('📤 Data to insert:', insertData);

      // Insert data
      const { data, error } = await supabase
        .from('quiz_results')
        .insert([insertData])
        .select();

      console.log('📥 Insert response:', { data, error });

      if (error) {
        console.error('❌ Database insert error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(`Failed to save: ${error.message}`);
      } else {
        console.log('✅ Successfully saved to database:', data);
        setSaved(true);
      }
    } catch (err) {
      console.error('💥 Unexpected error:', err);
      setError("Unexpected error occurred");
    }
  };

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

  if (error || !result) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">❌ {error || "Terjadi kesalahan dalam memproses hasil."}</p>
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-900 px-6 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
        {saved ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✅ Hasil berhasil disimpan ke database!
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            ⚠️ Hasil tidak tersimpan ke database
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