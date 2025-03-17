'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ReportUploadProps {
  onUpload: (fileName: string) => void
}

export function ReportUpload({ onUpload }: ReportUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Check file type (you can add more validation here)
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      setFile(file)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!file) return

    try {
      // TODO: Implement actual upload
      console.log('Uploading file:', file.name)
      onUpload(file.name)
    } catch (err) {
      setError('Failed to upload file. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Upload Report</h1>
          <p className="text-muted-foreground">
            Upload your financial report to begin analysis
          </p>
        </div>

        <Card
          {...getRootProps()}
          className={`border-2 border-dashed transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <div className="p-8 text-center">
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="size-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">
                  {isDragActive
                    ? 'Drop the file here'
                    : 'Drag and drop your report here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to select a file
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                PDF files only, up to 10MB
              </p>
            </div>
          </div>
        </Card>

        {file && (
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button onClick={handleUpload}>Analyze Report</Button>
            </div>
          </Card>
        )}

        {error && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
