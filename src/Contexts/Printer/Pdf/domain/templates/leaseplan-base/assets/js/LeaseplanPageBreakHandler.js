class LeaseplanPageBreakHandler {
  constructor(document) {
    this.document = document;
    this.currentPage = 1;
    this.elementsHeightSum = 0;
    this.lineSum = 0;
  }

  placePageBreaks() {

    const lines = this.document.querySelectorAll('.invoice-line:not(#ubertrag)');
    const header = this.document.getElementById('header');
    const footer = this.document.getElementById('footer');
    const ubertrag = this.document.getElementById('ubertrag');
    const paymentSlip = this.document.getElementById('paymentSlip');

    const pageHeight = 1123;
    const pageHeightWithoutHeaderAndFooter = pageHeight - this.calculateNodeHeight(header) - this.calculateNodeHeight(footer);

    if (1 === lines.length) {
      return;
    }

    const linesArray = Array.from(lines);

    for (let [i, el] of linesArray.entries()) {
      let ubertragHeight = 0;

      if (i < (linesArray.length - 1)) {
        ubertragHeight = this.calculateNodeHeight(ubertrag);

        if (el.classList.contains('subtitle')) {
          ubertragHeight += this.calculateNodeHeight(linesArray[i + 1]);
        }
      }

      const height = this.calculateNodeHeight(el);

      if (1 === this.currentPage) {
        const topPosition = this.calculateNodePosition(el).top + height;

        if (paymentSlip) {
          const paymentSlipHeight = this.calculateNodeHeight(paymentSlip);

          if ((topPosition) > (pageHeight - paymentSlipHeight - ubertragHeight)) {
            if (i > 0) {
              this.placeUbertrag(linesArray[i - 1]);
            }
            this.doAPageBreak(el);
          }
        } else {
          if ((topPosition) > (pageHeight - this.calculateNodeHeight(footer) - ubertragHeight)) {
            if (i > 0) {
              this.placeUbertrag(linesArray[i - 1]);
            }
            this.doAPageBreak(el);
          }
        }
      } else {
        this.elementsHeightSum = this.elementsHeightSum + height;

        if (this.elementsHeightSum > (pageHeightWithoutHeaderAndFooter - ubertragHeight)) {
          this.placeUbertrag(linesArray[i - 1]);
          this.doAPageBreak(el);
        }
      }

      this.lineSum = this.lineSum + parseFloat(el.dataset.amount);
    }
  }

  doAPageBreak(el) {
    this.currentPage++;

    let invoiceDetailsClone = this.duplicateInvoiceDetailsBlock();
    let titleClone = this.duplicateTitleBlock();
    let ubertragClone = this.duplicateUbertragBlock();
    this.placeUbertragAmount(ubertragClone);

    el.before(invoiceDetailsClone);
    el.before(titleClone);
    el.before(ubertragClone);

    this.elementsHeightSum = this.calculateNodeHeight(invoiceDetailsClone) + this.calculateNodeHeight(titleClone) + this.calculateNodeHeight(ubertragClone);
  }

  placeUbertrag(el) {
    let ubertragClone = this.duplicateUbertragBlock();
    this.placeUbertragAmount(ubertragClone);

    el.after(ubertragClone);
  }

  placeUbertragAmount(el) {
    let currency = el.dataset.currency;
    let locale = el.dataset.locale;
    let formattedValue = new Intl.NumberFormat(locale, { style: 'currency', currency: currency, minimumFractionDigits: 2}).format(this.lineSum);

    let price = el.getElementsByClassName('amount-value')[0];
    price.innerText = formattedValue.replace(currency, '').trim();
  }

  placePageNumbers() {
    const totalPagesElem = this.document.getElementsByClassName('total-pages-count');

    for (let i = 0; i < totalPagesElem.length; i++) {
      totalPagesElem[i].innerText = this.currentPage;
    }
  }

  calculateNodePosition(el) {
    let box = el.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
  }

  calculateNodeHeight(el) {
    let height = el.offsetHeight;
    let style = getComputedStyle(el);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

  duplicateTitleBlock() {
    const title = this.document.getElementById('main-title');
    return title.cloneNode(true);
  }

  duplicateUbertragBlock() {
    const ubertrag = this.document.getElementById('ubertrag');
    let clone =  ubertrag.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute("style", "display:block;");

    return clone;
  }

  duplicateInvoiceDetailsBlock() {
    const invoiceDetails = this.document.getElementById('invoice-details');

    let invoiceDetailsClone = invoiceDetails.cloneNode(true);

    invoiceDetailsClone.setAttribute("style", "page-break-before:always;");
    invoiceDetailsClone.classList.add('invoice-details');
    invoiceDetailsClone.classList.add('hide-date');
    invoiceDetailsClone.querySelector('#current-page-count').innerText = this.currentPage;

    return invoiceDetailsClone;
  }
}
