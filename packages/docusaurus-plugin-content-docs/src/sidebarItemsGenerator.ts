/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  SidebarItem,
  SidebarItemDoc,
  SidebarItemCategory,
  DocMetadataBase,
  SidebarItemAutogenerated,
} from './types';
import {sortBy, take, last} from 'lodash';
import {addTrailingSlash} from '@docusaurus/utils';
import {stripNumberPrefix} from './numberPrefix';
import chalk from 'chalk';

// TODO allow to customize this logic (docs cfg+sidebar.js)
// TODO define and document proper API surface
export async function DefaultSidebarItemsGenerator({
  item,
  docs: allDocs,
}: {
  item: SidebarItemAutogenerated;
  docs: DocMetadataBase[];
}): Promise<SidebarItem[]> {
  // Doc at the root of the autogenerated sidebar dir
  function isRootDoc(doc: DocMetadataBase) {
    return doc.sourceDirName === item.dirPath;
  }

  // Doc inside a subfolder of the autogenerated sidebar dir
  function isCategoryDoc(doc: DocMetadataBase) {
    if (isRootDoc(doc)) {
      return false;
    }

    return (
      // autogen dir is . and doc is in subfolder
      item.dirPath === '.' ||
      // autogen dir is not . and doc is in subfolder
      // "api/myDoc" startsWith "api/" (note "api2/myDoc" is not included)
      doc.sourceDirName.startsWith(addTrailingSlash(item.dirPath))
    );
  }

  function isInAutogeneratedDir(doc: DocMetadataBase) {
    return isRootDoc(doc) || isCategoryDoc(doc);
  }

  // autogenDir=a/b and docDir=a/b/c/d => returns c/d
  // autogenDir=a/b and docDir=a/b => returns .
  function getDocDirRelativeToAutogenDir(doc: DocMetadataBase): string {
    if (!isInAutogeneratedDir(doc)) {
      throw new Error(
        'getDocDirRelativeToAutogenDir() can only be called for  subdocs of the sidebar autogen dir',
      );
    }
    // Is there a node API to compare 2 relative paths more easily?
    // path.relative() does not give good results
    if (item.dirPath === '.') {
      return doc.sourceDirName;
    } else if (item.dirPath === doc.sourceDirName) {
      return '.';
    } else {
      return doc.sourceDirName.replace(addTrailingSlash(item.dirPath), '');
    }
  }

  /*
  console.log(
    'allDocs',
    allDocs.map((d) => ({
      source: d.source,
      dir: d.sourceDirName,
      isRootDoc: isRootDoc(d),
      isCategoryDoc: isCategoryDoc(d),
    })),
  );
   */

  // Get only docs in the autogen dir
  // Sort by folder+filename at once
  const docs = sortBy(allDocs.filter(isInAutogeneratedDir), (d) => d.source);

  if (docs.length === 0) {
    console.warn(
      chalk.yellow(
        `No docs found in dir ${item.dirPath}: can't auto-generate a sidebar`,
      ),
    );
  }

  /*
  console.log(
    'docs',
    docs.map((d) => ({
      source: d.source,
      dir: d.sourceDirName,
    })),
  );
   */

  function createDocSidebarItem(doc: DocMetadataBase): SidebarItemDoc {
    return {
      type: 'doc',
      id: doc.id,
      ...(doc.frontMatter.sidebar_label && {
        label: doc.frontMatter.sidebar_label,
      }),
    };
  }

  async function createCategorySidebarItem({
    dirName,
  }: {
    dirName: string;
  }): Promise<SidebarItemCategory> {
    // TODO read metadata file from the directory for additional config?
    return {
      type: 'category',
      label: stripNumberPrefix(dirName),
      items: [],
      collapsed: true, // TODO use default value
    };
  }

  // Not sure how to simplify this algorithm :/
  async function autogenerateSidebarItems(): Promise<SidebarItem[]> {
    const BreadcrumbSeparator = '/';

    const sidebarItems: SidebarItem[] = []; // mutable result

    const categoriesByBreadcrumb: Record<string, SidebarItemCategory> = {}; // mutable cache of categories already created

    async function getOrCreateCategoriesForBreadcrumb(
      breadcrumb: string[],
    ): Promise<SidebarItemCategory | null> {
      if (breadcrumb.length === 0) {
        return null;
      }
      const parentBreadcrumb = take(breadcrumb, breadcrumb.length - 1);
      const lastBreadcrumbElement = last(breadcrumb)!;
      const parentCategory = await getOrCreateCategoriesForBreadcrumb(
        parentBreadcrumb,
      );
      const existingCategory =
        categoriesByBreadcrumb[breadcrumb.join(BreadcrumbSeparator)];

      if (existingCategory) {
        return existingCategory;
      } else {
        const newCategory = await createCategorySidebarItem({
          dirName: lastBreadcrumbElement,
        });
        if (parentCategory) {
          parentCategory.items.push(newCategory);
        } else {
          sidebarItems.push(newCategory);
        }
        categoriesByBreadcrumb[
          breadcrumb.join(BreadcrumbSeparator)
        ] = newCategory;
        return newCategory;
      }
    }

    // Get the category breadcrumb of a doc (relative to the dir of the autogenerated sidebar item)
    function getRelativeBreadcrumb(doc: DocMetadataBase): string[] {
      const relativeDirPath = getDocDirRelativeToAutogenDir(doc);
      if (relativeDirPath === '.') {
        return [];
      } else {
        return relativeDirPath.split(BreadcrumbSeparator);
      }
    }

    async function handleDocItem(doc: DocMetadataBase): Promise<void> {
      const breadcrumb = getRelativeBreadcrumb(doc);
      const category = await getOrCreateCategoriesForBreadcrumb(breadcrumb);

      const docSidebarItem = createDocSidebarItem(doc);
      if (category) {
        category.items.push(docSidebarItem);
      } else {
        sidebarItems.push(docSidebarItem);
      }
    }

    // async process made sequential on purpose! order matters
    for (const doc of docs) {
      // eslint-disable-next-line no-await-in-loop
      await handleDocItem(doc);
    }

    // console.log({sidebarItems});

    return sidebarItems;
  }

  return autogenerateSidebarItems();
}
