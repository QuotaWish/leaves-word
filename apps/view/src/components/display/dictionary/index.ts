import { ref, watch } from 'vue'
import type { Category, EnglishDictionaryWithCategoryVO } from '~/composables/api/clients/globals'

// 定义类型
export interface BookCategory extends Category {
  children: BookCategory[]
  books: Book[]
}

export type Book = EnglishDictionaryWithCategoryVO
export function useCategoryTree(data: Book[]) {
  const categoryTree = ref<BookCategory[]>([])

  function buildCategorySubTree(newData: Book[]) {
    const categoryMap = new Map<number, BookCategory>()
    let uncategorizedId: number | undefined

    console.log(categoryMap, newData)

    // 第一步：收集所有唯一分类，并初始化树节点
    const uncategorizedBooks: Book[] = []
    newData.forEach((book) => {
      if (book.categoryList?.length) {
        book.categoryList.forEach((category) => {
          const categoryId = category.id
          if (!categoryMap.has(categoryId!)) {
            categoryMap.set(categoryId!, {
              ...category,
              children: [],
              books: [],
            })
          }
        })
      }
      else {
        uncategorizedBooks.push(book)
      }
    })

    // 处理未分类书籍
    if (uncategorizedBooks.length) {
      // 查找现有未分类节点
      let found = false
      categoryMap.forEach((cat) => {
        if (cat.name === '未分类' && cat.parentId === 0) {
          uncategorizedId = cat.id
          found = true
        }
      })

      // 创建新的未分类节点
      if (!found) {
        uncategorizedId = -1
        categoryMap.set(uncategorizedId, {
          id: uncategorizedId,
          name: '未分类',
          parentId: 0,
          children: [],
          books: [],
        })
      }
    }

    // 第二步：构建树形结构
    const rootNodes: BookCategory[] = []
    categoryMap.forEach((category) => {
      const parentId = category.parentId
      if (parentId === 0 || !categoryMap.has(parentId!)) {
        rootNodes.push(category)
      }
      else {
        const parent = categoryMap.get(parentId!)
        parent?.children.push(category)
      }
    })

    // 第三步：分配教材到分类
    newData.forEach((book) => {
      if (book.categoryList?.length) {
        book.categoryList.forEach((category) => {
          const node = categoryMap.get(category.id!)
          node?.books.push(book)
        })
      }
      else if (uncategorizedId !== undefined) {
        categoryMap.get(uncategorizedId)?.books.push(book)
      }
    })

    categoryTree.value = rootNodes
  }

  watch(
    () => data,
    (newData) => {
      buildCategorySubTree(newData)
    },
    { immediate: true, deep: true },
  )

  return categoryTree
}
