export interface LearningQA {
  question: string;
  answer: string;
}

export interface AlgorithmLearningContent {
  prerequisites: string[];
  technique: string;
  branching: string[];
  realLifeExamples: string[];
  interviewQA: LearningQA[];
  practiceQuestions: string[];
}

const GENERIC_CONTENT: AlgorithmLearningContent = {
  prerequisites: [
    'Basic arrays, loops, and conditional statements',
    'How to read time/space complexity at a high level',
  ],
  technique: 'Follow the algorithm state step-by-step and track what changes after each operation.',
  branching: [
    'What condition decides the next operation?',
    'What is the base case or termination condition?',
  ],
  realLifeExamples: [
    'Prioritizing tasks in a workflow',
    'Searching and organizing information in apps',
  ],
  interviewQA: [
    {
      question: 'How do you pick the right algorithm for a problem?',
      answer: 'Match input size, required guarantees, and data characteristics (sorted/unsorted, weighted/unweighted) to complexity and behavior.',
    },
    {
      question: 'Why does step-by-step tracing help?',
      answer: 'Tracing exposes invariants, branching decisions, and edge cases that are hard to spot from code alone.',
    },
  ],
  practiceQuestions: [
    'Trace one full run manually and explain each branch taken.',
    'Identify worst-case input and explain why it is worst.',
    'Refactor to improve readability without changing behavior.',
  ],
};

const LEARNING_CONTENT: Record<string, AlgorithmLearningContent> = {
  'bubble-sort': {
    prerequisites: ['Array indexing and adjacent swaps', 'Nested loops', 'Best/average/worst case intuition'],
    technique: 'Repeatedly compare adjacent elements and swap if out of order so larger values bubble to the end each pass.',
    branching: ['If a[i] > a[i+1], swap; else continue', 'If a full pass has no swap, terminate early'],
    realLifeExamples: ['Ranking small score lists quickly', 'One-pass quality checks where largest defects move to the end'],
    interviewQA: [
      { question: 'Why is Bubble Sort usually slow?', answer: 'It performs many repeated adjacent comparisons, giving O(n²) average/worst time.' },
      { question: 'When can Bubble Sort be acceptable?', answer: 'Tiny datasets, nearly sorted arrays with early-exit optimization, or teaching fundamentals.' },
    ],
    practiceQuestions: ['Add early-exit optimization and explain impact.', 'Show how many swaps happen for reverse-sorted input.', 'Compare Bubble vs Insertion on nearly sorted arrays.'],
  },
  'selection-sort': {
    prerequisites: ['Array scanning', 'Index tracking (minIndex)', 'Swap operation'],
    technique: 'Select the minimum from unsorted suffix and place it at current position.',
    branching: ['If current value < minValue, update minIndex', 'After scan, swap minIndex with i if different'],
    realLifeExamples: ['Choosing cheapest option repeatedly from a shortlist', 'Batching smallest jobs first when list is static'],
    interviewQA: [
      { question: 'How many swaps does Selection Sort use?', answer: 'At most n-1 swaps, fewer than Bubble in many cases.' },
      { question: 'Is Selection Sort stable by default?', answer: 'No, swapping can change equal-element order unless modified.' },
    ],
    practiceQuestions: ['Implement stable Selection Sort variation.', 'Count comparisons exactly for n elements.', 'Explain why time remains O(n²) even for sorted input.'],
  },
  'insertion-sort': {
    prerequisites: ['Shifting elements', 'Maintaining sorted prefix', 'Loop invariants'],
    technique: 'Take next element as key and insert it into the already sorted left part by shifting larger elements right.',
    branching: ['While left element > key, shift right', 'Insert key at first valid position'],
    realLifeExamples: ['Sorting cards in hand', 'Maintaining sorted log for streaming small updates'],
    interviewQA: [
      { question: 'Why is Insertion Sort good for nearly sorted data?', answer: 'Few shifts are needed, making it close to O(n).' },
      { question: 'Is Insertion Sort stable?', answer: 'Yes, if equal values are not moved past each other.' },
    ],
    practiceQuestions: ['Trace insertion positions for sample input.', 'Modify for descending order.', 'Compare shifts performed on random vs nearly sorted arrays.'],
  },
  'merge-sort': {
    prerequisites: ['Recursion basics', 'Divide-and-conquer idea', 'Merging two sorted arrays'],
    technique: 'Recursively split array into halves, then merge sorted halves while preserving order.',
    branching: ['Base case: subarray size <= 1', 'During merge: take smaller front element from left/right'],
    realLifeExamples: ['External sorting of large files', 'Merging sorted data from multiple services'],
    interviewQA: [
      { question: 'Why is Merge Sort consistently O(n log n)?', answer: 'Each level processes n elements and there are log n split levels.' },
      { question: 'Main trade-off of Merge Sort?', answer: 'Extra memory for merge buffers (typically O(n)).' },
    ],
    practiceQuestions: ['Draw recursion tree for 8 elements.', 'Implement merge function without sentinel values.', 'Compare with Quick Sort on worst-case input.'],
  },
  'quick-sort': {
    prerequisites: ['Partitioning arrays', 'Recursion', 'Pivot strategy awareness'],
    technique: 'Choose pivot, partition into less/greater sides, then recursively sort partitions.',
    branching: ['Partition comparisons decide side of pivot', 'Recurse only when low < high'],
    realLifeExamples: ['In-memory fast sorting in libraries', 'Ranking pipelines where average performance matters'],
    interviewQA: [
      { question: 'Why can Quick Sort become O(n²)?', answer: 'Bad pivots create highly unbalanced partitions.' },
      { question: 'How to reduce worst-case risk?', answer: 'Use randomized/median-of-three pivot and tail recursion optimizations.' },
    ],
    practiceQuestions: ['Implement Lomuto and Hoare partitions.', 'Trace partition boundaries step-by-step.', 'Explain effect of pivot choice on recursion depth.'],
  },
  'heap-sort': {
    prerequisites: ['Binary heap structure', 'Parent/child index formulas', 'Heapify operation'],
    technique: 'Build max-heap, repeatedly swap root with last element, shrink heap, and heapify.',
    branching: ['If child is larger than parent, swap and continue heapify', 'Stop when heap property holds'],
    realLifeExamples: ['Priority-based scheduling', 'Top-k extraction and repeated max selection'],
    interviewQA: [
      { question: 'Why is Heap Sort O(n log n)?', answer: 'Heap build is O(n), then n extractions each O(log n).' },
      { question: 'Is Heap Sort stable?', answer: 'No, equal elements may reorder during heap operations.' },
    ],
    practiceQuestions: ['Build heap manually for a sample array.', 'Trace one full extract-max cycle.', 'Compare memory usage with Merge Sort.'],
  },
  'linear-search': {
    prerequisites: ['Array traversal', 'Equality comparison', 'Early return pattern'],
    technique: 'Scan each element from left to right until target is found or array ends.',
    branching: ['If current == target, return index', 'Else continue until end'],
    realLifeExamples: ['Finding a name in small unsorted contact list', 'Checking if item exists in short queue'],
    interviewQA: [
      { question: 'When is Linear Search preferable?', answer: 'Small or unsorted collections where preprocessing is not worth it.' },
      { question: 'Time complexity of Linear Search?', answer: 'O(n) worst case, O(1) best case.' },
    ],
    practiceQuestions: ['Return all matching indices instead of first.', 'Count comparisons until match/miss.', 'Compare with Binary Search after sorting cost.'],
  },
  'binary-search': {
    prerequisites: ['Sorted arrays', 'Midpoint calculation', 'Half-interval reasoning'],
    technique: 'Compare target with middle element and discard half the search range each step.',
    branching: ['If target < mid value, move high left', 'If target > mid value, move low right', 'If equal, return'],
    realLifeExamples: ['Dictionary word lookup by order', 'Version search for first failing build'],
    interviewQA: [
      { question: 'Why must input be sorted?', answer: 'The half-discard decision relies on total order.' },
      { question: 'Common bug in Binary Search?', answer: 'Incorrect boundary updates causing infinite loops/off-by-one errors.' },
    ],
    practiceQuestions: ['Find first occurrence among duplicates.', 'Find insertion position if target missing.', 'Implement iterative and recursive versions.'],
  },
  stack: {
    prerequisites: ['LIFO concept', 'Push/pop operations', 'Top pointer idea'],
    technique: 'Operate on one end only: push to add, pop to remove, peek to inspect top.',
    branching: ['If stack empty, pop/peek should handle underflow', 'Push increments top; pop decrements top'],
    realLifeExamples: ['Undo/redo in editors', 'Function call stack execution'],
    interviewQA: [
      { question: 'Why are stack operations O(1)?', answer: 'They update only one end without shifting elements.' },
      { question: 'How is stack used in DFS?', answer: 'It stores frontier nodes in last-in-first-out order.' },
    ],
    practiceQuestions: ['Implement balanced parentheses checker.', 'Evaluate postfix expression using stack.', 'Design min-stack with O(1) min query.'],
  },
  queue: {
    prerequisites: ['FIFO concept', 'Front/rear pointers', 'Enqueue/dequeue operations'],
    technique: 'Add at rear, remove from front to preserve arrival order.',
    branching: ['If queue empty, dequeue/peek handles underflow', 'Circular queue wraps indices modulo capacity'],
    realLifeExamples: ['Print job processing', 'Customer support ticket handling'],
    interviewQA: [
      { question: 'Difference between queue and deque?', answer: 'Queue restricts insertion/removal ends; deque allows both ends.' },
      { question: 'Why use circular queue?', answer: 'Efficient memory reuse without shifting elements.' },
    ],
    practiceQuestions: ['Implement queue using two stacks.', 'Simulate round-robin scheduler.', 'Detect queue overflow/underflow cases.'],
  },
  'linked-list': {
    prerequisites: ['Pointers/references', 'Node structure (value,next)', 'Traversal logic'],
    technique: 'Store elements as nodes linked by pointers; insert/delete by pointer rewiring.',
    branching: ['Head insert/delete needs special handling', 'Search stops at null or matching node'],
    realLifeExamples: ['Music playlist next-track links', 'Hash table chaining buckets'],
    interviewQA: [
      { question: 'Why can linked list insert be O(1)?', answer: 'With node reference, pointer updates avoid shifting elements.' },
      { question: 'Main downside vs arrays?', answer: 'No direct indexing; poor cache locality and extra pointer memory.' },
    ],
    practiceQuestions: ['Reverse a linked list iteratively.', 'Detect cycle (Floyd algorithm).', 'Remove Nth node from end.'],
  },
  'binary-tree': {
    prerequisites: ['Tree terminology (root/leaf/height)', 'Recursion traversals', 'BST property basics'],
    technique: 'For BST, route smaller values left and larger values right during insert/search.',
    branching: ['If value < node, go left; else go right', 'Stop at null (insert) or match (search)'],
    realLifeExamples: ['Hierarchical file structures', 'Ordered in-memory indices'],
    interviewQA: [
      { question: 'Why can BST degrade to O(n)?', answer: 'Skewed insertion order creates unbalanced tree.' },
      { question: 'How to avoid skew?', answer: 'Use self-balancing trees like AVL or Red-Black Tree.' },
    ],
    practiceQuestions: ['Implement inorder traversal.', 'Compute tree height recursively.', 'Validate if a tree is a BST.'],
  },
  'hash-table': {
    prerequisites: ['Hash function idea', 'Collision handling', 'Load factor concept'],
    technique: 'Map keys to bucket indices via hash; resolve collisions by chaining/probing.',
    branching: ['If bucket occupied, resolve collision path', 'Resize/rehash when load factor crosses threshold'],
    realLifeExamples: ['Caching key-value pairs', 'Fast user/session lookup'],
    interviewQA: [
      { question: 'Average vs worst-case lookup?', answer: 'Average O(1), worst O(n) with heavy collisions.' },
      { question: 'Why does load factor matter?', answer: 'Higher load increases collisions and degrades performance.' },
    ],
    practiceQuestions: ['Design hash table with separate chaining.', 'Implement rehashing strategy.', 'Compare chaining vs open addressing.'],
  },
  bfs: {
    prerequisites: ['Graph representation (adjacency list)', 'Queue usage', 'Visited set concept'],
    technique: 'Explore graph level by level using a queue from the start node.',
    branching: ['If neighbor unvisited, mark and enqueue', 'Skip already visited nodes'],
    realLifeExamples: ['Shortest path in unweighted networks', 'Social connection degree analysis'],
    interviewQA: [
      { question: 'Why does BFS find shortest unweighted path?', answer: 'It explores nodes in increasing edge-distance order.' },
      { question: 'BFS vs DFS key difference?', answer: 'BFS uses queue/levels; DFS uses stack/depth-first exploration.' },
    ],
    practiceQuestions: ['Find shortest path length in unweighted graph.', 'Count connected components with BFS.', 'Run multi-source BFS from several starts.'],
  },
  dfs: {
    prerequisites: ['Graph traversal basics', 'Recursion or explicit stack', 'Visited tracking'],
    technique: 'Go deep along a branch, backtrack when no unvisited neighbor remains.',
    branching: ['If neighbor unvisited, recurse/push', 'On dead end, backtrack'],
    realLifeExamples: ['Maze solving and backtracking', 'Dependency/feature reachability checks'],
    interviewQA: [
      { question: 'When is DFS preferred?', answer: 'When exploring full structure/path existence or doing topological-style traversals.' },
      { question: 'Can DFS give shortest path in unweighted graph?', answer: 'Not guaranteed; BFS is the shortest-path guarantee there.' },
    ],
    practiceQuestions: ['Detect cycle in directed graph.', 'Implement iterative DFS using stack.', 'Generate topological order (DAG).'],
  },
  dijkstra: {
    prerequisites: ['Weighted graphs', 'Priority queue (min-heap)', 'Relaxation concept'],
    technique: 'Repeatedly pick node with smallest tentative distance and relax outgoing edges.',
    branching: ['If newDist < dist[v], update dist and push to heap', 'Skip outdated heap entries'],
    realLifeExamples: ['GPS route planning with non-negative costs', 'Network latency routing'],
    interviewQA: [
      { question: 'Why non-negative edge weights only?', answer: 'Negative edges can break greedy optimality of settled nodes.' },
      { question: 'Difference from BFS?', answer: 'BFS is for unweighted/equal-weight edges; Dijkstra handles weighted non-negative edges.' },
    ],
    practiceQuestions: ['Trace relaxation table for sample graph.', 'Reconstruct shortest path using parent array.', 'Compare with Bellman-Ford on negative edge cases.'],
  },
  'pathfinding-bfs': {
    prerequisites: ['Grid as graph mapping', 'Queue traversal', 'Obstacle handling'],
    technique: 'Treat each open cell as a node and expand level-by-level to find shortest unweighted path.',
    branching: ['If neighbor inside bounds and not wall/visited, enqueue', 'Stop when end cell dequeued'],
    realLifeExamples: ['Grid-based game movement with equal step costs', 'Robot movement on uniform floor tiles'],
    interviewQA: [
      { question: 'Why BFS is optimal on unweighted grid?', answer: 'All moves have equal cost, so first reach is shortest.' },
      { question: 'What data is needed for path reconstruction?', answer: 'A parent/predecessor map for each visited cell.' },
    ],
    practiceQuestions: ['Implement 4-direction BFS on matrix.', 'Add blocked cells and no-path detection.', 'Extend to multi-source BFS from many starts.'],
  },
  'pathfinding-dijkstra': {
    prerequisites: ['Grid with weighted costs', 'Min-heap usage', 'Distance map updates'],
    technique: 'Use Dijkstra on grid cells where move cost may differ by terrain.',
    branching: ['Relax neighbor if new cost is lower', 'Ignore outdated popped states'],
    realLifeExamples: ['Routing with terrain/time penalties', 'Warehouse robots with zone costs'],
    interviewQA: [
      { question: 'When does Dijkstra equal BFS?', answer: 'When all edge weights are equal.' },
      { question: 'Why maintain visited/finalized state carefully?', answer: 'To avoid reprocessing nodes unnecessarily and keep correctness.' },
    ],
    practiceQuestions: ['Assign different terrain weights and trace route.', 'Compare runtime with BFS on same grid.', 'Implement path reconstruction from predecessor cells.'],
  },
  'pathfinding-astar': {
    prerequisites: ['Dijkstra understanding', 'Heuristic functions (Manhattan)', 'f=g+h scoring'],
    technique: 'Prioritize nodes by actual cost so far plus heuristic estimate to goal for directed search.',
    branching: ['If better g-score found, update parent and queue', 'Choose node with smallest f-score next'],
    realLifeExamples: ['Game AI navigation', 'Interactive map pathfinding where speed matters'],
    interviewQA: [
      { question: 'What makes A* optimal?', answer: 'An admissible and consistent heuristic keeps best-path guarantees.' },
      { question: 'Why can A* be faster than Dijkstra?', answer: 'Heuristic focuses exploration toward the goal, reducing visited nodes.' },
    ],
    practiceQuestions: ['Use Manhattan vs Euclidean heuristic and compare.', 'Show a case where weak heuristic behaves like Dijkstra.', 'Prove admissibility for chosen heuristic.'],
  },
};

export function getAlgorithmLearningContent(algorithmId: string): AlgorithmLearningContent {
  return LEARNING_CONTENT[algorithmId] ?? GENERIC_CONTENT;
}
