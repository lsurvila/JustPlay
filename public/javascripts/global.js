$('#buttonDownloadServer').on('click', downloadVideoServer);
$('#buttonDownloadClient').on('click', downloadVideoClient);

function downloadVideoServer(event) {
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

function downloadVideoClient(event) {
    event.preventDefault();
    $.ajax({
        type: 'GET',
        url: 'video/download-to-client',
        error: function(request, status, error) {
            alert("Error");
        }
    });
}