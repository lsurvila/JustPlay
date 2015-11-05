$('#buttonDownload').on('click', downloadTestVideo);

function downloadTestVideo(event) {
    event.preventDefault();
    $.ajax({
        type: 'GET',
        url: '/video/download-to-server'
    }).success(function(response) {
        alert('Success: ' + response);
    }).error(function(error) {
        alert('Error: ' + error);
    });
}