$('#buttonDownload').on('click', downloadTestVideo);

function downloadTestVideo(event) {
    event.preventDefault();
    $.ajax({
        type: 'GET',
        url: 'video/download-to-server',
        success: function(response) {
            alert('Success: ' + response + ' video downloaded');
        },
        error: function(request, status, error) {
            alert("Error");
        }
    });
}