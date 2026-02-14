'use client';

/**
 * Home Page - DSA Interactive Lab
 * Displays algorithms grouped by category with quick access to demo
 */

import Link from 'next/link';

interface HomeAlgorithmItem {
  id: string;
  name: string;
}

interface HomeAlgorithmGroup {
  title: string;
  algorithms: HomeAlgorithmItem[];
}

const groupedAlgorithms: HomeAlgorithmGroup[] = [
  {
    title: 'Sorting Algorithms',
    algorithms: [
      { id: 'bubble-sort', name: 'Bubble Sort' },
      { id: 'selection-sort', name: 'Selection Sort' },
      { id: 'insertion-sort', name: 'Insertion Sort' },
      { id: 'merge-sort', name: 'Merge Sort' },
      { id: 'quick-sort', name: 'Quick Sort' },
      { id: 'heap-sort', name: 'Heap Sort' },
    ],
  },
  {
    title: 'Searching Algorithms',
    algorithms: [
      { id: 'linear-search', name: 'Linear Search' },
      { id: 'binary-search', name: 'Binary Search' },
    ],
  },
  {
    title: 'Data Structures',
    algorithms: [
      { id: 'stack', name: 'Stack (LIFO)' },
      { id: 'queue', name: 'Queue (FIFO)' },
      { id: 'linked-list', name: 'Linked List' },
      { id: 'binary-tree', name: 'Binary Tree' },
      { id: 'hash-table', name: 'Hash Table' },
    ],
  },
  {
    title: 'Graph Algorithms',
    algorithms: [
      { id: 'bfs', name: 'Breadth-First Search' },
      { id: 'dfs', name: 'Depth-First Search' },
      { id: 'dijkstra', name: "Dijkstra's Algorithm" },
    ],
  },
  {
    title: 'Pathfinding Algorithms',
    algorithms: [
      { id: 'pathfinding-bfs', name: 'Grid BFS' },
      { id: 'pathfinding-dijkstra', name: 'Grid Dijkstra' },
      { id: 'pathfinding-astar', name: 'Grid A*' },
    ],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            DSA Interactive Lab
          </h1>
          <p className="text-lg text-cyan-200 mb-4">
            Explore algorithms grouped by category and open any one in the interactive demo.
          </p>
          <Link
            href="/demo"
            className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50 mr-4"
          >
            Try Interactive Demo
          </Link>
          <Link
            href="/algorithms"
            className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-purple-500/50"
          >
            Browse Detailed Library
          </Link>
        </header>

        <section className="space-y-6">
          {groupedAlgorithms.map((group) => (
            <div
              key={group.title}
              className="bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/20 p-6"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {group.title}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.algorithms.map((algorithm) => (
                  <Link
                    key={algorithm.id}
                    href={`/demo?algorithm=${algorithm.id}`}
                    className="flex items-center justify-between bg-slate-700/60 border border-cyan-500/30 rounded-lg px-4 py-3 hover:border-cyan-400/70 hover:bg-slate-700 transition-all"
                  >
                    <span className="text-cyan-100 font-medium">{algorithm.name}</span>
                    <span className="text-cyan-300">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
