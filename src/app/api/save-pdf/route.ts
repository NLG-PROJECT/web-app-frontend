import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Received request body:', {
            hasData: !!body.data,
            dataLength: body.data?.length,
            filename: body.filename
        })

        if (!body.data || !body.filename) {
            console.error('Missing required fields:', body)
            return NextResponse.json(
                { error: 'Missing required fields: data and filename' },
                { status: 400 }
            )
        }

        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Data = body.data.replace(/^data:application\/pdf;base64,/, '')
        console.log('Base64 data length:', base64Data.length)

        // Validate base64 data
        if (!base64Data || base64Data.length === 0) {
            console.error('Invalid base64 data')
            return NextResponse.json(
                { error: 'Invalid base64 data' },
                { status: 400 }
            )
        }

        try {
            // Convert base64 to buffer
            const buffer = Buffer.from(base64Data, 'base64')
            console.log('Buffer created, size:', buffer.length)

            // Ensure the uploads directory exists
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
            console.log('Uploads directory path:', uploadsDir)

            if (!fs.existsSync(uploadsDir)) {
                console.log('Creating uploads directory')
                fs.mkdirSync(uploadsDir, { recursive: true })
            }

            // Delete existing file if it exists
            const filePath = path.join(uploadsDir, body.filename)
            console.log('Target file path:', filePath)

            if (fs.existsSync(filePath)) {
                console.log('Deleting existing file')
                fs.unlinkSync(filePath)
            }

            // Write the new file
            console.log('Writing new file')
            fs.writeFileSync(filePath, buffer)
            console.log('File written successfully')

            return NextResponse.json({ success: true })
        } catch (fsError: any) {
            console.error('File system error:', fsError)
            return NextResponse.json(
                { error: `File system error: ${fsError.message || 'Unknown error'}` },
                { status: 500 }
            )
        }
    } catch (error: any) {
        console.error('Error in save-pdf API:', error)
        return NextResponse.json(
            { error: `Failed to save PDF: ${error.message || 'Unknown error'}` },
            { status: 500 }
        )
    }
} 