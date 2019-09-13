import { Directive, ElementRef, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  constructor(private elRef: ElementRef) {}

  @HostBinding('class.open-dropdown') openDropdown = false;

  @HostListener('document:click', ['$event']) toggleDropdown(event: Event) {
    // console.log(this.elRef.nativeElement);
    console.log(this.elRef.nativeElement.parentNode);
    console.log(event.target);
   this.openDropdown = this.elRef.nativeElement.parentNode == event.target ? !this.openDropdown: false;
  }
}