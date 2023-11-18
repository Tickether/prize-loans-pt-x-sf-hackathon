import Image from "next/image";
import { SplineViewer } from "@/components/Spline";
import Navbar from "@/components/Navbar";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className=" min-h-screen bg-black">
      <Navbar />
      <Header />
    </main>
  );
}
