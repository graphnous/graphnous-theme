"use client";

import { createContext, useContext, type ComponentPropsWithRef, type ComponentType, type ReactNode } from "react";

export type RouterLinkProps = ComponentPropsWithRef<"a"> & {
  href: string;
};

/**
 * What renders the links of the components, such as Next.js' Link or React
 * Router's: anything that takes an anchor's props.
 */
export type LinkComponent = ComponentType<RouterLinkProps>;

const LinkComponentContext = createContext<LinkComponent | "a">("a");

export type LinkProviderProps = {
  component: LinkComponent;
  children: ReactNode;
};

/**
 * Makes the links of the components below it (Link, ButtonLink, Breadcrumbs,
 * NavItem) go through the app's router; without it they are plain anchors.
 *
 * Put it in a client component of the app, since a component cannot be
 * passed from a server component.
 */
export function LinkProvider({ component, children }: LinkProviderProps) {
  return <LinkComponentContext value={component}>{children}</LinkComponentContext>;
}

/**
 * A link through the LinkProvider's component, or a plain anchor.
 */
export function RouterLink(props: RouterLinkProps) {
  const Component = useContext(LinkComponentContext);

  // The component comes from the provider, not from this render
  // eslint-disable-next-line react-hooks/static-components
  return <Component {...props} />;
}
