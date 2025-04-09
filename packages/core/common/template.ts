import hbs from 'handlebars'
import { Page, PDFOptions, Browser } from 'puppeteer-core'
import { PDFDocument } from 'pdf-lib'

export { Browser, Page, PDFDocument }

export type Any = { [key:string] : any }

export enum InteractionType {
    onLoad = "onLoad",
    onClick = "onClick",
}

export interface PDFRenderOptions extends PDFOptions {
    // savePdfToExport?: boolean
}

export type PDFTemplateData<T> = T & {
    template: {
        options: PDFRenderOptions
    }
}

export interface PDFRenderOutput<T> {
    buffer: Buffer,
    html: string,
    pdf: PDFDocument,
    page: Page,
    pdf_template_data: PDFTemplateData<T>
}

export class Template<T> {
    public template: string
    public options: CompileOptions

    constructor(template: string, options?: CompileOptions) {
        this.template = template
        this.options = options || {}
    }

    // downloads compiles template from url
    public static async download<T = Any>( url: string, options?: CompileOptions ): Promise<Template<T>> {
        const template = await fetch(url, {
            method: 'GET'
        })
        .then((response) => response.text())
        
        return new Template<T>(template, options)
    }

    // compiles new template from string
    public static compile<T = Any>( template: string, options?: CompileOptions ): Template<T> {
        return new Template<T>(template, options)
    }

    public render( template_data: T ): string {
        const _hbs = hbs.compile(this.template, this.options)
        return _hbs(template_data)
    }

    // render pdf template
    public async renderPdf( template_data: T, browser: Browser, options: PDFRenderOptions ): Promise<PDFRenderOutput<T>> {
        // render curent page
        const pdf_template_data: PDFTemplateData<T> = {
            ...template_data,
            template: {
                options
            }
        }

        const page = await browser.newPage()
        const _hbs = hbs.compile(this.template, this.options)
        const page_content = _hbs(pdf_template_data)
        await page.setContent(page_content)
        const buffer = await page.pdf(options)
        await page.close()
        const pdf = await PDFDocument.load(buffer)

        const pdf_render_output: PDFRenderOutput<T> = {
            page,
            pdf,
            buffer,
            html: page_content,
            pdf_template_data,
        }
        
        return pdf_render_output
    }

    // cleans template
    public static clean(_tpl: string) {
        // remove line breaks
        _tpl = _tpl.replace(/(\r\n|\n|\r)/gm, "")
        // whitespaces
        _tpl = _tpl.replace(/ /g,'')
        return _tpl
    }

    // export generated pdfs
    static async mergePdf<T>(pdfs: PDFRenderOutput<T>[]): Promise<PDFDocument> {
        const pdf = await PDFDocument.create()
        
        for(const _pdf of pdfs) {
            const pages = await pdf.copyPages(_pdf.pdf, _pdf.pdf.getPageIndices())
            for (const page of pages) {
                pdf.addPage(page)
            }
        }

        return pdf
    }
}