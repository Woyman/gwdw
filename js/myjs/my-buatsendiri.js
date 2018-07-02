    var widthOfTemplate = ($('#template').width()/100)*80;
    $(".drawhere").attr('style', 'width:'+widthOfTemplate+'px;');
    var width = $('#my-Canvas').width();
    var height = $('#my-Canvas').height();
    var varImg = 0;
    
//------------------ stage konva canvas
    var stage = new Konva.Stage({
      container: 'my-Canvas',
      width: width,
      height: height,
    });

//------------------ transformer for name 'object'
   stage.on('click', function (e) {
      // if click on empty area - remove all transformers
      if (e.target === stage) {
        stage.find('Transformer').destroy();
        layer.draw();
        return;
      }
      // do nothing if clicked NOT on our rectangles
      if (!e.target.hasName('object')) {
        return;
      }
      // remove old transformers
      // TODO: we can skip it if current rect is already selected
      stage.find('Transformer').destroy();

      // create new transformer
      var tr = new Konva.Transformer();
      layer.add(tr);
      tr.attachTo(e.target);
      layer.draw();
    }) 

//------------------ konva layer for shape, image, text, etc
    var layer = new Konva.Layer();
    stage.add(layer);

//------------------ add image to conva layer 
    $('#formImage').on('submit', function(e){
      e.preventDefault();
      var data = new FormData(this);      
      $.ajax({
        url: '../php/insertImage.php',
        type: 'post',
        cache: false,
        dataType: false,
        processData: false,
        contentType: false,
        data: data,
        success: function(e){

          var str = e.replace(/\s/g, '');

          var id = str+varImg;
          var image2 = new Image();   
          image2.src = '../img/template/'+e; 
          tmpWidht = parseInt(image2.width);
          tmpHeight = parseInt(image2.height);

          if( tmpWidht > tmpHeight ){
            var imgWidth = 300;
            var imgHeight = 200;
          }else{
            var imgWidth = 200;
            var imgHeight = 300;
          }
          //--------------- add konva image
          image2.onload = function(){
            var img2 = new Konva.Image({
            x:50,
            y:50,
            width: imgWidth,
            height: imgHeight,
            image: image2,
            id: id,
            name: 'object',
            draggable: true
            });
          layer.add(img2);
          layer.draw();
          };
          
          $('#listImgUploaded').append("<div class='col-md-12 mt-1 uploaded-img' id='"+id+"'> <div class='row'><div class='col-md-3'><img src='../img/template/"+e+"' class='img-fluid rounded'></div><div class='col-md-7'><h5 class='mt-4'>"+e+" </h5></div><div class='col-md-2'><button class='btn btn-danger mt-3 delImageUploaded' id='"+id+"' type='button'>Hapus</button></div></div></div>");
          varImg++;

          //--------------- delete image
          $('.delImageUploaded').click(function(e){
            var idBtn = $(this).attr('id')            
            
            $(this).parent().parent().parent().remove();
            stage.find('#'+idBtn).destroy();
            layer.draw();
            
          });   
        }
      });

    });


    $('#uploadText').on('click', function(){

      var text = $('#my-Text').val();
      var font = $('#fontFamily').val();
      var color = '#'+$('#textColor').val();

      // alert(text+" "+font+" "+color);


      text = new Konva.Text({

        x: 50,
        y: 50,
        text: text,
        fontFamily: 'Comic Sans MS',
        fill: color,
        fontSize: 14,
        align: 'left',
        draggable: true,

      });

      layer.add(text);
      layer.draw();


    });




