/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line spaced-comment
/// <reference types="@docusaurus/module-type-aliases" />

import type {RemarkAndRehypePluginOptions} from '@docusaurus/mdx-loader';
import {
  BrokenMarkdownLink as IBrokenMarkdownLink,
  ContentPaths,
} from '@docusaurus/utils/lib/markdownLinks';

export type DocFile = {
  contentPath: string; // /!\ may be localized
  filePath: string; // /!\ may be localized
  source: string;
  content: string;
  lastUpdate: LastUpdateData;
};

export type VersionName = string;

export type VersionMetadata = ContentPaths & {
  versionName: VersionName; // 1.0.0
  versionLabel: string; // Version 1.0.0
  versionPath: string; // /baseUrl/docs/1.0.0
  versionEditUrl?: string | undefined;
  versionEditUrlLocalized?: string | undefined;
  isLast: boolean;
  sidebarFilePath: string | false | undefined; // versioned_sidebars/1.0.0.json
  routePriority: number | undefined; // -1 for the latest docs
};

export type EditUrlFunction = (editUrlParams: {
  version: string;
  versionDocsDirPath: string;
  docPath: string;
  permalink: string;
  locale: string;
}) => string | undefined;

export type MetadataOptions = {
  routeBasePath: string;
  homePageId?: string;
  editUrl?: string | EditUrlFunction;
  editCurrentVersion: boolean;
  editLocalizedFiles: boolean;
  showLastUpdateTime?: boolean;
  showLastUpdateAuthor?: boolean;
  numberPrefixParser: NumberPrefixParser;
};

export type PathOptions = {
  path: string;
  sidebarPath?: string | false | undefined;
};

export type VersionOptions = {
  path?: string;
  label?: string;
};

export type VersionsOptions = {
  lastVersion?: string;
  versions: Record<string, VersionOptions>;
  onlyIncludeVersions?: string[];
};

export type PluginOptions = MetadataOptions &
  PathOptions &
  VersionsOptions &
  RemarkAndRehypePluginOptions & {
    id: string;
    include: string[];
    docLayoutComponent: string;
    docItemComponent: string;
    admonitions: Record<string, unknown>;
    disableVersioning: boolean;
    excludeNextVersionDocs?: boolean;
    includeCurrentVersion: boolean;
    sidebarItemsGenerator: SidebarItemsGeneratorOption;
  };

export type SidebarItemBase = {
  customProps?: Record<string, unknown>;
};

export type SidebarItemDoc = SidebarItemBase & {
  type: 'doc' | 'ref';
  label?: string;
  id: string;
};

export type SidebarItemLink = SidebarItemBase & {
  type: 'link';
  href: string;
  label: string;
};

export type SidebarItemCategory = SidebarItemBase & {
  type: 'category';
  label: string;
  items: SidebarItem[];
  collapsed: boolean;
};

export type UnprocessedSidebarItemAutogenerated = {
  type: 'autogenerated';
  dirName: string;
};

export type UnprocessedSidebarItemCategory = SidebarItemBase & {
  type: 'category';
  label: string;
  items: UnprocessedSidebarItem[];
  collapsed: boolean;
};

export type UnprocessedSidebarItem =
  | SidebarItemDoc
  | SidebarItemLink
  | UnprocessedSidebarItemCategory
  | UnprocessedSidebarItemAutogenerated;

export type UnprocessedSidebar = UnprocessedSidebarItem[];
export type UnprocessedSidebars = Record<string, UnprocessedSidebar>;

export type SidebarItem =
  | SidebarItemDoc
  | SidebarItemLink
  | SidebarItemCategory;

export type Sidebar = SidebarItem[];
export type SidebarItemType = SidebarItem['type'];
export type Sidebars = Record<string, Sidebar>;

// Reduce API surface for options.sidebarItemsGenerator
// The user-provided generator fn should receive only a subset of metadatas
// A change to any of these metadatas can be considered as a breaking change
export type SidebarItemsGeneratorDoc = Pick<
  DocMetadataBase,
  'id' | 'frontMatter' | 'source' | 'sourceDirName' | 'sidebarPosition'
>;
export type SidebarItemsGeneratorVersion = Pick<
  VersionMetadata,
  'versionName' | 'contentPath'
>;

export type SidebarItemsGeneratorArgs = {
  item: UnprocessedSidebarItemAutogenerated;
  version: SidebarItemsGeneratorVersion;
  docs: SidebarItemsGeneratorDoc[];
  numberPrefixParser: NumberPrefixParser;
};
export type SidebarItemsGenerator = (
  generatorArgs: SidebarItemsGeneratorArgs,
) => Promise<SidebarItem[]>;

// Also inject the default generator to conveniently wrap/enhance/sort the default sidebar gen logic
// see https://github.com/facebook/docusaurus/issues/4640#issuecomment-822292320
export type SidebarItemsGeneratorOptionArgs = {
  defaultSidebarItemsGenerator: SidebarItemsGenerator;
} & SidebarItemsGeneratorArgs;
export type SidebarItemsGeneratorOption = (
  generatorArgs: SidebarItemsGeneratorOptionArgs,
) => Promise<SidebarItem[]>;

export type OrderMetadata = {
  previous?: string;
  next?: string;
  sidebar?: string;
};

export type LastUpdateData = {
  lastUpdatedAt?: number;
  formattedLastUpdatedAt?: string;
  lastUpdatedBy?: string;
};

export type FrontMatter = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type DocMetadataBase = LastUpdateData & {
  version: VersionName;
  unversionedId: string;
  id: string;
  isDocsHomePage: boolean;
  title: string;
  description: string;
  source: string;
  sourceDirName: string; // relative to the docs folder (can be ".")
  slug: string;
  permalink: string;
  // eslint-disable-next-line camelcase
  sidebarPosition?: number;
  editUrl?: string | null;
  frontMatter: FrontMatter;
};

export type DocNavLink = {
  title: string;
  permalink: string;
};

export type DocMetadata = DocMetadataBase & {
  sidebar?: string;
  previous?: DocNavLink;
  next?: DocNavLink;
};

export type SourceToPermalink = {
  [source: string]: string;
};
export type LoadedVersion = VersionMetadata & {
  versionPath: string;
  mainDocId: string;
  docs: DocMetadata[];
  sidebars: Sidebars;
  permalinkToSidebar: Record<string, string>;
};

export type LoadedContent = {
  loadedVersions: LoadedVersion[];
};

export type GlobalDoc = {
  id: string;
  path: string;
  sidebar: string | undefined;
};

export type GlobalVersion = {
  name: VersionName;
  label: string;
  isLast: boolean;
  path: string;
  mainDocId: string; // home doc (if docs homepage configured), or first doc
  docs: GlobalDoc[];
};

export type GlobalPluginData = {
  path: string;
  versions: GlobalVersion[];
};

export type BrokenMarkdownLink = IBrokenMarkdownLink<VersionMetadata>;

export type DocsMarkdownOption = {
  versionsMetadata: VersionMetadata[];
  siteDir: string;
  sourceToPermalink: SourceToPermalink;
  onBrokenMarkdownLink: (brokenMarkdownLink: BrokenMarkdownLink) => void;
};

export type NumberPrefixParser = (
  filename: string,
) => {filename: string; numberPrefix?: number};
