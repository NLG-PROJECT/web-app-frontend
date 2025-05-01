interface FinancialDataItem {
    item: string
    [key: string]: string | number | null
}

interface ProcessedFinancialData {
    years: string[]
    data: FinancialDataItem[]
}

interface KeyMetrics {
    revenue: number
    costOfSales: number
    grossProfit: number
    operatingExpenses: number
    operatingIncome: number
    otherIncome: number
    incomeBeforeTaxes: number
    incomeTaxes: number
    netIncome: number
}

export function processFinancialData(data: FinancialDataItem[]): ProcessedFinancialData {
    // Extract all available years from the data
    const years = Object.keys(data[0] || {})
        .filter(key => key !== 'item' && !isNaN(Number(key)))
        .sort((a, b) => Number(b) - Number(a)) // Sort in descending order

    // Clean and structure the data
    const processedData = data.map(item => {
        const cleanedItem = { ...item }

        // Remove any null or undefined values
        Object.keys(cleanedItem).forEach(key => {
            if (key !== 'item' && cleanedItem[key] === null) {
                delete cleanedItem[key]
            }
        })

        return cleanedItem
    })

    return {
        years,
        data: processedData
    }
}

export function getKeyMetrics(data: FinancialDataItem[], year: string): KeyMetrics {
    const getValue = (itemName: string): number => {
        const item = data.find(item => item.item === itemName)
        const value = item?.[year]
        return typeof value === 'number' ? value : 0
    }

    return {
        revenue: getValue('Total net sales'),
        costOfSales: getValue('Total cost of sales'),
        grossProfit: getValue('Gross margin'),
        operatingExpenses: getValue('Total operating expenses'),
        operatingIncome: getValue('Operating income'),
        otherIncome: getValue('Other income/(expense), net'),
        incomeBeforeTaxes: getValue('Income before provision for income taxes'),
        incomeTaxes: getValue('Provision for income taxes'),
        netIncome: getValue('Net income'),
    }
} 