/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'strict',
});

let nextId = 0;

/**
 * Renders a mermaid chart as SVG, falls back to raw source on failure.
 * @internal
 */
export const MermaidDiagram = ({ chart }: { chart: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function render() {
      if (!containerRef.current) return;

      setError(undefined);

      try {
        const id = `mermaid-${nextId++}`;
        const { svg, bindFunctions } = await mermaid.render(id, chart);
        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }

    render();
  }, [chart]);

  if (error) {
    return (
      <pre>
        <code>{chart}</code>
      </pre>
    );
  }

  return <div ref={containerRef} />;
};
