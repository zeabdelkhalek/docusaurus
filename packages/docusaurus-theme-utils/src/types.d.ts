/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable spaced-comment */
/// <reference types="@docusaurus/module-type-aliases" />

declare module '@theme/hooks/useAnnoucementBar' {
  export type useAnnouncementBarReturns = {
    readonly isAnnouncementBarClosed: boolean;
    readonly closeAnnouncementBar: () => void;
  };

  const useAnnouncementBar: () => useAnnouncementBarReturns;
  export default useAnnouncementBar;
}

declare module '@theme/hooks/useHideableNavbar' {
  export type useHideableNavbarReturns = {
    readonly navbarRef: (node: HTMLElement | null) => void;
    readonly isNavbarVisible: boolean;
  };

  const useHideableNavbar: (hideOnScroll: boolean) => useHideableNavbarReturns;
  export default useHideableNavbar;
}

declare module '@theme/hooks/useLocationHash' {
  import type {Dispatch, SetStateAction} from 'react';

  export type useLocationHashReturns = readonly [
    string,
    Dispatch<SetStateAction<string>>,
  ];

  const useLocationHash: (initialHash: string) => useLocationHashReturns;
  export default useLocationHash;
}

declare module '@theme/hooks/useLockBodyScroll' {
  const useLockBodyScroll: (lock?: boolean) => void;
  export default useLockBodyScroll;
}

declare module '@theme/hooks/useLogo' {
  export type LogoLinkProps = {target?: string; rel?: string};

  export type useLogoReturns = {
    readonly logoLink: string;
    readonly logoLinkProps: LogoLinkProps;
    readonly logoImageUrl: string;
    readonly logoAlt: string;
  };

  const useLogo: () => useLogoReturns;
  export default useLogo;
}

declare module '@theme/hooks/usePrismTheme' {
  import defaultTheme from 'prism-react-renderer/themes/palenight';

  const usePrismTheme: () => typeof defaultTheme;
  export default usePrismTheme;
}

declare module '@theme/hooks/useScrollPosition' {
  export type ScrollPosition = {scrollX: number; scrollY: number};

  const useScrollPosition: (
    effect?: (position: ScrollPosition) => void,
    deps?: unknown[],
  ) => ScrollPosition;
  export default useScrollPosition;
}

declare module '@theme/hooks/useTabGroupChoice' {
  export type useTabGroupChoiceReturns = {
    readonly tabGroupChoices: {readonly [groupId: string]: string};
    readonly setTabGroupChoices: (groupId: string, newChoice: string) => void;
  };

  const useTabGroupChoice: () => useTabGroupChoiceReturns;
  export default useTabGroupChoice;
}

declare module '@theme/hooks/useTheme' {
  export type useThemeReturns = {
    readonly isDarkTheme: boolean;
    readonly setLightTheme: () => void;
    readonly setDarkTheme: () => void;
  };

  const useTheme: () => useThemeReturns;
  export default useTheme;
}

declare module '@theme/hooks/useThemeContext' {
  export type ThemeContextProps = {
    isDarkTheme: boolean;
    setLightTheme: () => void;
    setDarkTheme: () => void;
  };

  export default function useThemeContext(): ThemeContextProps;
}

declare module '@theme/ThemeContext' {
  import type {Context} from 'react';
  import type {ThemeContextProps} from '@theme/hooks/useThemeContext';

  const ThemeContext: Context<ThemeContextProps | undefined>;
  export default ThemeContext;
}

declare module '@theme/hooks/useTOCHighlight' {
  export default function useTOCHighlight(
    linkClassName: string,
    linkActiveClassName: string,
    topOffset: number,
  ): void;
}

declare module '@theme/hooks/useUserPreferencesContext' {
  export type UserPreferencesContextProps = {
    tabGroupChoices: {readonly [groupId: string]: string};
    setTabGroupChoices: (groupId: string, newChoice: string) => void;
    isAnnouncementBarClosed: boolean;
    closeAnnouncementBar: () => void;
  };

  export default function useUserPreferencesContext(): UserPreferencesContextProps;
}

declare module '@theme/hooks/useWindowSize' {
  export const windowSizes: {
    desktop: 'desktop';
    mobile: 'mobile';
  };

  export type WindowSize = keyof typeof windowSizes;

  export default function useWindowSize(): WindowSize | undefined;
}
