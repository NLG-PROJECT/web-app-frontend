// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Eye, EyeOff } from 'lucide-react'
// import { AssetStructure } from './balance-sheet/AssetStructure'
// import { LiabilityEquityFlow } from './balance-sheet/LiabilityEquityFlow'
// import { WorkingCapital } from './balance-sheet/WorkingCapital'
// import { BalanceSheetHealth } from './balance-sheet/BalanceSheetHealth'
// import { BalanceBridge } from './balance-sheet/BalanceBridge'

// interface FinancialStatement {
//   item: string
//   [key: string]: string | number | null
// }

// interface ConsolidatedBalanceSheets {
//   assets: FinancialStatement[]
//   liabilities: FinancialStatement[]
//   derivatives: FinancialStatement[]
//   // The rest are unnamed entries (flat items)
//   [key: string]: FinancialStatement[] | undefined
// }

// interface BalanceSheetAnalysisProps {
//   data: {
//     flattened: { item: string; [key: string]: string | number | null }[]
//     assets: { item: string; [key: string]: string | number | null }[]
//     liabilities: { item: string; [key: string]: string | number | null }[]
//     derivatives?: { item: string; [key: string]: string | number | null }[]
//   }
// }

// export function BalanceSheetAnalysis({ data }: BalanceSheetAnalysisProps) {
//   const [showTable, setShowTable] = useState(false)

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
//           Balance Sheet Analysis
//         </h2>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setShowTable(!showTable)}
//           className="flex items-center gap-2"
//         >
//           {showTable ? (
//             <>
//               <EyeOff className="w-4 h-4" />
//               Hide Details Table
//             </>
//           ) : (
//             <>
//               <Eye className="w-4 h-4" />
//               Show Details Table
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="grid gap-6">
//         {/* First Row: Asset Structure (Sunburst) and Balance Sheet Health (Gauge) */}
//         <div className="grid gap-6 lg:grid-cols-2">
//           <AssetStructure data={data.assets} />
//           <BalanceSheetHealth data={[...data.assets, ...data.liabilities]} />
//         </div>

//         {/* Second Row: Working Capital Flow (Sankey) - Full Width */}
//         <WorkingCapital data={[...data.assets, ...data.liabilities]} />

//         {/* Third Row: Liability & Equity Flow (Parallel) and Balance Bridge */}
//         <div className="grid gap-6 lg:grid-cols-2">
//           {/* <LiabilityEquityFlow data={data} /> */}
//         </div>
//       </div>
//     </div>
//   )
// }
