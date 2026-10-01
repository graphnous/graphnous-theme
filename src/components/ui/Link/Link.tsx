import { ArrowSquareOutIcon } from "@phosphor-icons/react/ssr";

import { cn } from "../../../lib/cn";

import { Icon } from "../Icon/Icon";
import { RouterLink, type RouterLinkProps } from "./LinkProvider";

export type LinkProps = RouterLinkProps & {
  /**
   * A page outside the app, such as a git repository: opens in a new tab,
   * marked with an icon.
   */
  external?: boolean;
};

/**
 * A text link, within the app or, with external, to another site.
 */
export function Link({ external = false, className, children, ...props }: LinkProps) {
  return (
    <RouterLink
      className={cn(
        "inline-flex items-center gap-1 rounded-sm text-link underline-offset-4 hover:underline",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {external && (
        <>
          <Icon icon={ArrowSquareOutIcon} size="xs" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </RouterLink>
  );
}
