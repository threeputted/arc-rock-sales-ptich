



// General Save Form with Messenger
function SaveItem(form){
    try {
        event.preventDefault();
        var $form = $(form),
            term = $form.serialize();
        url = $form.attr( "action" );
        var posting = $.post( url, term );
        posting.done(function( data ) {
            if (data.status == 'OK'){
                Messenger().post({
                    message: data.message
                    , type: 'success'
                });
                //alert("This is the id: " + data.id);
                document.getElementById("targetId").value = data.id || "";
            } else {
                Messenger().post({
                    message: JSON.stringify(data.errors) || data.message
                    , type: 'error'
                });
            }
        });
    } catch(err) {
        alert(err)
    }
}


