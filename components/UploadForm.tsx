'use client'
import React from 'react'
import {useState, useRef, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {Upload, Image as ImageIcon, X} from 'lucide-react'
import LoadingOverlay from '@/components/LoadingOverlay'
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'

const MB = 1024 * 1024
const MAX_PDF_SIZE = 50 * MB

const VoiceEnum = z.enum(['dave','daniel','chris','rachel','sarah'])

const formSchema = z.object({
  pdf: z
    .instanceof(File)
    .refine((file) => file.type === 'application/pdf', 'Please upload a valid PDF file')
    .refine((file) => file.size <= MAX_PDF_SIZE, 'PDF must be less than 50MB'),
  cover: z
    .union([z.instanceof(File), z.null()])
    .refine((file) => !file || file.type.startsWith('image/'), 'Cover must be an image')
    .optional()
    .nullable(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author name is required'),
  voice: VoiceEnum
})

type FormValues = z.infer<typeof formSchema>

const UploadForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const pdfInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdf: undefined as unknown as File,
      cover: null,
      title: '',
      author: '',
      voice: 'rachel'
    }
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      // Placeholder: integrate with your upload/create API here
      await new Promise((res) => setTimeout(res, 1200))
      console.log('Submit new book', values)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPdfFile(file)
      form.setValue('pdf', file, { shouldValidate: true })
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
      form.setValue('cover', file, { shouldValidate: true })
    }
  }

  const removePdf = () => {
    setPdfFile(null)
    if (pdfInputRef.current) pdfInputRef.current.value = ''
    // cast undefined to force validation error on required field
    form.setValue('pdf', undefined as unknown as File, { shouldValidate: true })
  }

  const removeCover = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(null)
    setCoverPreview(null)
    if (coverInputRef.current) coverInputRef.current.value = ''
    form.setValue('cover', null, { shouldValidate: true })
  }

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  const dropzoneBase = 'upload-dropzone border-2 border-dashed border-[var(--border-subtle)]'
  const uploadedCls = 'upload-dropzone-uploaded'

  return (
    <div className="new-book-wrapper">
      <LoadingOverlay open={submitting} title="Beginning synthesis…" />

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {/* PDF Upload */}
          <FormField
            control={form.control}
            name="pdf"
            render={() => (
              <FormItem>
                <FormLabel className="form-label">Book PDF File</FormLabel>
                <FormControl>
                  <div>
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handlePdfChange}
                    />
                    <div
                      className={`${dropzoneBase} ${pdfFile ? uploadedCls : ''}`}
                      onClick={() => pdfInputRef.current?.click()}
                      role="button"
                      aria-label="Upload PDF"
                    >
                      {!pdfFile ? (
                        <div className="file-upload-shadow">
                          <Upload className="upload-dropzone-icon" />
                          <div className="upload-dropzone-text">Click to upload PDF</div>
                          <div className="upload-dropzone-hint">PDF file (max 50MB)</div>
                        </div>
                      ) : (
                        <div className="file-upload-shadow w-full">
                          <div className="flex items-center justify-between w-full">
                            <div className="upload-dropzone-text font-semibold truncate max-w-[85%]">{pdfFile.name}</div>
                            <button type="button" className="upload-dropzone-remove" onClick={(e) => { e.stopPropagation(); removePdf() }}>
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="upload-dropzone-hint">PDF file selected</div>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Upload */}
          <FormField
            control={form.control}
            name="cover"
            render={() => (
              <FormItem>
                <FormLabel className="form-label">Cover Image (Optional)</FormLabel>
                <FormControl>
                  <div>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverChange}
                    />
                    <div
                      className={`${dropzoneBase} ${coverFile ? uploadedCls : ''} overflow-hidden`}
                      onClick={() => coverInputRef.current?.click()}
                      role="button"
                      aria-label="Upload cover image"
                    >
                      {!coverFile ? (
                        <div className="file-upload-shadow">
                          <ImageIcon className="upload-dropzone-icon" />
                          <div className="upload-dropzone-text">Click to upload cover image</div>
                          <div className="upload-dropzone-hint">Leave empty to auto-generate from PDF</div>
                        </div>
                      ) : (
                        <div className="flex items-center w-full h-full p-4 gap-4">
                          {coverPreview && (
                            <div className="relative w-24 h-32 flex-shrink-0 shadow-md rounded overflow-hidden border border-white/20">
                              <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="upload-dropzone-text font-semibold truncate">{coverFile.name}</div>
                              <button type="button" className="upload-dropzone-remove ml-2" onClick={(e) => { e.stopPropagation(); removeCover() }}>
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="upload-dropzone-hint">Cover image selected</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ex: Rich Dad Poor Dad" className="form-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ex: Robert Kiyosaki" className="form-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Voice selector */}
          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        <span className="w-6 h-px bg-[var(--border-subtle)]"></span>
                        Male Voices
                      </div>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3">
                        {[
                          { id: 'dave', name: 'Dave', desc: 'Young male, British-Essex' },
                          { id: 'daniel', name: 'Daniel', desc: 'Middle-aged male, British' },
                          { id: 'chris', name: 'Chris', desc: 'Male, conversational' },
                        ].map((v) => (
                          <label
                            key={v.id}
                            className={`voice-selector-option group flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-200 ${field.value === v.id ? 'voice-selector-option-selected ring-2 ring-[var(--accent-warm)] shadow-md' : 'voice-selector-option-default hover:border-[var(--accent-warm)]/50 hover:bg-[var(--accent-light)]/30'}`}
                          >
                            <RadioGroupItem value={v.id} id={`voice-${v.id}`} className="sr-only" />
                            <div className={`flex items-center justify-center w-4 h-4 rounded-full border mt-1 transition-colors ${field.value === v.id ? 'bg-[var(--accent-warm)] border-[var(--accent-warm)]' : 'border-gray-300'}`}>
                              {field.value === v.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className={`font-bold transition-colors ${field.value === v.id ? 'text-[#663820]' : 'text-gray-700'}`}>{v.name}</span>
                              <span className="text-xs text-[var(--text-secondary)] line-clamp-1">{v.desc}</span>
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        <span className="w-6 h-px bg-[var(--border-subtle)]"></span>
                        Female Voices
                      </div>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3">
                        {[
                          { id: 'rachel', name: 'Rachel', desc: 'Young female, American' },
                          { id: 'sarah', name: 'Sarah', desc: 'Young female, American' },
                        ].map((v) => (
                          <label
                            key={v.id}
                            className={`voice-selector-option group flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-200 ${field.value === v.id ? 'voice-selector-option-selected ring-2 ring-[var(--accent-warm)] shadow-md' : 'voice-selector-option-default hover:border-[var(--accent-warm)]/50 hover:bg-[var(--accent-light)]/30'}`}
                          >
                            <RadioGroupItem value={v.id} id={`voice-${v.id}`} className="sr-only" />
                            <div className={`flex items-center justify-center w-4 h-4 rounded-full border mt-1 transition-colors ${field.value === v.id ? 'bg-[var(--accent-warm)] border-[var(--accent-warm)]' : 'border-gray-300'}`}>
                              {field.value === v.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className={`font-bold transition-colors ${field.value === v.id ? 'text-[#663820]' : 'text-gray-700'}`}>{v.name}</span>
                              <span className="text-xs text-[var(--text-secondary)] line-clamp-1">{v.desc}</span>
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button type="submit" className="form-btn">Begin Synthesis</button>
        </form>
      </Form>
    </div>
  )
}

export default UploadForm
