export class FooterService {
  /**
   * positionFooter
   */
  public positionFooter() {
    let windowHeight = window.innerHeight;
    const headerHeight = document.getElementById('header').clientHeight;
    const footerHeight = document.getElementById('footer').clientHeight;
    const contentHeight = document.getElementById('content').clientHeight;

    // Boolean that checks to see if the contentHeight is less than the alotted space for content
    let isSpace = ((windowHeight - (headerHeight + footerHeight)) > contentHeight) ? true : false;

    if (isSpace) {
      document.getElementById('footer').style.position = 'absolute';
    } else {
      document.getElementById('footer').style.position = 'relative';
    }

    window.onresize = function () {
      windowHeight = window.innerHeight;

      // Boolean that checks to see if the contentHeight is less than the alotted space for content
      isSpace = ((windowHeight - (headerHeight + footerHeight)) > contentHeight) ? true : false;

      if (isSpace) {
        document.getElementById('footer').style.position = 'absolute';
      } else {
        document.getElementById('footer').style.position = 'relative';
      }
    };
  }
}
