function screenShot() {

    let aScene = document.querySelector("a-scene")
    let screenshotCanvas = aScene.components.screenshot.getCanvas("perspective");
    // var canvas = document.querySelector('.a-canvas');
    // let calbratedCanvas = calibrateCanvas(screenshotCanvas);
    let frame = captureVideoFrame("video", "png");
    let canvas = resizeCanvas(screenshotCanvas, frame.width, frame.height);

    mergeImages([frame.dataUri, canvas]).then(b64 => {
        let link = document.getElementById("download-link", "png");
        link.setAttribute("download", "AR.png");
        link.setAttribute("href", b64);
        link.click();
    });

}

function captureVideoFrame(video, format, width, height) {

    if (typeof video === 'string') {
        video = document.querySelector(video);
        // console.log('Video:' + video);
    } else {
        video = document.querySelector(video);
        console.log('video:' + video);
    }

    format = format || 'jpeg';

    if (!video || (format !== 'png' && format !== 'jpeg')) {
        return false;
    }

    var canvas = document.createElement("canvas");
    canvas.width = width || video.videoWidth;
    canvas.height = height || video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    var dataUri = canvas.toDataURL('image/' + format);
    var data = dataUri.split(',')[1];
    var mimeType = dataUri.split(';')[0].slice(5)

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }

    var blob = new Blob([arr], { type: mimeType });
    return { blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height };
};

function resizeCanvas(origCanvas, width, height) {
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d");

    resizedCanvas.height = height;
    resizedCanvas.width = width;

    if (width > height) {
        // Landscape
        resizedContext.drawImage(origCanvas, 0, 0, width, height);
    } else {
        // Portrait

        let calbratedCanvas = calibrateCanvas(origCanvas);

        var scale = width / height;
        var scaledHeight = calbratedCanvas.height
        var scaledWidth = calbratedCanvas.height * scale;
        var marginLeft = (calbratedCanvas.width - scaledWidth) / 2;

        resizedContext.drawImage(calbratedCanvas, marginLeft, 0, scaledWidth, scaledHeight, 0, 0, width, height);
    }

    return resizedCanvas.toDataURL();
}

function calibrateCanvas(canvas) {

    let cvs = document.createElement("canvas");
    let ctx = cvs.getContext("2d");

    cvs.height = canvas.height;
    cvs.width = canvas.height * (1 / 0.75);

    ctx.drawImage(canvas, 0, 0, cvs.width, cvs.height);

    return cvs
}