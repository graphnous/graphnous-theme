import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * The design tokens of src/app/theme.css. The class names are written out,
 * as Tailwind only generates the classes it finds in the source.
 */
const surfaces = [
  { name: 'background', className: 'bg-background' },
  { name: 'surface', className: 'bg-surface' },
  { name: 'surface-elevated', className: 'bg-surface-elevated' },
  { name: 'border', className: 'bg-border' },
  { name: 'primary', className: 'bg-primary' },
  { name: 'primary-hover', className: 'bg-primary-hover' },
  { name: 'primary-subtle', className: 'bg-primary-subtle' },
];

const text = [
  { name: 'foreground', className: 'text-foreground' },
  { name: 'foreground-secondary', className: 'text-foreground-secondary' },
  { name: 'foreground-muted', className: 'text-foreground-muted' },
  { name: 'link', className: 'text-link' },
];

const tones = [
  { name: 'neutral', solid: 'bg-neutral text-neutral-foreground', soft: 'bg-neutral-soft text-neutral-soft-foreground' },
  { name: 'info', solid: 'bg-info text-info-foreground', soft: 'bg-info-soft text-info-soft-foreground' },
  { name: 'success', solid: 'bg-success text-success-foreground', soft: 'bg-success-soft text-success-soft-foreground' },
  { name: 'warning', solid: 'bg-warning text-warning-foreground', soft: 'bg-warning-soft text-warning-soft-foreground' },
  { name: 'error', solid: 'bg-error text-error-foreground', soft: 'bg-error-soft text-error-soft-foreground' },
];

const graph = [
  { name: 'graph-project', className: 'bg-graph-project' },
  { name: 'graph-package', className: 'bg-graph-package' },
  { name: 'graph-class', className: 'bg-graph-class' },
  { name: 'graph-method', className: 'bg-graph-method' },
  { name: 'graph-endpoint', className: 'bg-graph-endpoint' },
  { name: 'graph-external-dependency', className: 'bg-graph-external-dependency' },
  { name: 'graph-selected', className: 'bg-graph-selected' },
];

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-12 w-28 rounded-control border border-border ${className}`} />
      <code className="font-mono text-xs text-foreground-secondary">{name}</code>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground-secondary">{title}</h2>
      <div className="flex flex-wrap gap-4">{children}</div>
    </section>
  );
}

function Colors() {
  return (
    <div className="flex flex-col gap-8">
      <Section title="Surfaces and primary">
        {surfaces.map((swatch) => <Swatch key={swatch.name} {...swatch} />)}
      </Section>

      <Section title="Text">
        {text.map(({ name, className }) => (
          <div key={name} className="rounded-card border border-border bg-surface px-4 py-3">
            <p className={className}>The scan completed</p>
            <code className="font-mono text-xs text-foreground-muted">{name}</code>
          </div>
        ))}
      </Section>

      <Section title="Tones: solid and soft">
        {tones.map(({ name, solid, soft }) => (
          <div key={name} className="flex flex-col gap-2">
            <span className={`rounded-control px-3 py-1 text-sm font-medium ${solid}`}>{name}</span>
            <span className={`rounded-control px-3 py-1 text-sm font-medium ${soft}`}>{name}</span>
          </div>
        ))}
      </Section>

      <Section title="Graph">
        {graph.map((swatch) => <Swatch key={swatch.name} {...swatch} />)}
      </Section>
    </div>
  );
}

const meta = {
  title: 'Foundations/Colors',
  component: Colors,
} satisfies Meta<typeof Colors>;

export default meta;

export const Palette: StoryObj<typeof meta> = {};
