import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * API Route: POST /api/seed-wa
 * 
 * Menginisialisasi dokumen default di collection "noWa" pada Firestore.
 * Jika document "nomer" belum ada, akan dibuat dengan nomor default.
 * Jika sudah ada, data tidak akan ditimpa.
 */
export async function POST() {
  try {
    const docRef = doc(db, "noWa", "nomer");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({
        success: true,
        message: "Dokumen 'noWa/nomer' sudah ada. Tidak ada perubahan.",
        data: docSnap.data(),
      });
    }

    // Buat document baru dengan nomor default
    const defaultData = {
      nomer: "6287737860657",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(docRef, defaultData);

    return NextResponse.json({
      success: true,
      message: "Dokumen 'noWa/nomer' berhasil dibuat dengan nomor default.",
      data: defaultData,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Seed WA Error:", errorMessage);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menginisialisasi data WhatsApp.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
