import axios from 'axios'

interface FinancialStatement {
    item: string
    [year: string]: string | number | null
}

interface TransformedData {
    ConsolidatedStatementsOfIncomeOrComprehensiveIncome: FinancialStatement[]
    ConsolidatedStatementsOfCashFlows: FinancialStatement[]
    ConsolidatedBalanceSheets: {
        flattened: FinancialStatement[]
        assets: FinancialStatement[]
        liabilities: FinancialStatement[]
        derivatives?: FinancialStatement[]
    }
    income_statement_dates?: string[]
    cashflow_statement_dates?: string[]
    ConsolidatedStatementsOfEquity?: FinancialStatement[]
}

const cleanNans = (obj: any): any => {
    if (obj === null || obj === undefined) return null
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map(cleanNans)
        }
        return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, cleanNans(v)])
        )
    }
    if (typeof obj === 'number' && isNaN(obj)) return null
    return obj
}

const transformFinancialData = (data: any): TransformedData => {
    const output: any = {}

    // Extract income statement
    const income = data.income_statement || {}
    output.ConsolidatedStatementsOfIncomeOrComprehensiveIncome =
        income.ConsolidatedStatementsOfIncomeOrComprehensiveIncome || []
    if (income.dates) {
        output.income_statement_dates = income.dates
    }

    // Extract cash flow
    const cashflow = data.cashflow_statement || {}
    output.ConsolidatedStatementsOfCashFlows =
        cashflow.ConsolidatedStatementsOfCashFlows || []
    if (cashflow.dates) {
        output.cashflow_statement_dates = cashflow.dates
    }

    // Extract balance sheet
    const balanceSheetData = data.balance_sheet?.balance_sheet || {}

    output.ConsolidatedBalanceSheets = {
        flattened: balanceSheetData.main || [],
        assets: balanceSheetData.assets_group || [],
        liabilities: balanceSheetData.liabilities_group || [],
        derivatives: balanceSheetData.derivatives_group || [],
    }

    // Extract equity statement
    output.ConsolidatedStatementsOfEquity =
        data.equity_statement?.equity_statement || []

    return cleanNans(output)
}

export const fetchFinancialData = async (): Promise<TransformedData> => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/financial-statements')
        console.log('Raw financial data:', response.data)
        const transformedData = transformFinancialData(response.data.statements)
        console.log('Transformed financial data:', transformedData)
        return transformedData
    } catch (error) {
        console.error('Error fetching financial data:', error)
        throw error
    }
} 