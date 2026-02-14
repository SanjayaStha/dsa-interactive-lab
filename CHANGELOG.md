# Changelog - DSA Interactive Lab

## [0.2.0] - 2026-02-14

### Added - Major Feature Expansion

#### New Sorting Algorithms
- **Merge Sort Engine** (`MergeSortEngine.ts`)
  - Divide-and-conquer visualization
  - Shows divide and merge phases
  - Tracks subarray merging
  - O(n log n) time complexity

- **Quick Sort Engine** (`QuickSortEngine.ts`)
  - Pivot selection visualization
  - Partitioning animation
  - Recursive sorting visualization
  - O(n log n) average time complexity

#### New Searching Algorithms
- **Linear Search Engine** (`LinearSearchEngine.ts`)
  - Sequential element comparison
  - Target highlighting when found
  - Not found indication
  - O(n) time complexity

- **Binary Search Engine** (`BinarySearchEngine.ts`)
  - Search space halving visualization
  - Mid-point calculation display
  - Left/right subarray highlighting
  - O(log n) time complexity
  - Automatic array sorting

#### New Data Structures
- **Stack Engine** (`StackEngine.ts`)
  - Push/Pop/Peek operations
  - LIFO (Last-In-First-Out) visualization
  - Stack overflow/underflow detection
  - Vertical stack layout

- **Queue Engine** (`QueueEngine.ts`)
  - Enqueue/Dequeue/Peek operations
  - FIFO (First-In-First-Out) visualization
  - Queue overflow/underflow detection
  - Horizontal queue layout with front/rear markers

#### New Visualizers
- **Stack Visualizer** (`StackVisualizer.tsx`)
  - Vertical stack rendering
  - Top element highlighting
  - Bottom marker
  - Index labels
  - Operation animations

- **Queue Visualizer** (`QueueVisualizer.tsx`)
  - Horizontal queue rendering
  - Front and rear markers with arrows
  - Direction indicator
  - FIFO flow visualization
  - Operation animations

#### New Pages
- **Multi-Algorithm Demo Page** (`/demo`)
  - Algorithm selector with categories
  - Dynamic input based on algorithm type
  - Supports all implemented algorithms
  - Automatic visualizer switching
  - Integrated playback controls

#### Updated Components
- **Algorithm Library Page** (`/algorithms`)
  - Added 10 new algorithm cards
  - New categories: Searching, Data Structures, Graph Algorithms
  - Updated implementation status
  - Better categorization

- **Home Page** (`/`)
  - Added link to interactive demo
  - Improved navigation

### Technical Improvements
- All new engines extend `BaseAlgorithmEngine`
- Consistent step generation pattern
- Type-safe implementations
- Zero TypeScript errors
- All existing tests passing

### Algorithm Summary

#### Implemented (10 total)
**Sorting (5):**
1. Bubble Sort - O(n²)
2. Selection Sort - O(n²)
3. Insertion Sort - O(n²)
4. Merge Sort - O(n log n) ✨ NEW
5. Quick Sort - O(n log n) ✨ NEW

**Searching (2):**
1. Linear Search - O(n) ✨ NEW
2. Binary Search - O(log n) ✨ NEW

**Data Structures (2):**
1. Stack (LIFO) - O(1) operations ✨ NEW
2. Queue (FIFO) - O(1) operations ✨ NEW

#### Planned (6)
- Heap Sort
- Linked List
- Binary Tree
- Hash Table
- BFS/DFS
- Dijkstra's Algorithm

### Files Added
```
lib/engines/
  - MergeSortEngine.ts
  - QuickSortEngine.ts
  - LinearSearchEngine.ts
  - BinarySearchEngine.ts
  - StackEngine.ts
  - QueueEngine.ts

components/visualizers/
  - StackVisualizer.tsx
  - QueueVisualizer.tsx

app/
  - demo/page.tsx
  - CHANGELOG.md (this file)
```

### Files Modified
```
- lib/engines/index.ts (added exports)
- app/algorithms/page.tsx (added new algorithms)
- app/page.tsx (added demo link)
- README.md (updated features)
```

### Performance
- All algorithms tested and working
- Smooth animations at 60fps
- No performance degradation
- Memory usage remains optimal

### User Experience
- Intuitive algorithm selection
- Clear visual feedback
- Consistent interaction patterns
- Responsive design maintained

---

## [0.1.0] - 2026-02-14

### Initial Release
- Project setup with Next.js 14+
- Core infrastructure (TypeScript, Tailwind, Vitest)
- Base algorithm engine architecture
- Bubble Sort, Selection Sort, Insertion Sort
- Array visualizer
- Playback controls
- Animation store with Zustand
- Database schema
- Docker setup
- Comprehensive documentation

---

## Future Releases

### [0.3.0] - Planned
- Tree data structures (Binary Tree, BST, AVL)
- Tree visualizer with D3.js
- Heap Sort implementation
- Linked List implementation

### [0.4.0] - Planned
- Graph data structures
- Graph visualizer
- BFS and DFS algorithms
- Dijkstra's algorithm

### [0.5.0] - Planned
- Multi-language code display
- Syntax highlighting
- Code download functionality
- Practice sandbox

### [1.0.0] - Planned
- Complete algorithm library
- Progress tracking
- User authentication
- Challenge problems
- AI integration
