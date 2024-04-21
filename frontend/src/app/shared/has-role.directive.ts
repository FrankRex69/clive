import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[ifRoleIs]',
})
export class HasRoleDirective implements OnInit {
  @Input('ifRoleIs') roles: string[];

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user && this.roles.includes(user.autorizzazione)) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
