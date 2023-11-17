import Image from "next/image";
import { SplineViewer } from "@/components/Spline";
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <main className=" min-h-screen bg-black">
      <Navbar />
      <div>
        <SplineViewer
          url="https://prod.spline.design/vGPRbbU16sxjffhb/scene.splinecode"
          eventsTarget="global"
        />
      </div>
    </main>
  );
}
