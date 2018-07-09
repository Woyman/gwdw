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

    // upload text 
    $('#uploadText').on('click', function(){

      var textPlain = $('#my-Text').val();
      var font = $('#fontFamily').val();
      var color = '#'+$('#textColor').val();
      // var num = 0;
      var id = 'text'+varImg;
      // alert(id);


      text = new Konva.Text({

        x: 50,
        y: 50,
        text: textPlain,
        fontFamily: font,
        fill: color,
        fontSize: 14,
        align: 'right',
        draggable: true,
        name: 'object',
        id: id,

      });

      layer.add(text);
      layer.draw();
      varImg++;
      // console.log(text);
      $('#textUploaded').append("<div class='mb-2' id='"+id+"'><div class='col-md-12 row'><div class='col-md-10' style='background: #FFFFFF'><textarea class='form-control' rows='3' id='"+id+"'>"+textPlain+"</textarea></div><div class='col-md-1'><button class='btn btn-primary updateText'>Update</button><button class='btn btn-danger mt-1 deleteText'>Delete</button></div></div><div class='col-md-12 mt-2 row'><div class='col-md-4 row'><label class='col-form-label'>Color :</label><div class='col-md-8 mt-1'><input value='' class='jscolor form-control form-control-sm updateColorText'></div></div><div class='col-md-4 row'><label class='col-form-label'>Font : </label><select class='form-control form-control-sm col-md-8' id='fontFamilUploaded'><option value='Arial'>Arial</option><option value='Segoe Print'>Segoe Print</option><option value='Segoe UI'>Segoe UI</option><option value='Comic Sans MS'>Comic Sans MS</option><option value='Verdana'>Verdana</option></select></div></div><div class='col-md-12 mt-2 row' id='"+id+"'><div class='m-2' ><input type='radio' name='textAlign' value='center'><i class='fa fa-align-center' title='Align Center'></i></div><div class='m-2'><input type='radio' name='textAlign' value='left'><i class='fa fa-align-left' title='Align Left'></i></div><div class='m-2'><input type='radio' name='textAlign' value='right'><i class='fa fa-align-right' title='Align Right'></i></div><div class='m-2'><input type='radio' name='textAlign' value='justify'><i class='fa fa-align-justify' title='Align Justify'></i></div><div class='m-2 ml-3' id='"+id+"'><input type='checkbox' name='textStyle' value='italic'><i class='fa fa-italic' title='Italic'></i></div><div class='m-2'><input type='checkbox' name='textStyle' value='bold'><i class='fa fa-bold' title='Bold'></i></div><div class='m-2' id='"+id+"'><input type='checkbox' name='textDecoration' value='underline'><i class='fa fa-underline' title='Underline'></i></div></div></div>");

      //text align
      $("input:radio[name='textAlign']").change( function(){

        var align = $(this).val();
        var idtext = $(this).parent().parent().attr('id');
        // alert(idtext);
        if($(this).is(':checked')){
          stage.find('#'+idtext).align(align);
          layer.draw();
        } 

      });

      //text style like italic or bold 
      $("input:checkbox[name='textStyle']").change( function(){

        var style = $(this).val();
        var idtext = $(this).parent().parent().attr('id');
        var text1 = layer.find('#'+idtext);
        var Style = text1.fontStyle();      
         // alert(Style);
         // console.log(Style);
        if($(this).is(':checked')){
          stage.find('#'+idtext).fontStyle(style);
          layer.draw();
        }else{ 
          stage.find('#'+idtext).fontStyle('');
          layer.draw();
        }

      });

      //text dcoration for underline
      $("input:checkbox[name='textDecoration']").change( function(){

        var decoration = $(this).val();
        var idtext = $(this).parent().parent().attr('id');
        // alert(align);

        if($(this).is(':checked')){
          stage.find('#'+idtext).textDecoration(decoration);
          layer.draw();
        }else{
          stage.find('#'+idtext).textDecoration('');
          layer.draw();
        }

      });

      //update Text
      $('.updateText').on('click', function(e){

        var idtext = $(this).parent().parent().parent().attr('id');
        var t = $('textarea#'+idtext).val();
        // alert(t);
        stage.find('#'+idtext).text(t);
        layer.draw();

      });

      //delete text
      $('.deleteText').on('click', function(e){

        var idtext = $(this).parent().parent().parent().attr('id');

        $(this).parent().parent().parent().remove();

        stage.find('#'+idtext).destroy();
        layer.draw();
        // alert(idtext);

      });


      $('#saveAsImage').on('clikc', function(){        

      });

    });

     $("input:checkbox[name='imgClip']").change(function() {
       
        var value = $(this).attr('value');
        
        var imgSrc = $(this).parent().find('.img-fluid').attr('src');

        // alert(imgName);
        
        if($(this).is(':checked')){
            
          var clipart = new Image();   
          clipart.src = imgSrc; 
          // tmpWidht = 200;
          // tmpHeight = 200;

          // if( tmpWidht > tmpHeight ){
          //   var imgWidth = 300;
          //   var imgHeight = 200;
          // }else{
            var imgWidth = 200;
            var imgHeight = 200;
          // }

          clipart.onload = function(){
            var clip = new Konva.Image({
            x:50,
            y:50, 
            width: imgWidth,
            height: imgHeight,
            image: clipart,
            id: imgSrc,
            name: 'object',
            draggable: true
            });
            layer.add(clip);
            layer.draw();

          };
            
        }else{
          alert(value);
        }
        
      });



