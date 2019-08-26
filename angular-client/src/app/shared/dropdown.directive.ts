import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  constructor(private elRef: ElementRef) {}

  @HostBinding('class.nav-primary__profile-list-open') openDropdown = false;

  @HostListener('document:click', ['$event']) toggleDropdown(event: Event) {
   this.openDropdown = this.elRef.nativeElement.parentNode == event.target ? !this.openDropdown: false;
  }
}