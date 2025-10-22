"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<{
    category: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const answers = params.get("answers");
    if (!answers) return;

    const parsed = JSON.parse(decodeURIComponent(answers)) as (
      | boolean
      | null
    )[];
    const categories = [
      "logic",
      "social",
      "art",
      "tech",
      "outdoor",
      "structure",
      "exploration",
    ];
    const scores: Record<string, number> = {};
    categories.forEach((c) => (scores[c] = 0));

    // mapping kategori tiap pertanyaan (harus sama seperti di quiz)
    const questionTypes = [
      "exploration",
      "logic",
      "art",
      "social",
      "outdoor",
      "social",
      "structure",
      "tech",
      "logic",
      "social",
    ];

    parsed.forEach((ans, i) => {
      if (ans) scores[questionTypes[i]]++;
    });

    const topCategory = Object.entries(scores).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    const descriptions: Record<string, string> = {
      logic:
        "Kamu punya minat kuat di bidang logika, analisis, dan pemecahan masalah. Cocok untuk sains, matematika, dan teknologi.",
      social:
        "Kamu senang berinteraksi dan membantu orang lain. Cocok di bidang pendidikan, komunikasi, atau layanan sosial.",
      art: "Kamu kreatif dan punya rasa estetika tinggi. Cocok untuk desain, seni, musik, atau penulisan.",
      tech: "Kamu tertarik dengan dunia teknologi dan komputer. Cocok di bidang IT, rekayasa, atau inovasi digital.",
      outdoor:
        "Kamu lebih suka aktivitas lapangan dan petualangan. Cocok di bidang lingkungan, pertanian, atau olahraga.",
      structure:
        "Kamu menyukai keteraturan dan sistem yang jelas. Cocok di bidang administrasi, keuangan, atau manajemen.",
      exploration:
        "Kamu punya rasa ingin tahu tinggi dan suka hal baru. Cocok di bidang penelitian, penemuan, dan pengembangan ide.",
    };

    setResult({
      category: topCategory,
      description: descriptions[topCategory],
    });
  }, [params]);

  if (!result)
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat hasil...
      </main>
    );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-900 px-6 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Hasil Tes Minat & Bakat
        </h1>
        <h2 className="text-xl font-semibold text-orange-500 mb-2 capitalize">
          {result.category}
        </h2>
        <p className="text-gray-700 mb-6">{result.description}</p>

        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
          Kembali ke Beranda
        </button>
      </div>
    </main>
  );
}
