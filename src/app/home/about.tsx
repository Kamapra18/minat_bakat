"use client";
import Image from "next/image";
import React from "react";

export default function AboutPage() {
  return (
    <section className="min-h-screen  text-white px-6 md:px-16 py-16 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Tentang Tes Minat Bakat
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-white/90">
            Sistem Tes Minat Bakat ini dirancang untuk membantu siswa dalam
            mengenali potensi diri mereka sejak dini. Melalui serangkaian
            pertanyaan sederhana, pengguna dapat mengetahui kecenderungan minat
            serta rekomendasi bidang yang sesuai dengan kepribadian dan bakat
            alami mereka.
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <Image
            src="/images/iPhone.png"
            alt="About illustration"
            width={550}
            height={500}
          />
        </div>
      </div>
    </section>
  );
}
