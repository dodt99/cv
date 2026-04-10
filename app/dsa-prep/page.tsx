"use client";

import { useState } from "react";

type Category = {
  id: string;
  title: string;
  icon: string;
  items: {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    concepts: string[];
    problem: string;
    examples?: { input: string; output: string; explanation?: string }[];
    solution: string;
    timeComplexity: string;
    spaceComplexity: string;
    hints?: string[];
  }[];
};

const categories: Category[] = [
  {
    id: "arrays",
    title: "Arrays & Hashing",
    icon: "📊",
    items: [
      {
        id: "two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        concepts: ["Hash Map", "Array Traversal"],
        problem:
          "Cho một mảng số nguyên `nums` và một số nguyên `target`, trả về indices của hai số sao cho tổng của chúng bằng `target`.\n\nBạn có thể giả định rằng mỗi input có đúng một giải pháp, và bạn không thể sử dụng cùng một phần tử hai lần.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Vì nums[0] + nums[1] == 9, ta trả về [0, 1].",
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
          },
        ],
        solution: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        hints: [
          "Sử dụng Hash Map để lưu trữ các số đã duyệt qua",
          "Với mỗi số, kiểm tra xem complement (target - num) có trong map chưa",
          "Nếu có, return indices; nếu không, thêm số hiện tại vào map",
        ],
      },
      {
        id: "contains-duplicate",
        title: "Contains Duplicate",
        difficulty: "Easy",
        concepts: ["Set", "Hash Map"],
        problem:
          "Cho một mảng số nguyên `nums`, trả về `true` nếu có bất kỳ giá trị nào xuất hiện ít nhất hai lần trong mảng, và trả về `false` nếu mọi phần tử đều khác nhau.",
        examples: [
          { input: "nums = [1,2,3,1]", output: "true" },
          { input: "nums = [1,2,3,4]", output: "false" },
        ],
        solution: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  
  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }
  
  return false;
}

// Cách 2: Ngắn gọn hơn
function containsDuplicate2(nums: number[]): boolean {
  return new Set(nums).size !== nums.length;
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        hints: [
          "Set tự động loại bỏ các phần tử trùng lặp",
          "So sánh kích thước của Set với độ dài mảng gốc",
        ],
      },
      {
        id: "valid-anagram",
        title: "Valid Anagram",
        difficulty: "Easy",
        concepts: ["Hash Map", "String"],
        problem:
          "Cho hai chuỗi `s` và `t`, trả về `true` nếu `t` là anagram của `s`, và `false` nếu ngược lại.\n\nAnagram là một từ hoặc cụm từ được hình thành bằng cách sắp xếp lại các chữ cái của một từ hoặc cụm từ khác, thường sử dụng tất cả các chữ cái gốc đúng một lần.",
        examples: [
          { input: 's = "anagram", t = "nagaram"', output: "true" },
          { input: 's = "rat", t = "car"', output: "false" },
        ],
        solution: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  
  const count = new Map<string, number>();
  
  for (const char of s) {
    count.set(char, (count.get(char) || 0) + 1);
  }
  
  for (const char of t) {
    if (!count.has(char) || count.get(char) === 0) {
      return false;
    }
    count.set(char, count.get(char)! - 1);
  }
  
  return true;
}

// Cách 2: Sắp xếp (O(n log n))
function isAnagram2(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}`,
        timeComplexity: "O(n) với Hash Map, O(n log n) với sorting",
        spaceComplexity: "O(1) vì chỉ có 26 chữ cái (hoặc O(n) với sorting)",
        hints: [
          "Đếm tần suất xuất hiện của mỗi ký tự trong chuỗi đầu tiên",
          "Kiểm tra tần suất trong chuỗi thứ hai có khớp không",
        ],
      },
    ],
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    icon: "👉",
    items: [
      {
        id: "valid-palindrome",
        title: "Valid Palindrome",
        difficulty: "Easy",
        concepts: ["Two Pointers", "String"],
        problem:
          "Cho một chuỗi `s`, xác định xem nó có phải là palindrome hay không, chỉ xem xét các ký tự alphanumeric và bỏ qua hoa/thường.\n\nPalindrome là một từ, cụm từ, số hoặc chuỗi ký tự khác đọc giống nhau từ trái sang phải và từ phải sang trái.",
        examples: [
          {
            input: 's = "A man, a plan, a canal: Panama"',
            output: "true",
            explanation:
              '"amanaplanacanalpanama" là palindrome sau khi loại bỏ ký tự đặc biệt.',
          },
          { input: 's = "race a car"', output: "false" },
        ],
        solution: `function isPalindrome(s: string): boolean {
  // Chuyển về lowercase và chỉ giữ alphanumeric
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n) do tạo chuỗi mới",
        hints: [
          "Dùng hai con trỏ, một từ đầu và một từ cuối",
          "So sánh ký tự tại hai con trỏ, nếu khác nhau thì không phải palindrome",
          "Di chuyển cả hai con trỏ vào trong cho đến khi chúng gặp nhau",
        ],
      },
      {
        id: "three-sum",
        title: "3Sum",
        difficulty: "Medium",
        concepts: ["Two Pointers", "Sorting"],
        problem:
          "Cho một mảng số nguyên `nums`, trả về tất cả các bộ ba [nums[i], nums[j], nums[k]] sao cho i != j, i != k, và j != k, và nums[i] + nums[j] + nums[k] == 0.\n\nLưu ý rằng solution set không được chứa các bộ ba trùng lặp.",
        examples: [
          {
            input: "nums = [-1,0,1,2,-1,-4]",
            output: "[[-1,-1,2],[-1,0,1]]",
            explanation:
              "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.",
          },
        ],
        solution: `function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];
  nums.sort((a, b) => a - b);
  
  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicates cho số đầu tiên
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let left = i + 1;
    let right = nums.length - 1;
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        
        // Skip duplicates
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  
  return result;
}`,
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1) không tính output array",
        hints: [
          "Sắp xếp mảng trước",
          "Fix một số, sau đó dùng two pointers để tìm hai số còn lại",
          "Nhớ skip các số trùng lặp để tránh kết quả trùng",
        ],
      },
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    icon: "🪟",
    items: [
      {
        id: "best-time-stock",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        concepts: ["Sliding Window", "Array"],
        problem:
          "Cho một mảng `prices` trong đó `prices[i]` là giá của một cổ phiếu trong ngày thứ i.\n\nBạn muốn tối đa hóa lợi nhuận của mình bằng cách chọn một ngày để mua một cổ phiếu và chọn một ngày khác trong tương lai để bán cổ phiếu đó.\n\nTrả về lợi nhuận tối đa bạn có thể đạt được từ giao dịch này. Nếu bạn không thể đạt được bất kỳ lợi nhuận nào, hãy trả về 0.",
        examples: [
          {
            input: "prices = [7,1,5,3,6,4]",
            output: "5",
            explanation:
              "Mua ngày 2 (giá = 1) và bán ngày 5 (giá = 6), lợi nhuận = 6-1 = 5.",
          },
        ],
        solution: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  
  return maxProfit;
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        hints: [
          "Theo dõi giá thấp nhất đã thấy cho đến nay",
          "Với mỗi giá, tính lợi nhuận nếu bán tại giá đó",
          "Cập nhật lợi nhuận tối đa nếu tìm thấy lợi nhuận cao hơn",
        ],
      },
      {
        id: "longest-substring",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        concepts: ["Sliding Window", "Hash Map"],
        problem:
          "Cho một chuỗi `s`, tìm độ dài của chuỗi con dài nhất mà không có ký tự lặp lại.",
        examples: [
          {
            input: 's = "abcabcbb"',
            output: "3",
            explanation: 'Chuỗi con là "abc", với độ dài 3.',
          },
          {
            input: 's = "bbbbb"',
            output: "1",
            explanation: 'Chuỗi con là "b", với độ dài 1.',
          },
        ],
        solution: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>();
  let maxLen = 0;
  let start = 0;
  
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    
    // Nếu gặp ký tự đã thấy và nằm trong window hiện tại
    if (seen.has(char) && seen.get(char)! >= start) {
      start = seen.get(char)! + 1;
    }
    
    seen.set(char, end);
    maxLen = Math.max(maxLen, end - start + 1);
  }
  
  return maxLen;
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(n, m)) với m là kích thước charset",
        hints: [
          "Dùng sliding window với hai con trỏ start và end",
          "Dùng Map để lưu vị trí cuối cùng của mỗi ký tự",
          "Khi gặp ký tự trùng, di chuyển start đến sau vị trí trùng",
        ],
      },
    ],
  },
  {
    id: "stack",
    title: "Stack",
    icon: "📚",
    items: [
      {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        concepts: ["Stack"],
        problem:
          "Cho một chuỗi `s` chỉ chứa các ký tự '(', ')', '{', '}', '[' và ']', xác định xem chuỗi đầu vào có hợp lệ hay không.\n\nMột chuỗi đầu vào là hợp lệ nếu:\n1. Các dấu ngoặc mở phải được đóng bởi cùng loại dấu ngoặc.\n2. Các dấu ngoặc mở phải được đóng theo đúng thứ tự.\n3. Mỗi dấu ngoặc đóng phải có một dấu ngoặc mở tương ứng cùng loại.",
        examples: [
          { input: 's = "()"', output: "true" },
          { input: 's = "()[]{}"', output: "true" },
          { input: 's = "(]"', output: "false" },
        ],
        solution: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (const char of s) {
    if (char in pairs) {
      // Nếu là ngoặc đóng
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      // Nếu là ngoặc mở
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        hints: [
          "Dùng stack để theo dõi các ngoặc mở",
          "Khi gặp ngoặc đóng, kiểm tra xem ngoặc mở tương ứng có ở đỉnh stack không",
          "Cuối cùng, stack phải rỗng",
        ],
      },
    ],
  },
  {
    id: "linked-list",
    title: "Linked List",
    icon: "🔗",
    items: [
      {
        id: "reverse-linked-list",
        title: "Reverse Linked List",
        difficulty: "Easy",
        concepts: ["Linked List", "Two Pointers"],
        problem:
          "Cho head của một singly linked list, đảo ngược danh sách và trả về reversed list.",
        examples: [
          { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
          { input: "head = [1,2]", output: "[2,1]" },
        ],
        solution: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val===undefined ? 0 : val);
    this.next = (next===undefined ? null : next);
  }
}

// Cách 1: Iterative
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  return prev;
}

// Cách 2: Recursive
function reverseListRecursive(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) {
    return head;
  }
  
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  
  return newHead;
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) iterative, O(n) recursive (call stack)",
        hints: [
          "Dùng ba con trỏ: prev, curr, và next",
          "Với mỗi node, trỏ next của nó về prev",
          "Di chuyển cả ba con trỏ tiếp theo",
        ],
      },
      {
        id: "merge-two-lists",
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        concepts: ["Linked List", "Two Pointers"],
        problem:
          "Bạn được cho heads của hai sorted linked lists `list1` và `list2`.\n\nMerge hai lists thành một sorted list. List này được tạo thành bằng cách nối các nodes của hai lists đầu tiên.",
        examples: [
          {
            input: "list1 = [1,2,4], list2 = [1,3,4]",
            output: "[1,1,2,3,4,4]",
          },
        ],
        solution: `function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }
  
  // Nối phần còn lại
  current.next = list1 !== null ? list1 : list2;
  
  return dummy.next;
}`,
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(1)",
        hints: [
          "Dùng dummy node để đơn giản hóa việc xử lý head",
          "So sánh giá trị của hai node hiện tại, chọn node nhỏ hơn",
          "Sau khi một list hết, nối phần còn lại của list kia",
        ],
      },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    icon: "🔍",
    items: [
      {
        id: "binary-search-basic",
        title: "Binary Search",
        difficulty: "Easy",
        concepts: ["Binary Search", "Array"],
        problem:
          "Cho một mảng số nguyên `nums` được sắp xếp theo thứ tự tăng dần và một số nguyên `target`, viết một hàm để tìm kiếm `target` trong `nums`. Nếu `target` tồn tại, trả về index của nó. Nếu không, trả về -1.\n\nBạn phải viết một thuật toán có độ phức tạp O(log n).",
        examples: [
          { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
          { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
        ],
        solution: `function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        hints: [
          "Dùng hai con trỏ left và right",
          "Tính mid = (left + right) / 2",
          "So sánh nums[mid] với target và thu hẹp phạm vi tìm kiếm",
        ],
      },
    ],
  },
  {
    id: "trees",
    title: "Binary Tree",
    icon: "🌳",
    items: [
      {
        id: "max-depth",
        title: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        concepts: ["Binary Tree", "DFS", "Recursion"],
        problem:
          "Cho root của một binary tree, trả về maximum depth của nó.\n\nMaximum depth của một binary tree là số nodes dọc theo đường dài nhất từ root node xuống leaf node xa nhất.",
        examples: [
          { input: "root = [3,9,20,null,null,15,7]", output: "3" },
          { input: "root = [1,null,2]", output: "2" },
        ],
        solution: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val===undefined ? 0 : val);
    this.left = (left===undefined ? null : left);
    this.right = (right===undefined ? null : right);
  }
}

// Cách 1: Recursive (DFS)
function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  
  return Math.max(leftDepth, rightDepth) + 1;
}

// Cách 2: Iterative (BFS)
function maxDepthBFS(root: TreeNode | null): number {
  if (root === null) return 0;
  
  const queue: TreeNode[] = [root];
  let depth = 0;
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    depth++;
  }
  
  return depth;
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) với h là height của tree (worst case O(n))",
        hints: [
          "Dùng đệ quy: depth = 1 + max(left depth, right depth)",
          "Base case: nếu node null, return 0",
          "Hoặc dùng BFS và đếm số level",
        ],
      },
      {
        id: "invert-tree",
        title: "Invert Binary Tree",
        difficulty: "Easy",
        concepts: ["Binary Tree", "DFS"],
        problem:
          "Cho root của một binary tree, đảo ngược tree và trả về root của nó.",
        examples: [
          {
            input: "root = [4,2,7,1,3,6,9]",
            output: "[4,7,2,9,6,3,1]",
          },
        ],
        solution: `function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  
  // Swap left và right
  const temp = root.left;
  root.left = root.right;
  root.right = temp;
  
  // Recursively invert subtrees
  invertTree(root.left);
  invertTree(root.right);
  
  return root;
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) với h là height của tree",
        hints: [
          "Swap left và right subtree cho mỗi node",
          "Dùng đệ quy để xử lý các subtree",
        ],
      },
    ],
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    icon: "💡",
    items: [
      {
        id: "climbing-stairs",
        title: "Climbing Stairs",
        difficulty: "Easy",
        concepts: ["Dynamic Programming", "Fibonacci"],
        problem:
          "Bạn đang leo một cầu thang. Cần `n` bước để đến đỉnh.\n\nMỗi lần bạn có thể leo 1 hoặc 2 bước. Có bao nhiêu cách khác nhau bạn có thể leo lên đỉnh?",
        examples: [
          {
            input: "n = 2",
            output: "2",
            explanation:
              "Có hai cách để leo lên đỉnh.\n1. 1 bước + 1 bước\n2. 2 bước",
          },
          {
            input: "n = 3",
            output: "3",
            explanation:
              "Có ba cách để leo lên đỉnh.\n1. 1 bước + 1 bước + 1 bước\n2. 1 bước + 2 bước\n3. 2 bước + 1 bước",
          },
        ],
        solution: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  
  let prev2 = 1; // n = 1
  let prev1 = 2; // n = 2
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}

// Cách 2: DP array
function climbStairsDP(n: number): number {
  if (n <= 2) return n;
  
  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1) với space optimization, O(n) với DP array",
        hints: [
          "Để đến bước n, bạn có thể đến từ bước n-1 hoặc n-2",
          "Công thức: f(n) = f(n-1) + f(n-2) (giống Fibonacci)",
          "Có thể tối ưu space bằng cách chỉ lưu 2 giá trị trước đó",
        ],
      },
    ],
  },
];

type LearningPhase = {
  id: string;
  label: string;
  title: string;
  color: string;
  resources: {
    name: string;
    icon: string;
    description: string;
    url: string;
    tags: ("free" | "paid" | "vn" | "en" | "video" | "book" | "practice")[];
  }[];
};

const learningPhases: LearningPhase[] = [
  {
    id: "phase1",
    label: "Giai đoạn 1",
    title: "Nền tảng lý thuyết",
    color: "emerald",
    resources: [
      {
        name: "Kênh DSATVN (YouTube)",
        icon: "🎬",
        description:
          "Giảng dạy DSA bằng tiếng Việt, từ array đến graph, rất phù hợp người mới bắt đầu",
        url: "https://www.youtube.com/@DSATVN",
        tags: ["free", "vn", "video"],
      },
      {
        name: "VNOI Wiki",
        icon: "📖",
        description:
          "Tài liệu lý thuyết DSA đầy đủ nhất tiếng Việt, do cộng đồng lập trình thi đấu Việt Nam xây dựng",
        url: "https://vnoi.info/wiki/algo/basic",
        tags: ["free", "vn", "book"],
      },
      {
        name: "CS50 — Harvard (edX)",
        icon: "🎓",
        description:
          "Khóa nhập môn kinh điển, có phần về cấu trúc dữ liệu và thuật toán sắp xếp, tìm kiếm",
        url: "https://cs50.harvard.edu/x/",
        tags: ["free", "en", "video"],
      },
      {
        name: "VisuAlgo",
        icon: "👁️",
        description:
          "Trực quan hóa các thuật toán và cấu trúc dữ liệu bằng animation — hiểu nhanh hơn rất nhiều",
        url: "https://www.visualgo.net/en",
        tags: ["free", "en"],
      },
      {
        name: "GeeksforGeeks — DSA",
        icon: "📄",
        description:
          "Tham khảo lý thuyết nhanh với code mẫu C++/Java/Python cho từng chủ đề",
        url: "https://www.geeksforgeeks.org/data-structures/",
        tags: ["free", "en", "book"],
      },
    ],
  },
  {
    id: "phase2",
    label: "Giai đoạn 2",
    title: "Khóa học có cấu trúc",
    color: "blue",
    resources: [
      {
        name: "NeetCode Roadmap",
        icon: "🗺️",
        description:
          "Lộ trình học theo chủ đề rất rõ ràng kèm video giải từng bài, phổ biến nhất để chuẩn bị phỏng vấn",
        url: "https://neetcode.io/roadmap",
        tags: ["free", "en", "video", "practice"],
      },
      {
        name: "Algorithms Specialization — Stanford (Coursera)",
        icon: "🎓",
        description:
          "4 khóa học chuyên sâu từ Tim Roughgarden, nền tảng lý thuyết vững chắc kèm bài tập lập trình",
        url: "https://www.coursera.org/specializations/algorithms",
        tags: ["paid", "en", "video"],
      },
      {
        name: "DSA Masterclass — Colt Steele (Udemy)",
        icon: "🛒",
        description:
          "Giảng dạy bằng JavaScript, rất phù hợp cho web developer, giải thích trực quan dễ hiểu",
        url: "https://www.udemy.com/course/js-algorithms-and-data-structures-masterclass/",
        tags: ["paid", "en", "video"],
      },
      {
        name: "Techmaster Vietnam",
        icon: "🇻🇳",
        description:
          "Khóa học DSA tiếng Việt với giảng viên hỗ trợ trực tiếp, phù hợp cho người đi làm",
        url: "https://techmaster.vn",
        tags: ["paid", "vn", "video"],
      },
    ],
  },
  {
    id: "phase3",
    label: "Giai đoạn 3",
    title: "Sách tham khảo chuyên sâu",
    color: "purple",
    resources: [
      {
        name: "CLRS — Introduction to Algorithms",
        icon: "📚",
        description:
          "Kinh thánh về thuật toán, phân tích độ phức tạp cực kỳ chặt chẽ. Dùng như sách tham khảo, không cần đọc hết",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
        tags: ["paid", "en", "book"],
      },
      {
        name: "CP-Algorithms",
        icon: "⚡",
        description:
          "Tài liệu lý thuyết + code C++ chuẩn cho competitive programming, phong phú và cập nhật liên tục",
        url: "https://cp-algorithms.com/",
        tags: ["free", "en", "book"],
      },
      {
        name: "The Algorithm Design Manual — Skiena",
        icon: "📗",
        description:
          "Tiếp cận thực tế hơn CLRS, nhiều ví dụ ứng dụng thực tế, phù hợp kỹ sư phần mềm",
        url: "https://www.algorist.com/",
        tags: ["paid", "en", "book"],
      },
    ],
  },
  {
    id: "phase4",
    label: "Giai đoạn 4",
    title: "Luyện bài tập thực chiến",
    color: "orange",
    resources: [
      {
        name: "LeetCode",
        icon: "⚔️",
        description:
          "Nền tảng số 1 để luyện phỏng vấn, 3000+ bài, có community editorial và discuss rất giá trị",
        url: "https://leetcode.com/",
        tags: ["free", "en", "practice"],
      },
      {
        name: "Codeforces",
        icon: "🏆",
        description:
          "Nền tảng competitive programming hàng đầu, contest mỗi tuần, rèn tư duy giải thuật rất tốt",
        url: "https://codeforces.com/",
        tags: ["free", "en", "practice"],
      },
      {
        name: "VNOJ — VNOI Online Judge",
        icon: "🇻🇳",
        description:
          "Hệ thống bài tập tiếng Việt, nhiều bài từ các kỳ thi HSG, ACM Việt Nam, thích hợp luyện tập trong nước",
        url: "https://vnoj.ml/",
        tags: ["free", "vn", "practice"],
      },
      {
        name: "HackerRank — DSA",
        icon: "🟢",
        description:
          "Bài tập theo từng chủ đề cụ thể (Array, LinkedList, Tree...), có hướng dẫn, phù hợp người mới",
        url: "https://www.hackerrank.com/domains/data-structures",
        tags: ["free", "en", "practice"],
      },
      {
        name: "InterviewBit",
        icon: "💼",
        description:
          "Bài tập được cấu trúc theo lộ trình phỏng vấn kỹ sư, có gợi ý và giải thích từng bước",
        url: "https://www.interviewbit.com/courses/programming/",
        tags: ["free", "en", "practice"],
      },
    ],
  },
];

function ResourceTag({ tag }: { tag: string }) {
  const tagStyles: Record<string, string> = {
    free: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    paid: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    vn: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    en: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    video: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    book: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    practice:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  const tagLabels: Record<string, string> = {
    free: "Miễn phí",
    paid: "Trả phí",
    vn: "Tiếng Việt",
    en: "Tiếng Anh",
    video: "Video",
    book: "Sách/Tài liệu",
    practice: "Luyện đề",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded font-medium ${tagStyles[tag]}`}
    >
      {tagLabels[tag]}
    </span>
  );
}

function LearningGuide() {
  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set());

  const togglePhase = (phaseId: string) => {
    setOpenPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  const phaseColors: Record<string, { header: string; label: string }> = {
    emerald: {
      header: "bg-emerald-50 dark:bg-emerald-950/50",
      label: "text-emerald-700 dark:text-emerald-400",
    },
    blue: {
      header: "bg-blue-50 dark:bg-blue-950/50",
      label: "text-blue-700 dark:text-blue-400",
    },
    purple: {
      header: "bg-purple-50 dark:bg-purple-950/50",
      label: "text-purple-700 dark:text-purple-400",
    },
    orange: {
      header: "bg-orange-50 dark:bg-orange-950/50",
      label: "text-orange-700 dark:text-orange-400",
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
        📚 Hướng dẫn cách học DSA hiệu quả
      </h2>

      <div className="flex flex-wrap gap-2 mb-6">
        <ResourceTag tag="free" />
        <ResourceTag tag="paid" />
        <ResourceTag tag="vn" />
        <ResourceTag tag="en" />
        <ResourceTag tag="video" />
        <ResourceTag tag="book" />
        <ResourceTag tag="practice" />
      </div>

      <div className="space-y-4">
        {learningPhases.map((phase) => {
          const isOpen = openPhases.has(phase.id);
          const colors = phaseColors[phase.color];

          return (
            <div
              key={phase.id}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => togglePhase(phase.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${colors.header}`}
              >
                <span className={`text-sm font-medium ${colors.label}`}>
                  {phase.label}
                </span>
                <span className="text-base font-semibold text-zinc-900 dark:text-white flex-1">
                  {phase.title}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {phase.resources.length} nguồn
                </span>
                <span
                  className={`text-zinc-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="p-3 space-y-2">
                  {phase.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                    >
                      <span className="text-xl shrink-0">{resource.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-zinc-900 dark:text-white mb-1">
                          {resource.name}
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                          {resource.description}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map((tag) => (
                            <ResourceTag key={tag} tag={tag} />
                          ))}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DifficultyBadge({
  difficulty,
}: {
  difficulty: "Easy" | "Medium" | "Hard";
}) {
  const colors = {
    Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded ${colors[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

function ProblemCard({ problem }: { problem: Category["items"][0] }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-5 bg-white dark:bg-zinc-800/50">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {problem.title}
        </h3>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {problem.concepts.map((concept) => (
          <span
            key={concept}
            className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded"
          >
            {concept}
          </span>
        ))}
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
        <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
          {problem.problem}
        </div>
      </div>

      {problem.examples && (
        <div className="mb-4 space-y-2">
          {problem.examples.map((example, idx) => (
            <div
              key={idx}
              className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3 text-sm font-mono"
            >
              <div className="text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold">Input:</span> {example.input}
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold">Output:</span> {example.output}
              </div>
              {example.explanation && (
                <div className="text-zinc-500 dark:text-zinc-500 text-xs mt-1">
                  {example.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {problem.hints && problem.hints.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1"
          >
            {showHints ? "▼" : "▶"} Gợi ý ({problem.hints.length})
          </button>
          {showHints && (
            <div className="mt-2 space-y-2">
              {problem.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="text-sm text-zinc-600 dark:text-zinc-400 pl-4 border-l-2 border-amber-300 dark:border-amber-700"
                >
                  {idx + 1}. {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showSolution ? "Ẩn Solution" : "Xem Solution"}
        </button>
      </div>

      {showSolution && (
        <div className="space-y-3">
          <div className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-100">
              <code>{problem.solution}</code>
            </pre>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                Time:
              </span>{" "}
              <span className="text-zinc-600 dark:text-zinc-400">
                {problem.timeComplexity}
              </span>
            </div>
            <div>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                Space:
              </span>{" "}
              <span className="text-zinc-600 dark:text-zinc-400">
                {problem.spaceComplexity}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DSAPrep() {
  const [selectedCategory, setSelectedCategory] = useState<string>("arrays");
  const [searchTerm, setSearchTerm] = useState("");

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  const filteredProblems = currentCategory
    ? currentCategory.items.filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          problem.concepts.some((c) =>
            c.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : [];

  const totalProblems = categories.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Data Structures & Algorithms
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ôn tập và chuẩn bị phỏng vấn DSA cho Developer • {totalProblems} bài
            tập
          </p>
        </div>

        <LearningGuide />

        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 sticky top-6">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                Categories
              </h2>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-700/50"
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="flex-1">{category.title}</span>
                    <span className="text-xs bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded">
                      {category.items.length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {currentCategory && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{currentCategory.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {currentCategory.title}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {filteredProblems.length} bài tập
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredProblems.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                      Không tìm thấy bài tập nào
                    </div>
                  ) : (
                    filteredProblems.map((problem) => (
                      <ProblemCard key={problem.id} problem={problem} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
