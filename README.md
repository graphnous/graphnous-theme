# graphnous-theme

The Graphnous component library: React components styled with Tailwind CSS,
and the Tailwind theme they use (the GraphNous colour palette, fonts and
corner radii). The components only render what they are given; they do not
fetch data, read the URL or know the API. That stays in the apps, such as
[`graphnous-ui`](../graphnous-ui) and the platform's web app.

It comes two ways:

- **Published**, as `@graphnous/theme` on GitHub Packages: the components
  compiled to JavaScript, with their types and the theme's CSS (see
  [Publishing](#publishing)).
- **As TypeScript source**, through the npm workspace at the root of this
  repository, which is how `graphnous-ui` and the platform's web app use it
  for now; the app compiles it.

It needs React 19.2 and Tailwind CSS 4, and an app with a bundler, such as
Next.js or Vite.

## Installing it

From GitHub Packages, with a token that can read packages, in the app's
`.npmrc`:

```ini
@graphnous:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Install it under the name `graphnous-theme`, so imports read the same as
in the workspace:

```bash
npm install graphnous-theme@npm:@graphnous/theme@^0.1.0
```

In this repository's workspace, `npm ci` at the root links it into the apps;
a Next.js app then lists it in `transpilePackages`, as it is TypeScript. The
published package is compiled, and needs neither.

## Using it

Import the theme after Tailwind, in the app's CSS:

```css
@import "tailwindcss";
@import "graphnous-theme/theme.css";
```

It brings the design tokens, the base styles (the page's background and
text, focus rings), and an `@source` for the components, so Tailwind
generates the classes they use.

Then import the components:

```tsx
import { Button, Card, CardBody, StatusIndicator } from "graphnous-theme";
```

The fonts are Geist and Geist Mono, which the app loads and sets as
`--font-geist-sans` and `--font-geist-mono`, such as with `next/font`.

Links (Link, ButtonLink, Breadcrumbs, NavItem) are plain anchors, unless a
`LinkProvider` gives them the router's link component. In a Next.js app, put
it in a client component:

```tsx
"use client";

import NextLink from "next/link";
import { LinkProvider } from "graphnous-theme";

export function AppLinkProvider({ children }: { children: React.ReactNode }) {
  return <LinkProvider component={NextLink}>{children}</LinkProvider>;
}
```

## Design tokens

Colours, fonts and corner radii are Tailwind theme variables in
`src/theme.css`, from the GraphNous colour palette (dark mode first).
Components use their semantic utilities, such as `bg-surface`,
`text-foreground-secondary` or `bg-success-soft`, rather than colours.
Statuses map onto the five tones: `neutral`, `info`, `success`, `warning`
and `error`. The page follows the system's colour scheme;
`data-theme="light"` or `"dark"` forces one.

## Components

In `src/components/<layer>/<Component>/`, with their stories next to them:

| Layer | Components |
| --- | --- |
| `ui` | Badge, Button, ButtonLink, Code, CodeBlock, Divider, Heading, Icon, IconButton, Link, LinkProvider, Spinner, Text, VisuallyHidden |
| `layout` | AppShell, Breadcrumbs, Card, Container, PageHeader, Section, Sidebar, Stack, Inline, Tabs |
| `feedback` | Alert, EmptyState, ErrorState, ProgressBar, Skeleton, Toast, Tooltip |
| `overlays` | ConfirmDialog, Dialog, Drawer, Menu, Popover |
| `forms` | Checkbox, Combobox, Field, FileDrop, Form, RadioGroup, SearchInput, Select, Switch, TextArea, TextInput |
| `data` | CopyButton, DescriptionList, Duration, LogViewer, Pagination, StatusIndicator, Table, Timeline, Timestamp, Truncate |

The package also exports `cn`, which joins class names so a component's
classes can be overridden, and the formatters the components use
(`formatBytes`, `formatDateTime`, `formatDuration`, `formatRelative`,
`formatTime`). [`graphnous-ui/COMPONENTS.md`](../graphnous-ui/COMPONENTS.md)
describes each component and what is still to build.

## Developing

Install from the root of the repository, which also links the package into
the apps:

```bash
npm ci
```

Then, in this folder:

| Command | What it does |
| --- | --- |
| `npm run storybook` | Storybook, at http://localhost:6007 |
| `npm run test:storybook` | Every story as a test, with its accessibility checks, in light and in dark |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run build` | The package as it is published, in `dist` (see [Publishing](#publishing)) |
| `npm run build-storybook` | Storybook as a static site, in `storybook-static` |

The toolbar switches between light and dark. *Foundations/Colors* shows
every design token.

A new component gets stories for its states, with `play` functions that
check what it does; they are its tests. Accessibility violations fail them.

## Visual tests

[Chromatic](https://www.chromatic.com) snapshots every story in light and
in dark (its modes, in `.storybook/preview.tsx`) and compares them with the
accepted snapshots. On a pull request, changes wait for review in Chromatic,
and its UI Tests check shows whether they are accepted; on main, they become
the new baselines. The Chromatic workflow needs the `CHROMATIC_KEY` secret:
the Chromatic project's token.

## Publishing

`npm run build` makes the package in `dist`:

- the components compiled to JavaScript, with their type declarations and
  source maps, in `src`'s folders (`tsconfig.build.json`), without the
  stories;
- `theme.css`, whose `@source` finds the compiled components next to it, so
  Tailwind generates their classes in the app;
- its `package.json` (`scripts/package.mjs`), as `@graphnous/theme`: GitHub
  Packages only takes packages scoped to the repository's owner.

This folder's `package.json` stays as it is, so the workspace keeps using
the TypeScript source.

To publish a version, set it in `package.json`, merge, and push its tag:

```bash
npm version minor --no-git-tag-version   # or patch, major
git tag v0.2.0 && git push origin v0.2.0
```

The publish workflow checks the tag is the version, then lints,
typechecks, builds and publishes, with the workflow's own token. It can
also be run by hand, for the version in `package.json`.

## Its own repository

The theme is to move to a repository of its own, with this folder at its
root. Its `.github` folder is for that repository: GitHub reads `.github`
at a repository's root only, so here it does nothing.

| File | What it does |
| --- | --- |
| `.github/workflows/ci.yml` | On every pull request and push to main: lint, typecheck and the package's build, every story as a test in light and in dark, and the Storybook build |
| `.github/workflows/chromatic.yml` | On every pull request and push to main: the visual tests in Chromatic (see [Visual tests](#visual-tests)) |
| `.github/workflows/publish.yml` | On a version tag, such as `v0.2.0`, or by hand: publishes the package to GitHub Packages (see [Publishing](#publishing)) |
| `.github/dependabot.yml` | Weekly updates of the npm and GitHub Actions dependencies |
| `.github/CODEOWNERS` | Who reviews |
| `.github/pull_request_template.md` | What to check before asking for a review |

Before the move:

1. Commit a `package-lock.json` of its own: the workflows install with
   `npm ci`, and the lockfile is now the workspace's, at the root of this
   repository.
2. Pin the dependencies that are `latest` (`@chromatic-com/storybook`,
   `playwright` and `vite`) to versions, so installs and Dependabot's
   updates are reproducible.
3. Add the `CHROMATIC_KEY` secret to the new repository.
4. Replace the links to `../graphnous-ui` in this README with links to that
   repository.
5. Once it is published, have `graphnous-ui` and the platform's web app
   install it instead of using the workspace (see
   [Installing it](#installing-it), and the platform's README).
