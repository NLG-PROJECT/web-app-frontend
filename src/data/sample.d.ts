interface FinancialStatement {
    item: string;
    2024: number | null;
    2023: number | null;
    2022: number | null;
}

declare module '@/data/sample.json' {
    const value: {
        ConsolidatedStatementsOfIncomeOrComprehensiveIncome: FinancialStatement[];
    };
    export default value;
} 