import { useMemo } from 'react'

/**
 * Minimal HTML highlighter. The source is escaped first and only then wrapped
 * in spans, so nothing in the generated document can inject markup here.
 */
function highlight(source: string): string {
  const escaped = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-comment">$1</span>')
    .replace(
      /(&lt;\/?)([a-zA-Z][\w-]*)/g,
      '$1<span class="tok-tag">$2</span>',
    )
    .replace(/([a-zA-Z-]+)(=)(&quot;[^&]*?&quot;)/g, '<span class="tok-attr">$1</span>$2<span class="tok-string">$3</span>')
}

export function CodeView({ html }: { html: string }) {
  const lines = useMemo(() => html.split('\n'), [html])
  const marked = useMemo(() => lines.map(highlight), [lines])

  return (
    <div className="scroll-x h-full overflow-y-auto bg-panel [--tok-comment:var(--color-ink-faint)]">
      <table className="w-full border-collapse font-mono text-[0.75rem] leading-[1.7]">
        <tbody>
          {marked.map((line, index) => (
            <tr key={index} className="align-baseline">
              <td className="num sticky left-0 w-12 border-r border-edge bg-tint px-2 text-right text-ink-faint select-none">
                {index + 1}
              </td>
              <td className="py-0 pl-4 whitespace-pre text-ink-soft">
                <span
                  className="[&_.tok-attr]:text-violet [&_.tok-comment]:text-ink-faint [&_.tok-comment]:italic [&_.tok-string]:text-good [&_.tok-tag]:font-medium [&_.tok-tag]:text-ink"
                  dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
