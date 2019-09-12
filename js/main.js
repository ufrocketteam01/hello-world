jQuery(document).ready(function(){
    "use strict"

 



   
    $("a.smooth-scroll").click(function (event) {

      event.preventDefault();
      
      var section = $(this).attr("href");

      $('html, body').animate({
          scrollTop: $(section).offset().top - -2
      }, 1250, "easeInOutExpo");
  });
   new WOW().init();

});