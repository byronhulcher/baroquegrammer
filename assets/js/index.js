$(function() {
  const PARENT_FACE_X_1 = '320px'; // Distance of face hole from left. Gross.
  const PARENT_FACE_Y_1 = '260px' // Distance of face hole from top. Gross.
  const PARENT_FACE_HEIGHT_1 = '110px' // The height of the face hole. Gross.
  const PARENT_FACE_WIDTH_1 = 75; // The width of the face hole. Gross.

  const PARENT_FACE_X_2 = '325px'; // Distance of face hole from left. Gross.
  const PARENT_FACE_Y_2 = '85px' // Distance of face hole from top. Gross.
  const PARENT_FACE_HEIGHT_2 = '124px' // The height of the face hole. Gross.
  const PARENT_FACE_WIDTH_2 = 92; // The width of the face hole. Gross.

  var imageFace = $('.image-face'); // The element the face is planted onto
  var imageFace1 = $('#image-face-1');
  var imageFace2 = $('#image-face-2');
  var imageTarget1 = $('#image-target-1'); // The "face hole". Gross.
  var imageTarget2 = $('#image-target-2'); // The "face hole". Gross.
  var imagePreview = $('#image-preview');

  // Place the image target element on document load from the constants that are
  // defined above.
  $(document).ready(function() {
    imageTarget1.
      css('left', PARENT_FACE_X_1).
      css('top', PARENT_FACE_Y_1).
      css('height', PARENT_FACE_HEIGHT_1).
      css('width', PARENT_FACE_WIDTH_1)

    imageTarget2.
      css('left', PARENT_FACE_X_2).
      css('top', PARENT_FACE_Y_2).
      css('height', PARENT_FACE_HEIGHT_2).
      css('width', PARENT_FACE_WIDTH_2)
  });

  // Pulls the face out from the file input
  $('#image-file-field').change(function() {
    var data = $(this)[0].files[0];

    showPreview(data);
  });

  // Return how big the original face is in comparision with the "face hole".
  // Again, gross.
  function findScale(face) {
    return (PARENT_FACE_WIDTH_2 / face.width);
  }

  // Spits the face out into the document. To be honest I just wanted to use the
  // word "spits" here and you can't stop me. I won't merge your PR to change
  // that.
  function placeFace(callback) {
    imageFace.one("load", callback);
    var imagePath = imagePreview.attr('src');

    imageFace.attr('src', imagePath);
    
  }

  // This is where the face detection / image "validation" is done.
  function processFace() {
    imagePreview.faceDetection({
      complete: function(faces) {
        var face = randomFace(faces);

        if (face) {
          placeFace(sizeFace.bind(this, face));
        } else {
          alert(
            "Yikes! Couldn't find a face in this image. Try another one. " +
            "Don't worry it's not your fault programming is a nightmare."
          );
        }
      }
    });
  }

  // I haven't gone ahead and implemented a way to actually target a face so I'm
  // just picking a random face that's detected because I hate humanity.
  function randomFace(faces) {
    return $.rand(faces);
  }

  // This sets a preview field that's used for facial detection. A future
  // refactor could probably remove this step altogether and do everything on
  // the fly but that's a step for another day y'all.
  function showPreview(data) {
    var reader = new FileReader();

    reader.onload = function(event) {
      imagePreview.attr('src', event.target.result)
      processFace();
    }

    reader.readAsDataURL(data);
  }

  // Actually size the face behind the main image
  function sizeFace(face) {
    var scale = PARENT_FACE_WIDTH_1 / face.width;
    var marginLeft = face.x * scale;
    var marginTop = face.y * scale;

    imageFace1.
      css('margin-left', -(marginLeft)).
      css('margin-top', -(marginTop)).
      css('transform', 'scale(' + scale + ')');

    var scale = PARENT_FACE_WIDTH_2 / face.width;
    var marginLeft = face.x * scale;
    var marginTop = face.y * scale;

    imageFace2.
      css('margin-left', -(marginLeft)).
      css('margin-top', -(marginTop)).
      css('transform', 'scale(' + scale + ')');
  }

  // Let's make a random function that we're stealing from Stack Overflow
  // because my time is worth something to me and you don't know me.
  $.rand = function(arg) {
    if ($.isArray(arg)) {
      return arg[$.rand(arg.length)];
    } else if (typeof arg === "number") {
      return Math.floor(Math.random() * arg);
    } else {
      return 4;  // chosen by fair dice roll
    }
  };
});
