import React, { forwardRef } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link';

export const ForwardedRouterLink = forwardRef<
  HTMLAnchorElement,
  RouterLinkProps
>((props, ref) => <RouterLink {...props} innerRef={ref} />);

interface LinkProps extends MuiLinkProps {
  to: string;
}

export default function Link(props: LinkProps) {
  return <MuiLink {...props} component={RouterLink as any} />;
}
