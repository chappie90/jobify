import { Component } from '@angular/core';

// import * as $ from 'jquery';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

// declare var $: any;

// $(".button").click(function(e){

//   // credit where credit's due; http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design

// let element;
// let circle;
// var d;
// var x;
// var y;
  
//   element = $(this);
  
//   if(element.find(".circle").length == 0)
//     element.prepend("<span class='circle'></span>");
    
//   circle = element.find(".circle");
//   circle.removeClass("animate");
  
//   if(!circle.height() && !circle.width())
//   {
//     d = Math.max(element.outerWidth(), element.outerHeight());
//     circle.css({height: d, width: d});
//   }
  
//   x = e.pageX - element.offset().left - circle.width()/2;
//   y = e.pageY - element.offset().top - circle.height()/2;
  
//   circle.css({top: y+'px', left: x+'px'}).addClass("animate");
// });
}