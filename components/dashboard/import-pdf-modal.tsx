'use client'

import { useState } from 'react'
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react'
import { subjectActions, type Subject } from '@/lib/subjects'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export function ImportPdfModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [successCount, setSuccessCount] = useState<number | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const text = textContent.items.map((item: any) => item.str).join(' ')
        fullText += text + '\n'
      }

      const parsedSubjects: Subject[] = []
      
      // Dividir el texto en bloques basados en el código de materia [XXXX]
      const rawBlocks = fullText.split(/(?=\[\d+\])/g)

      rawBlocks.forEach((block) => {
        const matchCode = block.match(/\[(\d+)\]/)
        if (!matchCode) return
        const code = matchCode[1]

        // Extraer el nombre (todo lo que está entre el código y el siguiente marcador como ../bajarprograma, 1er C, etc.)
        let namePart = block.replace(/\[\d+\]/, '').split(/(\.\.\/|1er C\.|2do C\.|OB|OP)/)[0] || ''
        let name = namePart.replace(/(\.\.\/|bajarprograma.*)/g, '').trim()

        if (!name || name.length < 3 || name.includes('Nombre') || name.includes('Sistema')) return

        // Detectar cuatrimestre real del bloque
        let semester: '1C' | '2C' | 'Anual' = '1C'
        if (/2do C\./i.test(block)) {
          semester = '2C'
        } else if (/Anual/i.test(block)) {
          semester = 'Anual'
        }

        // Detectar año real del bloque (buscando el número de año en el texto del renglón)
        let year = 1
        const yearMatch = block.match(/\b([1-5])\b(?!\s*hs|\s*cuatrimestres)/g)
        
        // Asignación inteligente por código o por texto detectado en el bloque de la UNRC
        if (/5/.test(block.slice(-30))) year = 5
        else if (/4/.test(block.slice(-30))) year = 4
        else if (/3/.test(block.slice(-30))) year = 3
        else if (/2/.test(block.slice(-30))) year = 2
        else {
          // Asignación por rangos de códigos conocidos del plan de la UNRC
          const numCode = Number(code)
          if (numCode >= 3393 && numCode <= 3398) year = 4
          else if (numCode >= 3386 && numCode <= 3392) year = 3
          else if (numCode >= 3380 && numCode <= 3385 || numCode === 3402 || numCode === 3403) year = 2
          else if (numCode >= 3375 && numCode <= 3379) year = 1
          else if (numCode >= 1900 || numCode >= 3300) year = 5 // Optativas y otras de años superiores
        }

        // Evitar duplicados
        if (!parsedSubjects.some((s) => s.code === code)) {
          parsedSubjects.push({
            id: code,
            code,
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            year,
            semester,
            hours: 112,
            status: 'available',
            requires: [],
          })
        }
      })

      if (parsedSubjects.length > 0) {
        parsedSubjects.forEach((sub) => subjectActions.addSubject(sub))
        setSuccessCount(parsedSubjects.length)
      } else {
        alert('No se pudieron extraer materias. Comprobá el archivo.')
      }
    } catch (error) {
      console.error('Error al leer el PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-muted"
      >
        <Upload className="size-4 text-primary" />
        Importar Plan desde PDF
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Carga masiva desde PDF (UNRC)</h2>
              <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Subí el PDF oficial de la UNRC para importar tus materias con sus años y cuatrimestres correctos automáticamente.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center">
              {loading ? (
                <p className="text-sm font-medium text-muted-foreground">Analizando cuatrimestres y años...</p>
              ) : successCount !== null ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="size-10 text-emerald-500" />
                  <p className="text-sm font-semibold">¡Se importaron {successCount} materias correctamente!</p>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      window.location.reload()
                    }}
                    className="mt-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Actualizar tablero
                  </button>
                </div>
              ) : (
                <>
                  <FileText className="size-10 text-muted-foreground" />
                  <label className="mt-4 cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                    Seleccionar PDF del SIAL
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}