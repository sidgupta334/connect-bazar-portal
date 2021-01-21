import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UtilsService {
  loggedData: any;
  chartData: any;

  constructor() {}

  public setLoggedData(data) {
    this.loggedData = data;
  }

  public getLoggedData() {
    return this.loggedData;
  }

  public setLoggedStatus(status) {
    if (status) {
      sessionStorage.setItem("loginStatus", "Y");
    } else {
      sessionStorage.setItem("loginStatus", "N");
    }
  }

  public getLoggedStatus() {
    let status = sessionStorage.getItem("loginStatus");

    if (status == "Y") {
      return true;
    } else {
      return false;
    }
  }

  public setChartData(chart) {
    this.chartData = chart;
  }

  public getChartData() {
    return this.chartData;
  }

   getElementTag(tag) {
        /** @type {?} */
        const html = [];
        /** @type {?} */
        const elements = document.getElementsByTagName(tag);
        for (let index = 0; index < elements.length; index++) {
            html.push(elements[index].outerHTML);
        }
        return html.join('\r\n');
    }

  public print(domId, printTitle) {
    /** @type {?} */
    let printContents;
    /** @type {?} */
    let popupWin;
    /** @type {?} */
    let styles = "";
    /** @type {?} */
    let links = "";
    
    // styles = this.getElementTag("style");
    // links = this.getElementTag("link");
    printContents = document.getElementById(domId).innerHTML;
    popupWin = window.open("", "_blank", "top=0,left=0,height=auto,width=auto");
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>${printTitle ? printTitle : ""}</title>
          ${styles}
          ${links}
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
        </head>
        <body onload="window.print(); setTimeout(()=>{ window.close(); }, 0)">
          ${printContents}
        </body>
      </html>`);
    popupWin.document.close();
  }
}
