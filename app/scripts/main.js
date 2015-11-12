$('document').ready(function () {
    // =======================
    // Variables
    // =======================

    var gridSize = $('.grid-item').outerHeight();
    var myDropzone = new Dropzone("#js-photobooth", {});
    var photobooth = $('.photobooth');
    var photoboothPos = photobooth.offset().top;


    Webcam.set({
        width: 320,
        height: 240,

        width: 480,
        height: 360,

        // final cropped size
        crop_width: 320,
        crop_height: 320,

        image_format: 'jpeg',
        jpeg_quality: 90,
        fps: 45
    });



    // =======================
    // Callbacks
    // =======================

    // =======================
    // Functions
    // =======================

    function cropImage(file){

        var reader = new FileReader();
        reader.onloadend = function() {

            var img = new Image;
            var result = reader.result;


            var myCanvas = $('#result-canvas');
            var ctx = myCanvas.get(0).getContext('2d');

            img.src = result;


            img.onload = function(){

                SmartCrop.crop(img, {width: 320, height: 320}, function(result) {


                    ctx.drawImage(img,
                        result.topCrop.x, result.topCrop.y,
                        result.topCrop.width, result.topCrop.height,
                        0, 0,
                        320,320
                    );

                    var dataURL = myCanvas.get(0).toDataURL();

                    $('.uploader__result img').attr('src', dataURL);

                    $('.uploader--webcam').hide();
                    $('.uploader--confirm').fadeIn();
                });
            };
        }

        reader.readAsDataURL(file);
    }


    function saveImage(file){

        $.ajax({
            type: "POST",
            url: "index.php?action=saveNewPost",
            data: {text: text, img: encodeURIComponent(base64img)},
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            success: function(){
                //...
            }
        });


    }




    // =======================
    // Event Handlers
    // =======================

    // Webcam btn click

    $('.js-webcam-btn').click(function(){
        $('.uploader__inner').hide();
        $('.uploader--confirm').hide();
        $('.uploader--webcam').slideDown();



        return false;
    });

    $('.js-webcam-snap-btn').click(function(){

        Webcam.snap( function(data_uri) {
            console.log(data_uri);
            $('.uploader__result img').attr('src', data_uri);
        } );

        $('.uploader--webcam').hide();

        $('.flash').fadeIn(100).fadeOut(1000);

        $('.uploader--confirm').fadeIn();

        return false;

    })

    // Back button

    $('.js-home-btn').click(function(){
        $('.uploader').slideUp();

        return false;
    });

    // Upload / Mobile Cam btn click

    $('.js-upload-btn').click(function(){

        $('.js-upload-input').trigger('click');

        return false;
    });

    // Save webcam image
    $('.js-webcam-save-btn').click(function(){

    });


    $('a.close').click(function(){

        $('.uploader').slideUp();

        return false;
    });


    // File input change

    $(".js-upload-input").on('change', function(e) {

        for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

            var file = e.originalEvent.srcElement.files[i];

            cropImage(file);
        }
    });

    $(window).on('scroll', function(){
        setTimeout(function() {
            if ($(window).scrollTop() > photoboothPos) {
                photobooth.css({
                    position: 'fixed',
                    left: 0,
                    top: 0
                });
                $('.grid').css({
                    marginTop: photobooth.outerHeight()
                });

            } else {
                photobooth.css({
                    position: 'static'
                });

                $('.grid').css({
                    marginTop: 0
                });

            }
        } , 20);
    });


    // Dropzone
    /*
    myDropzone.on("addedfile", function(file) {
        console.log(file);
    });

    myDropzone.on("dragover", function(){
        $('.photobooth').addClass('dragenter');
    });
    myDropzone.on("dragleave", function(){
        $('.photobooth').removeClass('dragenter');
    });
    */

    // =======================
    // CSS
    // =======================




    // =======================
    // Shizzle
    // =======================

    Webcam.attach( '.uploader__camera' );




});

