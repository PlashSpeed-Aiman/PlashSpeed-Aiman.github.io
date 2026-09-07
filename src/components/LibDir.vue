<script setup>
import { computed, reactive } from 'vue'
import Card from './base/Card.vue'
import mapData from '../book-file-map.json'

function mkDir(name, parentPath, depth) {
  return { name, type: 'dir', dirs: [], files: [], count: 0, depth, path: parentPath ? `${parentPath}/${name}` : name }
}

const root = mkDir('', '', -1)
for (const item of mapData) {
  const segs = (item.DirectoryPath || '').split('/').filter((s) => s.length > 0)
  let cur = root
  for (const seg of segs) {
    let next = cur.dirs.find((d) => d.name === seg)
    if (!next) {
      next = mkDir(seg, cur.path, cur.depth + 1)
      cur.dirs.push(next)
    }
    cur = next
  }
  cur.files.push(item.FileName)
}

const allDirNodes = []
;(function finalize(node) {
  node.dirs.forEach(finalize)
  node.count = node.files.length + node.dirs.reduce((acc, d) => acc + d.count, 0)
  node.dirs.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  node.files.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  allDirNodes.push(node)
})(root)

const collapsed = reactive(new Set())

const expandAll = () => {
  collapsed.clear()
}

const collapseAll = () => {
  allDirNodes.filter((d) => d.depth >= 1).forEach((d) => collapsed.add(d))
}

collapseAll()

const toggle = (node) => {
  if (collapsed.has(node)) collapsed.delete(node)
  else collapsed.add(node)
}

const rows = computed(() => {
  const out = []
  const collect = (node) => {
    for (const d of node.dirs) {
      out.push({ type: 'dir', node: d, name: d.name, depth: d.depth, count: d.count, path: d.path })
      if (!collapsed.has(d)) collect(d)
    }
    for (const f of node.files) {
      out.push({ type: 'file', name: f, depth: node.depth + 1, path: `${node.path}/${f}` })
    }
  }
  collect(root)
  return out
})

const totalFiles = mapData.length
const totalFolders = allDirNodes.length - 1

const stripExtension = (name) => name.replace(/\.[^.]+$/, '')
</script>

<template>
  <div class="max-w-8xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
    <!-- Header -->
    <div class="max-w-2xl mb-10 space-y-4" style="transform: rotate(-0.4deg);">
      <h1 class="text-4xl lg:text-5xl font-bold text-stone-950 leading-tight tracking-tight">
        Library <span class="text-gradient-warm">Directory</span>
      </h1>
      <p class="text-lg text-stone-600 leading-relaxed">
        A tree view of my book collection, grouped by directory.
      </p>
    </div>

    <!-- Stats -->
    <div class="flex flex-wrap gap-4 mb-8">
      <Card :hoverable="false" variant="bordered" padding="sm">
        <div class="px-1">
          <p class="text-sm text-stone-600">Folders</p>
          <p class="text-2xl font-semibold text-stone-950">{{ totalFolders }}</p>
        </div>
      </Card>
      <Card :hoverable="false" variant="bordered" padding="sm">
        <div class="px-1">
          <p class="text-sm text-stone-600">Files</p>
          <p class="text-2xl font-semibold text-amber-600">{{ totalFiles }}</p>
        </div>
      </Card>
      <div class="flex items-end ml-auto gap-2">
        <button
          @click="expandAll"
          class="px-4 py-2 rounded-md border border-stone-300 text-sm font-medium text-stone-700 hover:border-amber-600 hover:text-amber-600 transition-colors duration-200"
        >
          Expand all
        </button>
        <button
          @click="collapseAll"
          class="px-4 py-2 rounded-md border border-stone-300 text-sm font-medium text-stone-700 hover:border-amber-600 hover:text-amber-600 transition-colors duration-200"
        >
          Collapse all
        </button>
      </div>
    </div>

    <!-- Tree -->
    <Card :hoverable="false" padding="none" class="overflow-hidden">
      <div class="divide-y divide-stone-100">
        <template v-for="row in rows" :key="row.path">
          <!-- Directory row -->
          <div
            v-if="row.type === 'dir'"
            class="flex items-center gap-2 px-4 py-2.5 cursor-pointer select-none group hover:bg-amber-50/40 transition-colors duration-150"
            :style="{ paddingLeft: `${1 + row.depth * 1.5}rem` }"
            @click="toggle(row.node)"
          >
            <svg
              :class="['h-4 w-4 shrink-0 text-stone-500 transition-transform duration-200', collapsed.has(row.node) ? '' : 'rotate-90']"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 8l4 4 4-4" />
            </svg>
            <svg class="h-5 w-5 shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            <span class="text-sm font-medium text-stone-800 group-hover:text-amber-700 transition-colors duration-150">
              {{ row.name }}
            </span>
            <span class="text-xs text-stone-400 tabular-nums ml-auto">{{ row.count }} files</span>
          </div>

          <!-- File row -->
          <div
            v-else
            class="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 transition-colors duration-150"
            :style="{ paddingLeft: `${1 + row.depth * 1.5}rem` }"
          >
            <span class="w-4 shrink-0"></span>
            <svg class="h-5 w-5 shrink-0 text-stone-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V6l-4-4H9z" />
              <path class="text-stone-300" d="M15 6h-3a1 1 0 01-1-1V2l4 4z" />
            </svg>
            <span class="text-sm text-stone-700 break-all">{{ stripExtension(row.name) }}</span>
          </div>
        </template>
      </div>
    </Card>
  </div>
</template>
