$('document').ready(function () {



    // =======================
    // Variables
    // =======================


    var gridSize = $('.grid-item').outerHeight();
    var myDropzone = new Dropzone("#js-photobooth", {});
    var photobooth = $('.photobooth');
    var photoboothPos = photobooth.offset().top;
    var extension = 'jpeg';
    var re = /(?:\.([^.]+))?$/;

    var host = window.location.origin;


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
        force_flash: false,
        fps: 45,
        flip_horiz: true
    });



    // =======================
    // Callbacks
    // =======================

    // =======================
    // Functions
    // =======================

    function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }

    Image.prototype.rotate = function(angle) {
        var c = document.createElement("canvas");
        c.width = this.width;
        c.height = this.height;
        var ctx = c.getContext("2d");
        ctx.rotate(angle);
        var imgData = ctx.createImageData(this.width, this.height);
        ctx.putImageData(imgData);
        return new Image(imgData);
    }

    function loadSelfies(){
        $.ajax({
            url: "//hasselt.dev/php/selfies.php",
            dataType: "json",
            success: function (data) {

                $('.grid').empty();

                $.each(data, function(i,filename) {
                    console.log(filename);

                    $('.grid').prepend('<div class="grid-item"><img src="'+ filename +'" alt="" class="grid-item__img"><div class="grid-item--options"><a href="#" class="btn btn-share" target="_blank">Delen</a><a href="'+ filename +'" class="btn btn-download">Downloaden</a></div></div>');
                });

                $('.grid-item img').error(function(){
                    $(this).parent().remove();
                });

                $('.grid-item').each(function(i){
                    $(this).delay(100 * i).animate({
                        opacity: 1
                    });
                });

                $('.grid-item .btn-share').click(function(){
                    var picture = $(this).find('img').attr('src');

                    console.log(picture);

                    FB.ui({
                        method: 'feed',
                        link: 'http://metuitstervenbedreigd.be/',
                        caption: 'Upload je foto op deze website en wij voorzien hem van de gepaste slogan: “Ik ben met uitsterven bedreigd. Red het klimaat. Nu!” Een verzameling van deze foto’s wordt door ons meegenomen naar Parijs. Zo zien de ministers dat ook jij begaan bent met het klimaat! Hoe meer foto’s, hoe sterker de boodschap!',
                        picture: picture
                    }, function(response){
                        console.log(response);
                    });
                });
            }
        });
    }

    loadSelfies();

    function cropImage(file, orientation){

        /*
        extension = re.exec(file['name']);
        extension = extension[1].toLowerCase();

        */


        extension = 'png';


        var reader = new FileReader();
        reader.onloadend = function() {

            var img = new Image;
            var banner = $('.header__img');
            var result = reader.result;


            var canvas = $('#result-canvas');
            var ctx = canvas.get(0).getContext('2d');




            img.src = result;

            img.onload = function(){



                SmartCrop.crop(img, {width: 320, height: 320}, function(result) {


                    ctx.save();


                    switch(orientation){
                        case 2:
                            // horizontal flip
                            ctx.translate(320, 0);
                            ctx.scale(-1, 1);
                            break;
                        case 3:
                            // 180° rotate left
                            ctx.translate(320, 320);
                            ctx.rotate(Math.PI);
                            break;
                        case 4:
                            // vertical flip
                            ctx.translate(0, 320);
                            ctx.scale(1, -1);
                            break;
                        case 5:
                            // vertical flip + 90 rotate right
                            ctx.rotate(0.5 * Math.PI);
                            ctx.scale(1, -1);
                            break;
                        case 6:
                            // 90° rotate right
                            ctx.rotate(0.5 * Math.PI);
                            ctx.translate(0, -320);
                            break;
                        case 7:
                            // horizontal flip + 90 rotate right
                            ctx.rotate(0.5 * Math.PI);
                            ctx.translate(320, -320);
                            ctx.scale(-1, 1);
                            break;
                        case 8:
                            // 90° rotate left
                            ctx.rotate(-0.5 * Math.PI);
                            ctx.translate(-320, 0);
                            break;
                    }

                    ctx.drawImage(img,
                        result.topCrop.x, result.topCrop.y,
                        result.topCrop.width, result.topCrop.height,
                        0, 0, 320, 320
                    );

                    /*
                    ctx.drawImage(img,
                        - width / 2, -height/2,
                        width, height);
                     */

                    ctx.restore();

                    ctx.drawImage(banner[0], 0, 235, 320, 85);





                    var dataURL = canvas.get(0).toDataURL();


                    $('.uploader__result img').attr('src', dataURL);

                    $('.uploader--webcam').hide();
                    $('.uploader--confirm').fadeIn();
                });
            };
        }

        reader.readAsDataURL(file);
    }


    function saveImage(){

        var image = $('.uploader__result img').attr('src');

        $.ajax({
            url: "//hasselt.dev/php/upload.php",
            type: "POST",
            data: {
                base64data : image,
                file_extension : extension
            },
            success: function(data){
                $('.uploader').slideUp();
                loadSelfies();
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


        $("html, body").animate({ scrollTop: photoboothPos });


        Webcam.attach( '.uploader__camera' );

        return false;
    });

    $('.js-webcam-snap-btn').click(function(e){

        e.preventDefault();

        Webcam.snap( function(data_uri) {

            cropImage(dataURItoBlob(data_uri));
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

        saveImage();

        return false;
    });

    // Info image
    $('.js-info-btn').click(function(){

        $('.header__text').slideToggle();

        return false;
    });


    $('a.close').click(function(){

        $('.uploader').slideUp();

        return false;
    });


    // File input change

    $(".js-upload-input").on('change', function(e) {


        EXIF.getData(e.target.files[0], function() {
            var orientation = EXIF.getTag(this, "Orientation");

            for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

                var file = e.originalEvent.srcElement.files[i];

                cropImage(file, orientation);
            }
        });


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






});

