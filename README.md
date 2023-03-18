# Crypto Portfolio Value Calculator

This command-line program calculates the latest portfolio value per token in USD based on a CSV file containing crypto transaction data. The program is written in TypeScript and uses Node.js.

## Design Decisions

1. **Language choice**: TypeScript was chosen as the programming language because it provides strong typing and better code organization, which is beneficial for code maintainability and extensibility. Additionally, the main project stack is in JavaScript/TypeScript, and the goal was to assess proficiency in these languages.

2. **CSV data handling**: The `csv-parser` library was used to read and parse the CSV data. It provides an easy-to-use, efficient, and stream-based approach to handling CSV files, making it suitable for large datasets.

3. **Data storage**: The token balances were calculated using a `Map` instead of an object, as it provides better key-value management and improved performance when working with a large number of tokens.

4. **Currency formatting**: The `Intl.NumberFormat` object was used to format currency values in a consistent and user-friendly manner. It is a built-in JavaScript feature that handles localization and formatting of numbers, currencies, and percentages.

5. **Console output**: The `chalk` library was used to enhance the console output with colors, making it more visually appealing and easier to read. Emojis and progress messages were added to provide a more interactive user experience and make the application feel more like a running app. The execution time was also displayed to give users an idea of how long the process took.

## Prerequisites

- [Node.js](https://nodejs.org/) (>= 14.x)
- [npm](https://www.npmjs.com/) (>= 6.x)
