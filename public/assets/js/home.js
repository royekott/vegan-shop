$(window).ready(function() {
    $("#preloader div").delay(1800).fadeOut();
    $("#preloader").delay(1800).fadeOut("slow");
});
$(document).ready(function(){
    $(window).scroll(function(){
        var scroll = $(window).scrollTop();
        if (scroll > 70) {
            $(".row1").css("background" , "#96ceb4");
            $(".row1").css("transition" , "0.6s");
            $(".row1").css("height" , "60px");
            $(".row1").css("border-color" , "#fff");
            $("#header").css("margin-top" , "-12px");
        }
        if (scroll > 100) {
            $("#checkoutPageContainer").css("display", "flex");
            $("#checkoutPageContainer").css("animation", "fadeInUpBig 1.3s ease-in");
        }
        if (scroll > 200) {
            $("#section1 .group h1").css("font-size", "2.3em")
            $("#section1 .group h1").css("transition", "0.6s")
            $("#section1 .group p").css("font-size", "1.6em");
            $("#section1 .group p").css("transition", "0.6s");
        }
        if (scroll > 250) {
            $(".tab").css("display", "block");
            $(".tab").css("animation","bounceInUpBig 0.9s ease");
        }
        if (scroll > 550) {
            $("#section1 #testImg").css("display", "inline-block");
            $("#section1 #testImg").css("animation", "bounceInRight 0.8s ease");
        }
        if (scroll > 650) {
            $(".accountBricks").css("display", "block");
            $(".accountBricks").css("animation", "fadeInUp 0.8s ease-in");
        }
        if (scroll > 850) {
            $(".storeInfo #testImg").css("display", "inline-block");
            $(".storeInfo #testImg").css("animation", "bounceInLeft 1s ease");
        }
        if (scroll > 1550) {
            $(".reviewHeadline h2").css("font-size", "2.2em");
            $(".reviewHeadline h2").css("transition", "0.8s");
        }
        if (scroll == 0) {
            $(".row1").css("background" , "transparent");
            $(".row1").css("transition" , "0.6s");
            $(".row1").css("height" , "100px");
            $(".row1").css("border-color" , "#96ceb4");
            $("#header").css("margin-top" , "0px");
        }
    });
});
