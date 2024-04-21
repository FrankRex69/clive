import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  /*   transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  } */
  constructor(private sanitizer: DomSanitizer) {}

  transform(html) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}
