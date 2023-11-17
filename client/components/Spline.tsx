"use client";
import React, { useRef, useEffect, useState, memo } from "react";

// export default function Threed() {
//   return (
//     <Spline scene="https://prod.spline.design/LgYxjBYA3hz0em38/scene.splinecode" />
//   );
// }

{
  /* <script type="module" src="https://unpkg.com/@splinetool/viewer@0.9.490/build/spline-viewer.js"></script>
<spline-viewer loading-anim url="https://prod.spline.design/bmRAIQO71E7fzHFX/scene.splinecode"></spline-viewer> */
}

interface SplineViewerProps {
  url?: string;
  eventsTarget: "global" | "local";
}

const SplineViewer: React.FC<SplineViewerProps> = ({ url, eventsTarget }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const defaultUrl =
    "https://prod.spline.design/vGPRbbU16sxjffhb/scene.splinecode";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.defer = true;
    script.src =
      "https://unpkg.com/@splinetool/viewer@0.9.490/build/spline-viewer.js";
    script.onload = () => {
      if (viewerRef.current?.children.length === 0 && isMounted) {
        const viewer = document.createElement("spline-viewer");
        viewer.setAttribute("url", url || defaultUrl);
        viewer.setAttribute("events-target", eventsTarget);
        viewer.setAttribute("loading-anim", "true");
        viewerRef.current.appendChild(viewer);

        viewerRef.current.children[0].shadowRoot
          ?.querySelectorAll("#logo")[0]
          ?.remove();
      }

      document.getElementById("logo")?.remove();
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, eventsTarget, isMounted]);

  return <div ref={viewerRef} />;
};

export { SplineViewer };
