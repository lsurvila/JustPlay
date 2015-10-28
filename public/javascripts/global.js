$('#buttonDownload').on('click', downloadTestVideo);

function downloadTestVideo(event) {
    event.preventDefault();
    $.ajax({
        type: 'GET',
        url: '/video/test'
    }).done(function(response) {
        if (response.msg === '') {
            console.log('Response OK');
        } else {
            alert('Error: ' + response.msg);
        }
    });
}