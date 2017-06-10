

// Grab the articles as a json
$.getJSON("/articles", function(data){
    //for each one
    for (var i = 0; i < data.length; i++){
        // Display the information on the page
        $('#articles').append('<div class="card ">' +
        '<div class="card-header align-items-start justify-content-between flex">' +
            '<div class="list-unstyled comment-list">' +
                '<div class="media">' +
                    '<div class="media-body">' +
                        '<h6 class="mt-0 mb-1"><a href="'+ data[i].link + '">' + data[i].title + '</h6>' +
                    '</div>' +
                '<ul class="nav card-header-pills pull-right">' + 
                    '<li class="nav-item">' + 
                        '<button class="btn btn-sm btn-link btn-round" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> ' +
                            '<i class="fa fa-chevron-down"></i> ' +
                        '</button>' +
                       '<div class="dropdown-menu">' + 
                            '<a class="dropdown-item" href="#">Hide this post</a>' + 
                            '<a class="dropdown-item" href="#">Edit</a>' + 
                            '<a class="dropdown-item" href="#">Delete</a>' +
                            '<div class="dropdown-divider"></div>' +
                            '<a class="dropdown-item" href="#">Report</a>' + 
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div class="card-block"><p>' +  data[i].excerpt + '</p>'+
        '<div class="row">' +
            '<figure class="responsive-img col"> ' +
                '<a href="../img/post_pic.jpg" rel="gallery-1" class="swipebox" title="My Caption"><img src="'+ data[i].image +'">' + '</a>' +
            '</figure>' +
        '</div>' +
        '<div class="col post-options">' +
            '<button class="btn btn-link text-primary mr-2">' +
                '<i class="fa fa-heart-o text-danger"></i> ' +
                '<span class="text">Like</span> ' +
                '<span class="">(35)</span>' +
            '</button>' +
            '<button class="showcomments btn btn-link text-primary mr-2" data-id="' +  data[i]._id+ '">' +
                '<i class="fa fa-comments text-warning"></i> ' +
                '<span class="text">View Comments</span> ' +
                '<span class="">(6)</span>' +
            '</button>' +
        '</div>' +
       '<div class="list-unstyled comment-list allComments_'+ data[i]._id +'">' +
           '<input id="titleinput" name="title" class="form-control" placeholder="Author" ><br>'+
           '<div class="media comment"> ' +
               '<div class="media-body">' +
                  '<input type="text" id="bodyinput" name="body" class="form-control" placeholder="Write comment">' +
                '</div>' +
               '<button id="savenote" class="commentSubmit btn btn-primary" data-id="' +  data[i]._id +'">Comment</button>' +
            '</div>' +
           '<hr >' +
        '</div>' +
    '</div>' +
'<div class="card-footer text-center"> <a href="#" >View all ' + data[i].comment + ' comments</a> </div></div>');

      //  "<p data-id ='" + data[i]._id + "'>" + data[i].title + "<br/>" + data[i].link + "</p>"
    }
});


// Whenever Someone clicks a p tag
$(document).on("click", ".showcomments", function(){
    console.log("show comments");

    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    // With that done, add the comment information to the page
    .done(function(data){


        // If there's a comment in the article
        if (data.comment) {
            console.log(data.comment.length );
            // Place the title of the comment in the title input
            // Place the body of the comment in the body textarea
            $(".allComments_"+ thisId).append('<div class="media">'+
            '<div class="media-body">'+
                '<h6 class="mt-0 mb-1" id="Author">Author: '+ data.comment.title +'</h6>'+
                '<p class="description">'+ data.comment.body +'</p>' +
                '<button id="delete" class="btn btn-outline-primary btn-round mr-2" data-id="'+ data.comment._id + '">Delete</button>' +
            '</div></div>');
        }
    });
});


// When you click the savenote button
$(document).on("click", "#savenote", function(){
    // Grab this id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from the note textarea
            body: $("#bodyinput").val()
        }
    })
    .done(function(data){
        // Log the response
        console.log(data);
    });


});



// When user clicks the deleter button for a note
$(document).on("click", "#delete", function() {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
      var thisId = $(this).attr("data-id");

  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
        url: "/delete/" + thisId,

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Clear the note and title inputs
      $("#author").val("");
      $("#title").val("");
      // Make sure the #actionbutton is submit (in case it's update)
      $("#actionbutton").html("<button id='makenew'>Submit</button>");
    }
  });
});



