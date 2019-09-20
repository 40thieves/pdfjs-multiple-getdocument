# pdfjs-multiple-getDocument

Minimal working example demonstrating a question/potential issue with PDFjs.
Hosted version: [https://silly-knuth-42fbb4.netlify.com/](https://silly-knuth-42fbb4.netlify.com/)

## Steps to Reproduce

1. `git clone git@github.com:40thieves/pdfjs-multiple-getdocument.git`
2. `cd pdfjs-multiple-getdocument`
3. `npm install`
4. `npm start`
5. Open `localhost:8081/dist/index.html`
6. Observe that `helloworld.pdf` is rendered correctly
7. Click anywhere in the document
8. Observe that `basicapi.pdf` is not rendered
9. A second click will render `basicapi.pdf` correctly

## Notes

In our usage of PDFjs we want to "update" the rendered PDF with new content
based on user interaction. We therefore have multiple calls to `getDocument`
into a single `<canvas>`. To prevent memory leaks we call `destroy()` on the
`PDFDocumentLoadingTask` when a new PDF url needs to be loaded & rendered.

Previously we were vendoring PDFjs and setting `GlobalWorkerOptions.workerSrc`
to the `pdf.worker.js` path. This meant that the worker was re-fetched after it
was destroyed (not necessarily a problem due to HTTP caching). We are switching
to bundle with webpack using the  `pdfjs-dist/webpack` entry point. This sets
`GlobalWorkerOptions.workerPort`, which appears to cache the worker so that it
doesn't need to be re-fetched.

However we are now encountering an issue where the PDF is not rendered correctly
for subsequent `getDocument` calls. This is what this minimal working example
demonstrates.

I believe that there is a race condition between the initial worker being
destroyed (line 6 in `main.js`) and the call to `getDocument` for
`basicapi.pdf`. This means that the `getDocument` fetch is being called on a
worker that is about to be destroyed.

So I have either a bug report or a question: is it expected that we should
manually clean up the `PDFDocumentLoadingTask` when a new PDF url needs to be
rendered? Or does PDFjs clean itself up correctly on subsequent `getDocument`
calls?

If we are expected to clean up manually, then I believe the best solution would
be to make `destroy()` async.
