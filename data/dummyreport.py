# 'use client'

# import { useState, useCallback } from 'react'
# import { useDropzone } from 'react-dropzone'
# import { Upload, FileText, AlertCircle, X, CheckCircle2 } from 'lucide-react'
# import { Button } from '@/components/ui/button'
# import { Card } from '@/components/ui/card'
# import { motion, AnimatePresence } from 'framer-motion'

# interface ReportUploadProps {
#   onUpload: (fileName: string) => void
# }

# export function ReportUpload({ onUpload }: ReportUploadProps) {
#   const [file, setFile] = useState<File | null>(null)
#   const [error, setError] = useState<string | null>(null)
#   const [isUploading, setIsUploading] = useState(false)
#   const [uploadProgress, setUploadProgress] = useState(0)

#   const onDrop = useCallback((acceptedFiles: File[]) => {
#     const file = acceptedFiles[0]
#     if (file) {
#       if (file.type !== 'application/pdf') {
#         setError('Please upload a PDF file')
#         return
#       }
#       if (file.size > 10 * 1024 * 1024) {
#         setError('File size must be less than 10MB')
#         return
#       }
#       setFile(file)
#       setError(null)
#     }
#   }, [])

#   const { getRootProps, getInputProps, isDragActive } = useDropzone({
#     onDrop,
#     accept: {
#       'application/pdf': ['.pdf'],
#     },
#     maxFiles: 1,
#   })

#   // ✅ Simplified upload for testing (bypasses backend)
#   const handleUpload = async () => {
#     if (!file) return

#     setIsUploading(true)
#     setUploadProgress(100) // instantly show full progress

#     setTimeout(() => {
#       onUpload(file.name) // simulate upload success
#       setIsUploading(false)
#     }, 500) // short delay for UX
#   }

#   const removeFile = () => {
#     setFile(null)
#     setError(null)
#     setUploadProgress(0)
#   }

#   return (
#     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
#       <div className="max-w-2xl mx-auto space-y-6">
#         <motion.div
#           initial={{ opacity: 0, y: 20 }}
#           animate={{ opacity: 1, y: 0 }}
#           className="text-center space-y-2"
#         >
#           <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
#             Upload Report
#           </h1>
#           <p className="text-muted-foreground">
#             Upload your financial report to begin analysis
#           </p>
#         </motion.div>

#         <motion.div
#           initial={{ opacity: 0, scale: 0.95 }}
#           animate={{ opacity: 1, scale: 1 }}
#           transition={{ delay: 0.1 }}
#         >
#           <Card
#             {...getRootProps()}
#             className={`border-2 border-dashed transition-all duration-300 ${
#               isDragActive
#                 ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg'
#                 : 'border-muted-foreground/25 hover:border-primary/50 hover:shadow-md'
#             }`}
#           >
#             <div className="p-8 text-center">
#               <input {...getInputProps()} />
#               <motion.div
#                 className="flex flex-col items-center gap-4"
#                 animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
#                 transition={{ duration: 0.2 }}
#               >
#                 <div className="p-4 rounded-full bg-primary/10">
#                   <Upload className="size-8 text-primary" />
#                 </div>
#                 <div className="space-y-1">
#                   <p className="font-medium">
#                     {isDragActive
#                       ? 'Drop the file here'
#                       : 'Drag and drop your report here'}
#                   </p>
#                   <p className="text-sm text-muted-foreground">
#                     or click to select a file
#                   </p>
#                 </div>
#                 <p className="text-xs text-muted-foreground">
#                   PDF files only, up to 10MB
#                 </p>
#               </motion.div>
#             </div>
#           </Card>
#         </motion.div>

#         <AnimatePresence>
#           {file && (
#             <motion.div
#               initial={{ opacity: 0, y: 20 }}
#               animate={{ opacity: 1, y: 0 }}
#               exit={{ opacity: 0, y: -20 }}
#               transition={{ duration: 0.2 }}
#             >
#               <Card className="p-4 border-primary/20">
#                 <div className="flex items-center gap-4">
#                   <div className="p-2 rounded-lg bg-primary/10">
#                     <FileText className="size-6 text-primary" />
#                   </div>
#                   <div className="flex-1 min-w-0">
#                     <p className="font-medium truncate">{file.name}</p>
#                     <p className="text-sm text-muted-foreground">
#                       {(file.size / 1024 / 1024).toFixed(2)} MB
#                     </p>
#                     {isUploading && (
#                       <div className="w-full bg-muted rounded-full h-1.5 mt-2">
#                         <div
#                           className="bg-primary h-1.5 rounded-full transition-all duration-300"
#                           style={{ width: `${uploadProgress}%` }}
#                         />
#                       </div>
#                     )}
#                   </div>
#                   <div className="flex items-center gap-2">
#                     <Button
#                       variant="ghost"
#                       size="icon"
#                       onClick={removeFile}
#                       className="text-muted-foreground hover:text-destructive"
#                       disabled={isUploading}
#                     >
#                       <X className="size-4" />
#                     </Button>
#                     <Button
#                       onClick={handleUpload}
#                       disabled={isUploading}
#                       className="relative"
#                     >
#                       {isUploading ? (
#                         <motion.div
#                           animate={{ rotate: 360 }}
#                           transition={{
#                             duration: 1,
#                             repeat: Infinity,
#                             ease: 'linear',
#                           }}
#                           className="size-4 border-2 border-current border-t-transparent rounded-full"
#                         />
#                       ) : (
#                         <>
#                           <CheckCircle2 className="size-4 mr-2" />
#                           Analyze Report
#                         </>
#                       )}
#                     </Button>
#                   </div>
#                 </div>
#               </Card>
#             </motion.div>
#           )}
#         </AnimatePresence>

#         <AnimatePresence>
#           {error && (
#             <motion.div
#               initial={{ opacity: 0, y: 10 }}
#               animate={{ opacity: 1, y: 0 }}
#               exit={{ opacity: 0, y: -10 }}
#               className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg"
#             >
#               <AlertCircle className="size-4" />
#               <p className="text-sm">{error}</p>
#             </motion.div>
#           )}
#         </AnimatePresence>
#       </div>
#     </div>
#   )
# }
