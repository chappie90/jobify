import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  constructor(private elRef: ElementRef) {}

  @HostBinding('class.open-dropdown') openDropdown = 
false;

  @HostListener('document:click', ['$event']) toggleDropdown(event: Event) {
   this.openDropdown = this.elRef.nativeElement.parentNode.contains(event.target) ? !this.openDropdown: false;
  }
}