var PDFJS = require('pdfjs-dist/webpack');
var loadingTask;

function load(url) {
  if (loadingTask) {
    loadingTask.destroy();
  }

  loadingTask = PDFJS.getDocument(url);
  loadingTask.promise.then(function (pdfDocument) {
    return pdfDocument.getPage(1).then(function (pdfPage) {
      var viewport = pdfPage.getViewport({ scale: 1.0, });
      var canvas = document.getElementById('theCanvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      var ctx = canvas.getContext('2d');
      var renderTask = pdfPage.render({
        canvasContext: ctx,
        viewport: viewport,
      });
      return renderTask.promise;
    });
  }).catch(function (reason) {
    console.error('Error: ' + reason);
  });
}

load('./helloworld.pdf');

document.addEventListener('click', () => {
  load('./basicapi.pdf');
});
