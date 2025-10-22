"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  "/images/kata7.jpg",
  "/images/kata6.jpg",
  "/images/kata2.jpg",
  "/images/kata5.jpg",
  "/images/kata4.jpg",
  "/images/kata3.jpg",
  "/images/kata1.jpg",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center justify-center stext-white px-6 md:px-20 py-10">
      <div className="flex-1 md:pr-10 space-y-4">
        <h1 className="text-2xl md:text-4xl text-white font-bold leading-snug">
          Bingung dengan Masa Depan? Ikut Aja Tes Minat Bakat!
          <span className="underline text-orange-400"> GRATIS</span>
        </h1>

        <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-md">
          Lebih dari <span className="font-bold">180.000 siswa</span> dari{" "}
          <span className="font-bold">13.000 sekolah</span> telah menemukan
          jurusan dan karier yang cocok melalui Tes Minat Bakat berbasis sistem
          pakar. Sekarang giliran kamu, <em>yuk</em> coba sekarang dan lihat
          langsung hasilnya!
        </p>

        <Link
          href="/quiz"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition">
          Ikuti Tes Minat Bakat!
        </Link>
      </div>

      <div className="flex-1 mt-10 md:mt-0 flex justify-center">
        <div className="relative w-full md:w-4/5 aspect-video rounded-xl overflow-hidden shadow-lg">
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`kata ${index + 1}`}
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
