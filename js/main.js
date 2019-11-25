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
$("#team-members").owlCarousel({
	items:4,
	autoplay:true,
	smartSpeed:100,
	loop:true,
	autoplayHoverPause:true,
	 
});
$('.counter').counterUp({
		  delay: 10,
		  time: 4000
	  });

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
});

$('#element').tooltip('update')

$(document).mousemove( function(e) {    
    var mouseX = e.pageX - $('#blueprint-rocket').offset().left + 275;
    var mouseY = e.pageY - $('#blueprint-rocket').offset().top - 565;
    $('.tooltip').css({'top':mouseY,'left':mouseX}).fadeIn('slow');
}); 
