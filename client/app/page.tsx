import Image from "next/image";
import { SplineViewer } from "@/components/Spline";
import Navbar from "@/components/Navbar";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className=" min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <Navbar />
      <Header />
    </main>
  );
}
