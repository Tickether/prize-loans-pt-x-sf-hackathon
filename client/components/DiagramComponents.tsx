"use client";
import { useEffect, useState } from "react";
import mermaid, { RenderResult } from "mermaid";

const DiagramComponent: React.FC = () => {
  const diagramCode = `
    graph TD
      A[Square Rect] -- Link text --> B((Circle))
      A --> C(Round Rect)
      B --> D{Rhombus}
      C --> D
  `;
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      /* configuration options */
    });

    mermaid
      .render("graph", diagramCode)
      .then((result: RenderResult) => {
        setHtml(result.toString());
      })
      .catch((error) => {
        console.error("Error rendering diagram:", error);
      });
  }, [diagramCode]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default DiagramComponent;
