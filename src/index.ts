import axios from "axios";
import csv from "csv-parser";
import {Readable} from "stream";
import chalk from "chalk";

const CSV_DATA_URL = "https://raw.githubusercontent.com/Propine/2b-boilerplate/master/data/transactions.csv";
const CRYPTO_COMPARE_API = (token: string) =>  `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD`;

interface Transaction {
    timestamp: string;
    transaction_type: string;
    token: string;
    amount: string;
}

// For printing out table data
interface TableData {
    Token: string;
    Value: string;
}

async function getPortfolioValue() {
    console.clear();
    console.log(chalk.green("🚀 Starting Crypto Portfolio Value Calculator...\n"));
    console.log(chalk.blue("⏳ Collecting your transactions data...\n"));

    const startTime = Date.now();
    try {
        const tokenBalances = await readCSV(CSV_DATA_URL);
        const tokenValues = await getTokenValues(tokenBalances);

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        const tableData = Array.from(tokenValues.entries()).map(([token, value]): TableData => {
            return {
                Token: token,
                Value: formatter.format(value),
            };
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log(chalk.blue(`✅ Data collection and processing completed in ${duration} seconds.\n`));
        console.log(chalk.yellow("💰 Your latest portfolio value per token in USD:\n"));

        // Print out the data output in table format
        console.table(tableData);
    } catch (error) {
        console.error("Error:", error);
    }
}

function readCSV(url: string): Promise<Map<string, number>> {
    return new Promise(async (resolve, reject) => {
        const balances = new Map<string, number>();

        try {
            const response = await axios.get(url, { responseType: "text" });
            const readable = Readable.from(response.data);

            readable
                .pipe(csv())
                .on("data", (data: Transaction) => {
                    const { token, amount, transaction_type } = data;

                    if (!balances.has(token)) {
                        balances.set(token, 0);
                    }

                    const currentBalance = balances.get(token) || 0;
                    // Check transaction type to update the balance
                    if (transaction_type === "DEPOSIT") {
                        balances.set(token, currentBalance + parseFloat(amount));
                    } else if (transaction_type === "WITHDRAWAL") {
                        // Validate that the withdrawal amount is not greater than the current balance
                        // if (currentBalance < parseFloat(amount)) {
                        //     const errMsg = `Insufficient balance for ${token} withdrawal`;
                        //     throw new Error(errMsg);
                        // }
                        balances.set(token, currentBalance - parseFloat(amount));
                    }
                })
                .on("end", () => resolve(balances))
                .on("error", (error) => reject(error));
        } catch (error) {
            reject(error);
        }
    });
}

async function getTokenValues(tokenBalances: Map<string, number>): Promise<Map<string, number>> {
    const tokenValues = new Map<string, number>();

    for (const [token, balance] of tokenBalances.entries()) {
        const response = await axios.get(CRYPTO_COMPARE_API(token));
        tokenValues.set(token, balance * response.data.USD);
    }

    return tokenValues;
}

getPortfolioValue();