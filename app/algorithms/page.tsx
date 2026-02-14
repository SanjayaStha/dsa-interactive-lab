'use client';

/**
 * Algorithms Page - Algorithm Selection and Visualization
 */

import { useState } from 'react';
import Link from 'next/link';

interface AlgorithmInfo {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  implemented: boolean;
}

const algorithms: AlgorithmInfo[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'beginner',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    implemented: true,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Sorting',
    difficulty: 'beginner',
    description: 'Sorts an array by repeatedly finding the minimum element from the unsorted part and putting it at the beginning.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    implemented: true,
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    difficulty: 'beginner',
    description: 'Builds the final sorted array one item at a time by inserting each element into its proper position.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    implemented: true,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    description: 'A divide-and-conquer algorithm that divides the array into halves, sorts them, and merges them back together.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    implemented: true,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    description: 'A divide-and-conquer algorithm that picks a pivot element and partitions the array around it.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    implemented: true,
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'Sorting',
    difficulty: 'advanced',
    description: 'Uses a binary heap data structure to sort elements efficiently.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    implemented: true,
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'Searching',
    difficulty: 'beginner',
    description: 'Sequentially checks each element in the list until the target is found or the list ends.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    implemented: true,
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    difficulty: 'beginner',
    description: 'Efficiently searches a sorted array by repeatedly dividing the search interval in half.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    implemented: true,
  },
  {
    id: 'stack',
    name: 'Stack (LIFO)',
    category: 'Data Structures',
    difficulty: 'beginner',
    description: 'A Last-In-First-Out (LIFO) data structure where elements are added and removed from the top.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    implemented: true,
  },
  {
    id: 'queue',
    name: 'Queue (FIFO)',
    category: 'Data Structures',
    difficulty: 'beginner',
    description: 'A First-In-First-Out (FIFO) data structure where elements are added at the rear and removed from the front.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    implemented: true,
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    category: 'Data Structures',
    difficulty: 'intermediate',
    description: 'A linear data structure where elements are stored in nodes, each pointing to the next node.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    implemented: true,
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree',
    category: 'Data Structures',
    difficulty: 'intermediate',
    description: 'A hierarchical data structure where each node has at most two children.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    implemented: true,
  },
  {
    id: 'hash-table',
    name: 'Hash Table',
    category: 'Data Structures',
    difficulty: 'intermediate',
    description: 'A data structure that maps keys to values using a hash function for fast lookups.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    implemented: true,
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'Graph Algorithms',
    difficulty: 'intermediate',
    description: 'Explores a graph level by level, visiting all neighbors before moving to the next level.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    implemented: true,
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'Graph Algorithms',
    difficulty: 'intermediate',
    description: 'Explores a graph by going as deep as possible before backtracking.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    implemented: true,
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'Graph Algorithms',
    difficulty: 'advanced',
    description: 'Finds the shortest path between nodes in a weighted graph.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    implemented: true,
  },
  {
    id: 'pathfinding-bfs',
    name: 'Grid BFS Pathfinding',
    category: 'Path Finding',
    difficulty: 'beginner',
    description: 'Finds the shortest path on a 200x200 grid with walls using breadth-first expansion.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    implemented: true,
  },
  {
    id: 'pathfinding-dijkstra',
    name: 'Grid Dijkstra Pathfinding',
    category: 'Path Finding',
    difficulty: 'intermediate',
    description: 'Finds shortest path on a weighted-uniform grid while exploring the lowest known distance first.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    implemented: true,
  },
  {
    id: 'pathfinding-astar',
    name: 'Grid A* Pathfinding',
    category: 'Path Finding',
    difficulty: 'advanced',
    description: 'Uses heuristic-guided search for faster shortest-path discovery on large grids.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    implemented: true,
  },
];

export default function AlgorithmsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = ['all', ...new Set(algorithms.map(a => a.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredAlgorithms = algorithms.filter(algo => {
    const categoryMatch = selectedCategory === 'all' || algo.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || algo.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50';
      case 'intermediate': return 'bg-amber-500/20 text-amber-300 border border-amber-500/50';
      case 'advanced': return 'bg-rose-500/20 text-rose-300 border border-rose-500/50';
      default: return 'bg-slate-700 text-slate-300 border border-slate-600';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block font-semibold transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Algorithm Library
          </h1>
          <p className="text-lg text-cyan-200">
            Explore and visualize different algorithms
          </p>
        </header>

        {/* Filters */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-500/20 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-purple-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-purple-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Algorithm Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.map(algo => (
            <div
              key={algo.id}
              className="bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/20 p-6 hover:shadow-purple-500/40 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  {algo.name}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(algo.difficulty)}`}>
                  {algo.difficulty}
                </span>
              </div>

              <p className="text-sm text-cyan-200 mb-4">
                {algo.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Time:</span>
                  <span className="font-mono text-cyan-300">{algo.timeComplexity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Space:</span>
                  <span className="font-mono text-cyan-300">{algo.spaceComplexity}</span>
                </div>
              </div>

              {algo.implemented ? (
                <Link
                  href={`/demo?algorithm=${algo.id}`}
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
                >
                  Visualize
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-2 bg-slate-700 text-slate-500 rounded-md font-semibold cursor-not-allowed border border-slate-600"
                >
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>

        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-cyan-200 text-lg">
              No algorithms found matching your filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
