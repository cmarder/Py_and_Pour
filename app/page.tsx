"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type PyodideRuntime = {
  runPythonAsync: (code: string) => Promise<string>;
};

declare global {
  interface Window {
    loadPyodide?: (options?: { indexURL?: string }) => Promise<PyodideRuntime>;
  }
}

type Challenge = {
  id: string;
  title: string;
  concept: string;
  story: string;
  prompt: string;
  starter: string;
  solution: string;
  expected: string;
  hints: [string, string];
  explanation: string;
  xp: number;
};

type Concept = {
  id: string;
  title: string;
  subtitle: string;
  tasks: Challenge[];
};

const CONCEPTS: Concept[] = [
  {
    id: "bean-basics",
    title: "Bean Basics",
    subtitle: "Values, lists & choices",
    tasks: [
      {
        id: "basics-menu-line",
        title: "Chalkboard Special",
        concept: "Variables + f-strings",
        story:
          "The first customer of the morning asks what is on special. Turn the barista’s notes into one friendly chalkboard line.",
        prompt:
          'Use drink and price to print exactly: Maple latte costs $5.25',
        starter:
          'drink = "Maple latte"\nprice = 5.25\n\n# Use both variables in one f-string\n',
        solution:
          'drink = "Maple latte"\nprice = 5.25\n\nprint(f"{drink} costs ${price:.2f}")',
        expected: "Maple latte costs $5.25",
        hints: [
          "Start with print(f\"...\") so variable names can live inside curly braces.",
          "Use {drink} for the name and {price:.2f} to show two decimal places.",
        ],
        explanation:
          "Variables give useful names to values. An f-string blends those values into readable text without awkward concatenation.",
        xp: 20,
      },
      {
        id: "basics-temperature",
        title: "Mug Temperature",
        concept: "Booleans + conditions",
        story:
          "A mug has been resting by the rainy window. Decide whether it is still warm enough to serve.",
        prompt:
          'If temperature is at least 60, print "Warm mug". Otherwise print "Needs a refresh".',
        starter:
          "temperature = 64\n\n# Add an if/else decision below\n",
        solution:
          'temperature = 64\n\nif temperature >= 60:\n    print("Warm mug")\nelse:\n    print("Needs a refresh")',
        expected: "Warm mug",
        hints: [
          "The comparison temperature >= 60 becomes either True or False.",
          "Put one print under if and the other under else. Remember to indent both branches.",
        ],
        explanation:
          "A condition lets the program choose a path. Only the indented block under the matching branch runs.",
        xp: 25,
      },
      {
        id: "basics-first-order",
        title: "First Cup Up",
        concept: "List indexing",
        story:
          "Three drinks are lined up on the counter. Call out the first order without changing the list.",
        prompt: 'Use the list to print exactly: First order: chai',
        starter:
          'orders = ["chai", "cortado", "mocha"]\n\n# Lists begin at position 0\n',
        solution:
          'orders = ["chai", "cortado", "mocha"]\n\nprint(f"First order: {orders[0]}")',
        expected: "First order: chai",
        hints: [
          "The first position in a Python list is 0, not 1.",
          'Place orders[0] inside an f-string that begins with "First order: ".',
        ],
        explanation:
          "List indexing retrieves one item by position. Python starts counting positions from zero.",
        xp: 30,
      },
      {
        id: "basics-add-order",
        title: "One More for the Table",
        concept: "List methods",
        story:
          "A friend arrives late and adds a matcha to the table’s order. Update the list without rebuilding it.",
        prompt:
          'Add "matcha" to drinks, then print the complete list.',
        starter:
          'drinks = ["cortado", "mocha"]\n\n# Add one drink, then print the list\n',
        solution:
          'drinks = ["cortado", "mocha"]\n\ndrinks.append("matcha")\nprint(drinks)',
        expected: "['cortado', 'mocha', 'matcha']",
        hints: [
          "Lists have a method named append that adds one item to the end.",
          'Call drinks.append("matcha") before printing drinks.',
        ],
        explanation:
          "append changes the existing list by adding one new item at the end.",
        xp: 35,
      },
      {
        id: "basics-cookie-reward",
        title: "Cookie on the House",
        concept: "Combining basics",
        story:
          "Regulars collect coffee beans with every visit. Check whether this guest has earned today’s cookie.",
        prompt:
          'Print "free cookie" for 100 or more beans; otherwise print how many more beans are needed.',
        starter:
          "beans = 120\nreward_cost = 100\n\n# Make the reward decision\n",
        solution:
          'beans = 120\nreward_cost = 100\n\nif beans >= reward_cost:\n    print("free cookie")\nelse:\n    print(f"{reward_cost - beans} more beans needed")',
        expected: "free cookie",
        hints: [
          "Compare beans with reward_cost using >=.",
          "The else branch can subtract beans from reward_cost to calculate what is missing.",
        ],
        explanation:
          "This combines named values, a comparison, subtraction, and branching into one small real-world decision.",
        xp: 40,
      },
    ],
  },
  {
    id: "loop-lane",
    title: "Loop Lane",
    subtitle: "Repeat without the grind",
    tasks: [
      {
        id: "loops-call-drinks",
        title: "Call the Drinks",
        concept: "Simple for loops",
        story:
          "The counter is filling up. Call each finished drink in order so nobody misses theirs.",
        prompt: "Loop through drinks and print each one on its own line.",
        starter:
          'drinks = ["chai", "mocha", "matcha"]\n\n# Repeat one print for every drink\n',
        solution:
          'drinks = ["chai", "mocha", "matcha"]\n\nfor drink in drinks:\n    print(drink)',
        expected: "chai\nmocha\nmatcha",
        hints: [
          "A for loop can visit each item in drinks one at a time.",
          "Write for drink in drinks: and indent print(drink) beneath it.",
        ],
        explanation:
          "The loop assigns each list item to drink, then runs the indented block once for that item.",
        xp: 25,
      },
      {
        id: "loops-brew-rounds",
        title: "Three Slow Pours",
        concept: "range",
        story:
          "A pour-over tastes best in three calm rounds. Number each round for the barista.",
        prompt: 'Use range to print "Pour 1", "Pour 2", and "Pour 3".',
        starter: "# Use range to repeat three numbered pours\n",
        solution:
          'for number in range(1, 4):\n    print(f"Pour {number}")',
        expected: "Pour 1\nPour 2\nPour 3",
        hints: [
          "range’s ending number is not included.",
          "range(1, 4) produces 1, 2, 3. Put number inside an f-string.",
        ],
        explanation:
          "range creates a predictable sequence of numbers, which is useful when the repetition count matters.",
        xp: 30,
      },
      {
        id: "loops-pickup-labels",
        title: "Pickup Labels",
        concept: "enumerate",
        story:
          "Give each drink a numbered label so the table can match cups to the order.",
        prompt: "Print each drink with a number starting at 1.",
        starter:
          'drinks = ["chai", "mocha", "matcha"]\n\n# enumerate can provide both a number and a drink\n',
        solution:
          'drinks = ["chai", "mocha", "matcha"]\n\nfor number, drink in enumerate(drinks, start=1):\n    print(f"{number}. {drink}")',
        expected: "1. chai\n2. mocha\n3. matcha",
        hints: [
          "enumerate gives you a pair: the current number and the current item.",
          "Use enumerate(drinks, start=1), then unpack it as number, drink.",
        ],
        explanation:
          "enumerate adds a counter to a loop without requiring a separate number variable that you update manually.",
        xp: 35,
      },
      {
        id: "loops-tab-total",
        title: "Add the Table Tab",
        concept: "Accumulators",
        story:
          "A table ordered three small treats. Keep a running total as you visit each price.",
        prompt: "Add every price into total, then print 12.5.",
        starter:
          "prices = [4.5, 3.0, 5.0]\ntotal = 0\n\n# Add each price to total\n\nprint(total)",
        solution:
          "prices = [4.5, 3.0, 5.0]\ntotal = 0\n\nfor price in prices:\n    total += price\n\nprint(total)",
        expected: "12.5",
        hints: [
          "Visit every price with a loop and update total inside it.",
          "The shorthand total += price means total = total + price.",
        ],
        explanation:
          "An accumulator remembers a growing result. It starts at a neutral value and changes once per loop.",
        xp: 40,
      },
      {
        id: "loops-table-pairs",
        title: "Table Pairings",
        concept: "Nested loops",
        story:
          "The tasting flight pairs two drinks with two pastries. Print every possible pairing for the menu card.",
        prompt: "Use two loops to print all four drink-and-pastry pairs.",
        starter:
          'drinks = ["chai", "coffee"]\npastries = ["scone", "cookie"]\n\n# One loop can live inside another\n',
        solution:
          'drinks = ["chai", "coffee"]\npastries = ["scone", "cookie"]\n\nfor drink in drinks:\n    for pastry in pastries:\n        print(f"{drink} + {pastry}")',
        expected:
          "chai + scone\nchai + cookie\ncoffee + scone\ncoffee + cookie",
        hints: [
          "The outer loop chooses a drink; the inner loop visits every pastry for that drink.",
          "Indent the pastry loop once, then indent the print twice.",
        ],
        explanation:
          "Nested loops explore combinations. The inner loop completes all of its work for each single outer-loop item.",
        xp: 45,
      },
    ],
  },
  {
    id: "function-pantry",
    title: "Function Pantry",
    subtitle: "Reusable little recipes",
    tasks: [
      {
        id: "functions-greeting",
        title: "Hello, Regular",
        concept: "Defining functions",
        story:
          "The café greets regulars by name. Make one reusable greeting instead of writing every message by hand.",
        prompt:
          'Complete greet so greet("Mina") returns "Welcome back, Mina!"',
        starter:
          'def greet(name):\n    # Return a friendly greeting\n    pass\n\nprint(greet("Mina"))',
        solution:
          'def greet(name):\n    return f"Welcome back, {name}!"\n\nprint(greet("Mina"))',
        expected: "Welcome back, Mina!",
        hints: [
          "return sends a value back to wherever the function was called.",
          'Replace pass with return f"Welcome back, {name}!"',
        ],
        explanation:
          "A function packages a behavior under a name. Its parameter is a placeholder that receives a new value on each call.",
        xp: 30,
      },
      {
        id: "functions-menu-sign",
        title: "Name the Special",
        concept: "Multiple parameters",
        story:
          "The chalkboard special changes every day. Make a sign-maker that accepts both the drink and its price.",
        prompt:
          'Complete menu_sign so it prints: Today: Maple latte — $5.00',
        starter:
          'def menu_sign(drink, price):\n    # Build and return the sign text\n    pass\n\nprint(menu_sign("Maple latte", 5))',
        solution:
          'def menu_sign(drink, price):\n    return f"Today: {drink} — ${price:.2f}"\n\nprint(menu_sign("Maple latte", 5))',
        expected: "Today: Maple latte — $5.00",
        hints: [
          "Both drink and price are available inside the function.",
          "Use {price:.2f} in the returned f-string to keep two decimal places.",
        ],
        explanation:
          "Multiple parameters let one function adapt several parts of its result.",
        xp: 35,
      },
      {
        id: "functions-default-size",
        title: "House Size",
        concept: "Default parameters",
        story:
          "Most guests choose a small unless they ask otherwise. Let the function remember that house default.",
        prompt:
          'Add a default size so order_label("cortado") prints "small cortado".',
        starter:
          'def order_label(drink, size):\n    return f"{size} {drink}"\n\n# Make size optional\nprint(order_label("cortado"))',
        solution:
          'def order_label(drink, size="small"):\n    return f"{size} {drink}"\n\nprint(order_label("cortado"))',
        expected: "small cortado",
        hints: [
          "A default value is written in the function definition with an equals sign.",
          'Change the parameter to size="small".',
        ],
        explanation:
          "A default parameter supplies a sensible value when the caller leaves that argument out.",
        xp: 40,
      },
      {
        id: "functions-order-total",
        title: "Reusable Tab Total",
        concept: "Functions + loops",
        story:
          "Different tables need totals all afternoon. Turn the running-total pattern into a function you can reuse.",
        prompt: "Complete order_total so the printed result is 10.5.",
        starter:
          "def order_total(prices):\n    total = 0\n    # Add each price, then return total\n    pass\n\nprint(order_total([3.5, 2.0, 5.0]))",
        solution:
          "def order_total(prices):\n    total = 0\n    for price in prices:\n        total += price\n    return total\n\nprint(order_total([3.5, 2.0, 5.0]))",
        expected: "10.5",
        hints: [
          "The loop belongs inside the function, followed by return total.",
          "For each price, use total += price. Return only after the loop finishes.",
        ],
        explanation:
          "Functions can contain whole workflows, including loops and accumulators, while keeping the calling code simple.",
        xp: 45,
      },
      {
        id: "functions-reward-check",
        title: "Reward Checker",
        concept: "Boolean returns",
        story:
          "The stamp card needs a clear yes-or-no answer before it offers a free drink.",
        prompt:
          "Return True when stamps is at least needed. The printed result should be True.",
        starter:
          "def reward_ready(stamps, needed=5):\n    # Return the result of one comparison\n    pass\n\nprint(reward_ready(5))",
        solution:
          "def reward_ready(stamps, needed=5):\n    return stamps >= needed\n\nprint(reward_ready(5))",
        expected: "True",
        hints: [
          "A comparison already produces a Boolean value.",
          "You can return stamps >= needed directly—no if statement is required.",
        ],
        explanation:
          "Returning a Boolean makes a function easy to reuse inside future conditions.",
        xp: 50,
      },
    ],
  },
  {
    id: "dictionary-nook",
    title: "Dictionary Nook",
    subtitle: "Data with useful labels",
    tasks: [
      {
        id: "dict-regular-order",
        title: "Regular’s Order",
        concept: "Reading values",
        story:
          "Mina’s usual is saved in the regulars book. Read her drink and size by their labels.",
        prompt: "Use the dictionary to print: Mina: small cortado",
        starter:
          'order = {"name": "Mina", "drink": "cortado", "size": "small"}\n\n# Read values with their keys\n',
        solution:
          'order = {"name": "Mina", "drink": "cortado", "size": "small"}\n\nprint(f"{order[\'name\']}: {order[\'size\']} {order[\'drink\']}")',
        expected: "Mina: small cortado",
        hints: [
          "Read one value with square brackets, such as order['name'].",
          "Place the three dictionary lookups inside one f-string.",
        ],
        explanation:
          "Dictionary keys describe what each value means, so code can retrieve data by name instead of position.",
        xp: 30,
      },
      {
        id: "dict-change-size",
        title: "Make It Large",
        concept: "Updating values",
        story:
          "Mina decides it is a large-coffee kind of day. Update just that part of the saved order.",
        prompt: 'Change size to "large", then print the dictionary.',
        starter:
          'order = {"drink": "cortado", "size": "small"}\n\n# Update one value\nprint(order)',
        solution:
          'order = {"drink": "cortado", "size": "small"}\n\norder["size"] = "large"\nprint(order)',
        expected: "{'drink': 'cortado', 'size': 'large'}",
        hints: [
          "Use the same square-bracket key on the left side of an assignment.",
          'Write order["size"] = "large" before the print.',
        ],
        explanation:
          "Assigning to an existing key replaces only that key’s value and leaves the rest of the dictionary intact.",
        xp: 35,
      },
      {
        id: "dict-menu-board",
        title: "Read the Menu Board",
        concept: "Looping through items",
        story:
          "The chalkboard menu stores each drink beside its price. Print every pair for the morning board.",
        prompt: "Loop through menu and print each drink and price.",
        starter:
          'menu = {"chai": 4, "mocha": 5}\n\n# .items() provides each key and value together\n',
        solution:
          'menu = {"chai": 4, "mocha": 5}\n\nfor drink, price in menu.items():\n    print(f"{drink}: ${price}")',
        expected: "chai: $4\nmocha: $5",
        hints: [
          "Loop over menu.items() and unpack each pair into drink and price.",
          'Inside the loop, print f"{drink}: ${price}".',
        ],
        explanation:
          "items returns key-value pairs, making it natural to process both parts together.",
        xp: 40,
      },
      {
        id: "dict-nested-regular",
        title: "The Regulars Book",
        concept: "Nested dictionaries",
        story:
          "The regulars book now contains a small order record for each guest. Find Jo’s drink inside the nested data.",
        prompt: "Use two keys to print: Jo drinks matcha",
        starter:
          'regulars = {\n    "Mina": {"drink": "cortado", "visits": 8},\n    "Jo": {"drink": "matcha", "visits": 4},\n}\n\n# Read the outer key, then the inner key\n',
        solution:
          'regulars = {\n    "Mina": {"drink": "cortado", "visits": 8},\n    "Jo": {"drink": "matcha", "visits": 4},\n}\n\nprint(f"Jo drinks {regulars[\'Jo\'][\'drink\']}")',
        expected: "Jo drinks matcha",
        hints: [
          "regulars['Jo'] gives Jo’s inner dictionary.",
          "Continue with ['drink'] to reach the nested value.",
        ],
        explanation:
          "Nested dictionaries model grouped records: one key chooses the record, and another chooses a field inside it.",
        xp: 45,
      },
      {
        id: "dict-stock-count",
        title: "Count the Pantry",
        concept: "Dictionary aggregation",
        story:
          "Before the afternoon rush, count all the pastry stock saved in the pantry dictionary.",
        prompt: "Add every stock value and print 17.",
        starter:
          'stock = {"scones": 6, "cookies": 8, "muffins": 3}\ntotal = 0\n\n# Loop through the values and add them\n\nprint(total)',
        solution:
          'stock = {"scones": 6, "cookies": 8, "muffins": 3}\ntotal = 0\n\nfor amount in stock.values():\n    total += amount\n\nprint(total)',
        expected: "17",
        hints: [
          "stock.values() gives just the numeric amounts.",
          "Loop through those amounts and use total += amount.",
        ],
        explanation:
          "Dictionary views let you work with keys, values, or pairs depending on what the task needs.",
        xp: 50,
      },
    ],
  },
  {
    id: "tiny-projects",
    title: "Tiny Projects",
    subtitle: "Put the pieces together",
    tasks: [
      {
        id: "project-tip-jar",
        title: "Build a Tip Jar",
        concept: "Looping calculations",
        story:
          "Turn a few table totals into a neat tip total for the end-of-day jar.",
        prompt: "Add 20% of every bill to tips, then print the rounded total.",
        starter:
          "bills = [12.50, 8.00, 19.50]\ntips = 0\n\n# Add each bill's 20% tip\n\nprint(round(tips, 2))",
        solution:
          "bills = [12.50, 8.00, 19.50]\ntips = 0\n\nfor bill in bills:\n    tips += bill * 0.20\n\nprint(round(tips, 2))",
        expected: "8.0",
        hints: [
          "Visit every bill and multiply it by 0.20.",
          "Inside the loop, add bill * 0.20 to tips.",
        ],
        explanation:
          "The project combines a list, loop, accumulator, arithmetic, and a final formatting step.",
        xp: 40,
      },
      {
        id: "project-receipt",
        title: "Pocket Receipt",
        concept: "Functions + dictionaries",
        story:
          "A tiny receipt should total any order dictionary and return one tidy line for the guest.",
        prompt: "Complete receipt_total so it prints: Total: $9.50",
        starter:
          'order = {"chai": 4.00, "scone": 3.00, "cookie": 2.50}\n\ndef receipt_total(items):\n    # Add the values and return a formatted line\n    pass\n\nprint(receipt_total(order))',
        solution:
          'order = {"chai": 4.00, "scone": 3.00, "cookie": 2.50}\n\ndef receipt_total(items):\n    total = sum(items.values())\n    return f"Total: ${total:.2f}"\n\nprint(receipt_total(order))',
        expected: "Total: $9.50",
        hints: [
          "items.values() contains the prices; sum can add them.",
          "Store sum(items.values()) in total, then return an f-string using {total:.2f}.",
        ],
        explanation:
          "The function accepts structured data, computes from its values, and returns a consistently formatted result.",
        xp: 45,
      },
      {
        id: "project-low-stock",
        title: "Pantry Watch",
        concept: "Filtering data",
        story:
          "The closing barista needs a short list of anything with fewer than four servings left.",
        prompt: "Print the low-stock items in order: oat milk, muffins",
        starter:
          'stock = {"coffee": 12, "oat milk": 2, "scones": 5, "muffins": 3}\n\n# Print each item whose amount is below 4\n',
        solution:
          'stock = {"coffee": 12, "oat milk": 2, "scones": 5, "muffins": 3}\n\nfor item, amount in stock.items():\n    if amount < 4:\n        print(item)',
        expected: "oat milk\nmuffins",
        hints: [
          "Loop over stock.items(), then put an if statement inside the loop.",
          "Print item only when amount < 4.",
        ],
        explanation:
          "This project filters dictionary records by combining iteration with a condition.",
        xp: 50,
      },
      {
        id: "project-loyalty",
        title: "Loyalty Morning",
        concept: "Updating records",
        story:
          "Three regulars stopped in this morning. Add today’s beans to their saved balances and print the updated book.",
        prompt: "Add earned beans to every matching regular, then print balances.",
        starter:
          'balances = {"Mina": 80, "Jo": 45, "Sam": 95}\nearned = {"Mina": 10, "Jo": 20, "Sam": 5}\n\n# Update each person\'s balance\n\nfor name, beans in balances.items():\n    print(f"{name}: {beans}")',
        solution:
          'balances = {"Mina": 80, "Jo": 45, "Sam": 95}\nearned = {"Mina": 10, "Jo": 20, "Sam": 5}\n\nfor name, beans in earned.items():\n    balances[name] += beans\n\nfor name, beans in balances.items():\n    print(f"{name}: {beans}")',
        expected: "Mina: 90\nJo: 65\nSam: 100",
        hints: [
          "Loop through earned.items() first; name is also a key in balances.",
          "Inside that loop, use balances[name] += beans. Keep the printing loop afterward.",
        ],
        explanation:
          "Shared keys let one dictionary update related records in another before a separate reporting pass.",
        xp: 55,
      },
      {
        id: "project-queue",
        title: "The Cozy Queue",
        concept: "Capstone",
        story:
          "The café is humming. Estimate each guest’s pickup time from the drinks ahead of them, then call the queue.",
        prompt:
          "Each drink takes 3 minutes. Print every guest’s cumulative pickup estimate.",
        starter:
          'queue = [\n    {"name": "Mina", "drink": "chai"},\n    {"name": "Jo", "drink": "mocha"},\n    {"name": "Sam", "drink": "matcha"},\n]\nminutes_per_drink = 3\n\n# Number the queue and calculate cumulative minutes\n',
        solution:
          'queue = [\n    {"name": "Mina", "drink": "chai"},\n    {"name": "Jo", "drink": "mocha"},\n    {"name": "Sam", "drink": "matcha"},\n]\nminutes_per_drink = 3\n\nfor position, order in enumerate(queue, start=1):\n    wait = position * minutes_per_drink\n    print(f"{order[\'name\']}: {order[\'drink\']} in {wait} min")',
        expected: "Mina: chai in 3 min\nJo: mocha in 6 min\nSam: matcha in 9 min",
        hints: [
          "enumerate(queue, start=1) gives each order a useful position.",
          "Multiply position by minutes_per_drink, then read name and drink from order.",
        ],
        explanation:
          "The capstone combines a list of dictionaries, enumeration, arithmetic, variables, and formatted output.",
        xp: 75,
      },
    ],
  },
];

const ALL_TASKS = CONCEPTS.flatMap((concept, conceptIndex) =>
  concept.tasks.map((task, taskIndex) => ({
    task,
    conceptIndex,
    taskIndex,
  })),
);
const TASK_IDS = new Set(ALL_TASKS.map(({ task }) => task.id));

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";
const INDENT = "    ";

function normalizeOutput(value: string) {
  return value.trim().replace(/\r\n/g, "\n");
}

function highlightPython(source: string) {
  const pattern =
    /(#.*$|"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*(?=\s*\())/gm;
  const parts = [];
  let cursor = 0;

  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push(source.slice(cursor, index));
    }

    const token = match[0];
    let className = "token-function";
    if (token.startsWith("#")) className = "token-comment";
    else if (
      token.startsWith('"') ||
      token.startsWith("'")
    )
      className = "token-string";
    else if (/^\d/.test(token)) className = "token-number";
    else if (
      /^(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)$/.test(
        token,
      )
    )
      className = "token-keyword";

    parts.push(
      <span className={className} key={`${index}-${token}`}>
        {token}
      </span>,
    );
    cursor = index + token.length;
  }

  if (cursor < source.length) {
    parts.push(source.slice(cursor));
  }

  return parts;
}

function variableNamesInCode(source: string) {
  const names = new Set<string>();
  const assignmentPattern = /^\s*([A-Za-z_]\w*)\s*(?:=|\+=|-=|\*=|\/=)/gm;
  const loopPattern =
    /^\s*for\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)\s+in\b/gm;
  const functionPattern = /^\s*def\s+[A-Za-z_]\w*\s*\(([^)]*)\)/gm;

  for (const match of source.matchAll(assignmentPattern)) {
    names.add(match[1]);
  }
  for (const match of source.matchAll(loopPattern)) {
    match[1]
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => names.add(name));
  }
  for (const match of source.matchAll(functionPattern)) {
    match[1]
      .split(",")
      .map((parameter) => parameter.split("=")[0].trim())
      .filter(Boolean)
      .forEach((name) => names.add(name));
  }

  return [...names].sort((a, b) => b.length - a.length);
}

function promptWithVariableReferences(prompt: string, source: string) {
  const names = variableNamesInCode(source).filter((name) =>
    new RegExp(`\\b${name}\\b`).test(prompt),
  );
  if (names.length === 0) return prompt;

  const pattern = new RegExp(`\\b(${names.join("|")})\\b`, "g");
  return prompt.split(pattern).map((part, index) =>
    names.includes(part) ? (
      <strong className="variable-reference" key={`${part}-${index}`}>
        <code>{part}</code>
      </strong>
    ) : (
      part
    ),
  );
}

export default function Home() {
  const [conceptIndex, setConceptIndex] = useState(0);
  const [taskIndex, setTaskIndex] = useState(0);
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>(
    CONCEPTS[0].id,
  );
  const [completed, setCompleted] = useState<string[]>([]);
  const [codeById, setCodeById] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [output, setOutput] = useState("Your output will appear here.");
  const [runState, setRunState] = useState<
    "idle" | "running" | "success" | "try-again" | "error"
  >("idle");
  const [runtimeState, setRuntimeState] = useState<
    "warming" | "ready" | "unavailable"
  >("warming");
  const [hintLevel, setHintLevel] = useState(0);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const runtimeRef = useRef<PyodideRuntime | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = useRef<HTMLPreElement | null>(null);

  const concept = CONCEPTS[conceptIndex];
  const challenge = concept.tasks[taskIndex];
  const code = codeById[challenge.id] ?? challenge.starter;
  const currentAttemptCount = attempts[challenge.id] ?? 0;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("py-and-pour-progress");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          completed?: string[];
          codeById?: Record<string, string>;
          attempts?: Record<string, number>;
        };
        setCompleted(
          (parsed.completed ?? []).filter((taskId) => TASK_IDS.has(taskId)),
        );
        setCodeById(parsed.codeById ?? {});
        setAttempts(parsed.attempts ?? {});
      }
    } catch {
      // Local progress is optional; the café still works without it.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function warmPython() {
      try {
        if (!window.loadPyodide) {
          await new Promise<void>((resolve, reject) => {
            const existing = document.querySelector<HTMLScriptElement>(
              'script[data-pyodide="true"]',
            );
            if (existing) {
              existing.addEventListener("load", () => resolve(), { once: true });
              existing.addEventListener("error", () => reject(), { once: true });
              return;
            }

            const script = document.createElement("script");
            script.src = `${PYODIDE_URL}pyodide.js`;
            script.async = true;
            script.dataset.pyodide = "true";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Could not load Python"));
            document.head.appendChild(script);
          });
        }

        if (!window.loadPyodide) {
          throw new Error("Python runtime unavailable");
        }

        const runtime = await window.loadPyodide({ indexURL: PYODIDE_URL });
        if (!cancelled) {
          runtimeRef.current = runtime;
          setRuntimeState("ready");
        }
      } catch {
        if (!cancelled) {
          setRuntimeState("unavailable");
        }
      }
    }

    warmPython();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "py-and-pour-progress",
        JSON.stringify({ completed, codeById, attempts }),
      );
    } catch {
      // Ignore private browsing/storage limits.
    }
  }, [completed, codeById, attempts]);

  const totalXp = useMemo(
    () =>
      ALL_TASKS.filter(({ task }) => completed.includes(task.id)).reduce(
        (sum, { task }) => sum + task.xp,
        0,
      ),
    [completed],
  );

  const completedConcepts = useMemo(
    () =>
      CONCEPTS.filter((item) =>
        item.tasks.every((task) => completed.includes(task.id)),
      ),
    [completed],
  );

  const progressPercent = (completed.length / ALL_TASKS.length) * 100;

  function isTaskUnlocked(targetConceptIndex: number, targetTaskIndex: number) {
    const flatIndex = ALL_TASKS.findIndex(
      (item) =>
        item.conceptIndex === targetConceptIndex &&
        item.taskIndex === targetTaskIndex,
    );
    return ALL_TASKS.slice(0, flatIndex).every(({ task }) =>
      completed.includes(task.id),
    );
  }

  function isConceptUnlocked(targetConceptIndex: number) {
    return isTaskUnlocked(targetConceptIndex, 0);
  }

  function resetLessonState(message = "Your output will appear here.") {
    setOutput(message);
    setRunState("idle");
    setHintLevel(0);
    setSolutionOpen(false);
  }

  function chooseTask(nextConceptIndex: number, nextTaskIndex: number) {
    if (!isTaskUnlocked(nextConceptIndex, nextTaskIndex)) return;
    setConceptIndex(nextConceptIndex);
    setTaskIndex(nextTaskIndex);
    setExpandedConceptId(CONCEPTS[nextConceptIndex].id);
    resetLessonState();
  }

  function updateCode(nextCode: string) {
    setCodeById((current) => ({ ...current, [challenge.id]: nextCode }));
    if (runState !== "idle") {
      setRunState("idle");
      setOutput("Your output will appear here.");
    }
  }

  function setEditorSelection(start: number, end: number) {
    requestAnimationFrame(() => {
      editorRef.current?.focus();
      editorRef.current?.setSelectionRange(start, end);
    });
  }

  function handleEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      runCode();
      return;
    }

    if (event.key !== "Tab") return;
    event.preventDefault();

    const editor = event.currentTarget;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    if (!event.shiftKey && start === end) {
      updateCode(`${code.slice(0, start)}${INDENT}${code.slice(end)}`);
      setEditorSelection(start + INDENT.length, start + INDENT.length);
      return;
    }

    const lineStart = code.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
    const effectiveEnd =
      end > start && code[end - 1] === "\n" ? Math.max(start, end - 1) : end;
    const nextLineBreak = code.indexOf("\n", effectiveEnd);
    const lineEnd = nextLineBreak === -1 ? code.length : nextLineBreak;
    const block = code.slice(lineStart, lineEnd);
    const lines = block.split("\n");

    if (!event.shiftKey) {
      const indented = lines.map((line) => `${INDENT}${line}`).join("\n");
      updateCode(`${code.slice(0, lineStart)}${indented}${code.slice(lineEnd)}`);
      setEditorSelection(
        start + INDENT.length,
        end + INDENT.length * lines.length,
      );
      return;
    }

    const removedPerLine = lines.map((line) => {
      if (line.startsWith("\t")) return 1;
      return Math.min(line.match(/^ */)?.[0].length ?? 0, INDENT.length);
    });
    const unindented = lines
      .map((line, index) => line.slice(removedPerLine[index]))
      .join("\n");
    const totalRemoved = removedPerLine.reduce((sum, count) => sum + count, 0);
    const removedBeforeStart = Math.min(
      removedPerLine[0],
      Math.max(0, start - lineStart),
    );

    updateCode(
      `${code.slice(0, lineStart)}${unindented}${code.slice(lineEnd)}`,
    );
    setEditorSelection(
      Math.max(lineStart, start - removedBeforeStart),
      Math.max(lineStart, end - totalRemoved),
    );
  }

  async function runCode() {
    if (!runtimeRef.current || runState === "running") return;

    setAttempts((current) => ({
      ...current,
      [challenge.id]: (current[challenge.id] ?? 0) + 1,
    }));
    setRunState("running");
    setOutput("Brewing your Python…");

    const wrappedCode = `
import io, sys, json, traceback
_cafe_stdout = io.StringIO()
_cafe_stderr = io.StringIO()
_old_stdout, _old_stderr = sys.stdout, sys.stderr
sys.stdout, sys.stderr = _cafe_stdout, _cafe_stderr
try:
    exec(${JSON.stringify(code)}, {})
    _cafe_result = {
        "stdout": _cafe_stdout.getvalue(),
        "stderr": _cafe_stderr.getvalue(),
        "error": ""
    }
except Exception:
    _cafe_result = {
        "stdout": _cafe_stdout.getvalue(),
        "stderr": _cafe_stderr.getvalue(),
        "error": traceback.format_exc()
    }
finally:
    sys.stdout, sys.stderr = _old_stdout, _old_stderr
json.dumps(_cafe_result)
`;

    try {
      const rawResult = await runtimeRef.current.runPythonAsync(wrappedCode);
      const result = JSON.parse(rawResult) as {
        stdout: string;
        stderr: string;
        error: string;
      };

      if (result.error) {
        setRunState("error");
        setOutput(result.error.trim());
        return;
      }

      const nextOutput =
        [result.stdout, result.stderr].filter(Boolean).join("\n").trim() ||
        "(Your code ran, but it didn’t print anything.)";
      setOutput(nextOutput);

      if (normalizeOutput(result.stdout) === normalizeOutput(challenge.expected)) {
        setRunState("success");
        setCompleted((current) =>
          current.includes(challenge.id)
            ? current
            : [...current, challenge.id],
        );
      } else {
        setRunState("try-again");
      }
    } catch (error) {
      setRunState("error");
      setOutput(
        error instanceof Error
          ? error.message
          : "The Python cup tipped over. Try running it again.",
      );
    }
  }

  function nextTask() {
    const flatIndex = ALL_TASKS.findIndex(
      (item) =>
        item.conceptIndex === conceptIndex && item.taskIndex === taskIndex,
    );
    const next = ALL_TASKS[flatIndex + 1];
    if (next) {
      chooseTask(next.conceptIndex, next.taskIndex);
    }
  }

  function resetChallenge() {
    setCodeById((current) => ({
      ...current,
      [challenge.id]: challenge.starter,
    }));
    resetLessonState("Fresh cup, fresh start.");
  }

  function revealNextHint() {
    setHintLevel((current) => Math.min(current + 1, challenge.hints.length));
  }

  function syncHighlightScroll() {
    if (!editorRef.current || !highlightRef.current) return;
    highlightRef.current.scrollTop = editorRef.current.scrollTop;
    highlightRef.current.scrollLeft = editorRef.current.scrollLeft;
  }

  const conceptTaskCount = concept.tasks.filter((task) =>
    completed.includes(task.id),
  ).length;
  const conceptJustCompleted =
    runState === "success" && conceptTaskCount === concept.tasks.length;

  return (
    <main className="cafe-shell">
      <div className="ambient-lights" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="topbar">
        <a className="brand" href="#practice" aria-label="Py and Pour home">
          <span className="brand-mark" aria-hidden="true">
            ☕
          </span>
          <span>
            <strong>Py &amp; Pour</strong>
            <small>coffee break coding club</small>
          </span>
        </a>

        <div className="player-stats" aria-label="Player progress">
          <span>
            <b>{totalXp}</b> beans
          </span>
          <span>
            <b>{completedConcepts.length}</b> stamps
          </span>
          <button className="avatar" type="button" aria-label="Your profile">
            C
          </button>
        </div>
      </header>

      <div className="workspace" id="practice">
        <aside className="roadmap" aria-label="Learning roadmap">
          <div className="menu-heading">
            <span>Today’s menu</span>
            <span className="handwritten">take your time</span>
          </div>

          <div className="level-card">
            <div>
              <span className="eyebrow">Level 1</span>
              <strong>Curious Coder</strong>
            </div>
            <span className="level-cup" aria-hidden="true">
              ♨
            </span>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <small>
              {completed.length} of {ALL_TASKS.length} brews tasted
            </small>
          </div>

          <nav className="roadmap-list roadmap-accordion" aria-label="Concept chapters">
            {CONCEPTS.map((item, index) => {
              const completedTasks = item.tasks.filter((task) =>
                completed.includes(task.id),
              ).length;
              const isComplete = completedTasks === item.tasks.length;
              const isActive = index === conceptIndex;
              const isUnlocked = isConceptUnlocked(index);
              const isExpanded = expandedConceptId === item.id;
              return (
                <section
                  className={`accordion-concept ${isActive ? "active" : ""} ${!isUnlocked ? "locked" : ""}`}
                  key={item.id}
                >
                  <button
                    type="button"
                    className="accordion-trigger"
                    aria-expanded={isExpanded}
                    aria-controls={`concept-panel-${item.id}`}
                    onClick={() =>
                      setExpandedConceptId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                  >
                    <span className="roadmap-dot" aria-hidden="true">
                      {isComplete ? "✓" : isUnlocked ? index + 1 : "•"}
                    </span>
                    <span className="accordion-title">
                      <strong>{item.title}</strong>
                      <small>
                        {isComplete
                          ? "5/5 brews · stamp earned"
                          : isUnlocked
                            ? `${completedTasks}/5 brews`
                            : "coming soon"}
                      </small>
                    </span>
                    <span
                      className={`accordion-chevron ${isExpanded ? "open" : ""}`}
                      aria-hidden="true"
                    >
                      ⌄
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      className="accordion-panel"
                      id={`concept-panel-${item.id}`}
                    >
                      <p>
                        <span className="bean-glyph" aria-hidden="true" />
                        {isComplete
                          ? "Every brew complete—this stamp is yours."
                          : "Complete all five brews to earn your stamp."}
                      </p>
                      <div className="accordion-tasks">
                        {item.tasks.map((task, itemTaskIndex) => {
                          const taskComplete = completed.includes(task.id);
                          const taskActive =
                            isActive && itemTaskIndex === taskIndex;
                          const taskUnlocked = isTaskUnlocked(
                            index,
                            itemTaskIndex,
                          );
                          return (
                            <button
                              type="button"
                              key={task.id}
                              className={`accordion-task ${taskActive ? "active" : ""}`}
                              disabled={!taskUnlocked}
                              onClick={() => chooseTask(index, itemTaskIndex)}
                              aria-current={taskActive ? "step" : undefined}
                            >
                              <span className="bean-glyph" aria-hidden="true" />
                              <span className="accordion-task-title">
                                <b>{itemTaskIndex + 1}.</b> {task.title}
                              </span>
                              <span className="accordion-task-count">
                                {taskComplete ? "1/1" : "0/1"}
                              </span>
                              <span
                                className={`task-status-ring ${taskComplete ? "complete" : ""}`}
                                aria-hidden="true"
                              >
                                {taskComplete ? "✓" : ""}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </nav>

          <div className="sidebar-quote">
            <span aria-hidden="true">✦</span>
            <p>
              “A little code, a good drink, and nowhere you have to rush to.”
            </p>
          </div>
        </aside>

        <section className="lesson">
          <div className="lesson-topline">
            <div>
              <span className="eyebrow">
                {concept.title} · Brew {taskIndex + 1} of 5 · {challenge.concept}
              </span>
              <h1>{challenge.title}</h1>
            </div>
            <span className="xp-pill">+{challenge.xp} beans</span>
          </div>

          <p className="story">{challenge.story}</p>

          <div className="quest-card">
            <span className="quest-label">Try this</span>
            <p>
              {promptWithVariableReferences(challenge.prompt, challenge.starter)}
            </p>
            <div className="expected">
              <span>Expected pour</span>
              <code>{challenge.expected}</code>
            </div>
          </div>

          <div className="editor-wrap">
            <div className="editor-bar">
              <div className="editor-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span>scratchpad.py</span>
              <span className={`runtime ${runtimeState}`}>
                <i aria-hidden="true" />
                {runtimeState === "ready"
                  ? "Python ready"
                  : runtimeState === "warming"
                    ? "Warming Python"
                    : "Python unavailable"}
              </span>
            </div>

            <div className="code-editor-shell">
              <pre
                className="code-highlight"
                ref={highlightRef}
                aria-hidden="true"
              >
                <code>{highlightPython(`${code}\n`)}</code>
              </pre>
              <label className="sr-only" htmlFor="code-editor">
                Python code editor
              </label>
              <textarea
                id="code-editor"
                ref={editorRef}
                className="code-editor"
                value={code}
                spellCheck={false}
                onChange={(event) => updateCode(event.target.value)}
                onKeyDown={handleEditorKeyDown}
                onScroll={syncHighlightScroll}
              />
            </div>

            <div className="editor-actions">
              <button
                className="text-button"
                type="button"
                onClick={revealNextHint}
                disabled={hintLevel >= challenge.hints.length}
              >
                {hintLevel === 0
                  ? "Need a nudge?"
                  : hintLevel < challenge.hints.length
                    ? "One more nudge"
                    : "All hints open"}
              </button>
              <button className="text-button" type="button" onClick={resetChallenge}>
                Start fresh
              </button>
              {currentAttemptCount > 0 && (
                <button
                  className="text-button solution-link"
                  type="button"
                  onClick={() => setSolutionOpen((open) => !open)}
                  aria-expanded={solutionOpen}
                >
                  {solutionOpen ? "Hide solution" : "Reveal full solution"}
                </button>
              )}
              <span className="shortcut">Tab indents · ⇧ Tab unindents</span>
              <button
                className="run-button"
                type="button"
                onClick={runCode}
                disabled={runtimeState !== "ready" || runState === "running"}
              >
                <span aria-hidden="true">▶</span>
                {runState === "running"
                  ? "Brewing…"
                  : runtimeState === "warming"
                    ? "Warming up…"
                    : "Run my code"}
              </button>
            </div>
          </div>

          {hintLevel > 0 && (
            <div className="hint-note" role="note">
              <span aria-hidden="true">💡</span>
              <div>
                <strong>
                  {hintLevel === 1 ? "A tiny nudge" : "A clearer clue"}
                </strong>
                {challenge.hints.slice(0, hintLevel).map((hint, index) => (
                  <p key={hint}>
                    <b>{index + 1}.</b> {hint}
                  </p>
                ))}
              </div>
            </div>
          )}

          {solutionOpen && currentAttemptCount > 0 && (
            <section className="solution-card" aria-label="Complete solution">
              <div>
                <span className="eyebrow">Complete solution</span>
                <p>
                  Compare this with your attempt line by line. Notice the smallest
                  change that makes it work.
                </p>
              </div>
              <pre>
                <code>{highlightPython(challenge.solution)}</code>
              </pre>
              <button
                type="button"
                onClick={() => {
                  updateCode(challenge.solution);
                  setSolutionOpen(false);
                }}
              >
                Put this in my scratchpad
              </button>
            </section>
          )}

          <section
            className={`output-card ${runState}`}
            aria-live="polite"
            aria-label="Python output"
          >
            <div className="output-heading">
              <span>
                {runState === "success"
                  ? conceptJustCompleted
                    ? "Concept complete — stamp earned!"
                    : "Perfect pour!"
                  : runState === "try-again"
                    ? "Almost there"
                    : runState === "error"
                      ? "A little spill"
                      : "Your output"}
              </span>
              {runState === "success" && <span>+{challenge.xp} beans</span>}
            </div>
            <pre>{output}</pre>
            {runState === "try-again" && (
              <p className="output-help">
                Your code ran. Compare the result with the expected pour, open a
                small hint, and try one change at a time.
              </p>
            )}
            {runState === "error" && (
              <p className="output-help">
                Read the final line first—it usually names the exact kind of spill.
                Your first hint is still available if you need it.
              </p>
            )}
            {runState === "success" && (
              <div className="success-row">
                <p>{challenge.explanation}</p>
                {ALL_TASKS.findIndex(
                  (item) =>
                    item.conceptIndex === conceptIndex &&
                    item.taskIndex === taskIndex,
                ) <
                  ALL_TASKS.length - 1 && (
                  <button type="button" onClick={nextTask}>
                    {taskIndex === 4
                      ? "Visit the next concept →"
                      : "Taste the next brew →"}
                  </button>
                )}
              </div>
            )}
          </section>
        </section>

        <aside className="cozy-rail" aria-label="Session extras">
          <div className="plant" aria-hidden="true">
            <span className="leaf leaf-one" />
            <span className="leaf leaf-two" />
            <span className="leaf leaf-three" />
            <span className="stem" />
            <span className="pot" />
          </div>

          <section className="chalk-card">
            <span className="eyebrow">House special</span>
            <h2>Learn in layers</h2>
            <p>Starter first. Two gentle hints. The full recipe only after you try.</p>
            <div className="mini-divider" />
            <div className="flow-row">
              <span>Read the story</span>
              <b>settle in</b>
            </div>
            <div className="flow-row">
              <span>Make a change</span>
              <b>experiment</b>
            </div>
            <div className="flow-row">
              <span>Run + reflect</span>
              <b>keep it</b>
            </div>
          </section>

          <section className="stamp-card">
            <span className="stamp-icon" aria-hidden="true">
              ☕
            </span>
            <div>
              <span className="eyebrow">Coffee card</span>
              <h2>{completedConcepts.length}/5 stamps</h2>
            </div>
            <div
              className="stamps"
              aria-label={`${completedConcepts.length} of 5 stamps`}
            >
              {CONCEPTS.map((item) => (
                <span
                  key={item.id}
                  className={
                    completedConcepts.some((conceptItem) => conceptItem.id === item.id)
                      ? "filled"
                      : ""
                  }
                  aria-hidden="true"
                >
                  ●
                </span>
              ))}
            </div>
            <small>Finish all five brews in a concept to earn its stamp.</small>
          </section>

          <div className="now-playing">
            <span aria-hidden="true">♫</span>
            <div>
              <small>Now playing</small>
              <strong>Rainy Window Lo-fi</strong>
            </div>
            <span className="equalizer" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}
