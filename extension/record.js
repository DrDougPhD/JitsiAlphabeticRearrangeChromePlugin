console.log('Recording all videos and audio stream now!');

let mediaRecorders = {};
let allRecordedBlobs = {};


const handleDataAvailable = (event, id) => {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        allRecordedBlobs[id].push(event.data);
    }
};


const startRecording = (streamableElement) => {
    const supportedMimeTypes = [
        {mimeType: 'video/webm;codecs=vp9,opus'},
        {mimeType: 'video/webm;codecs=vp8,opus'},
        {mimeType: 'video/webm'},
        {mimeType: ''}
    ].filter(
        ({mimeType}) => MediaRecorder.isTypeSupported(mimeType)
    );

    if (!supportedMimeTypes) {
        alert('MediaRecorder of your browser does not support available Mime Types :(');
        return;
    }

    const chosenMimeType = supportedMimeTypes[0];
    let mediaRecorder;
    try {
        mediaRecorder = new MediaRecorder(
            streamableElement.captureStream(30),
            chosenMimeType
        );
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }

    console.log(`Recording <${streamableElement.tagName}> with id="${streamableElement.id}"`);

    mediaRecorders[streamableElement.id] = mediaRecorder;
    const recordedBlobs = [];
    allRecordedBlobs[streamableElement.id] = [];

    console.log('Created MediaRecorder', mediaRecorder, 'with options', chosenMimeType);

    mediaRecorder.onstop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = (event) => handleDataAvailable(event, streamableElement.id);
    mediaRecorder.start();
    console.log('MediaRecorder started', mediaRecorder);

    setTimeout(() => {
        stopRecording(streamableElement);
    }, 5000);
}


const stopRecording = (streamableElement) => {
    const mediaRecorder = mediaRecorders[streamableElement.id];
    mediaRecorder.stop();

    const blob = new Blob(allRecordedBlobs[streamableElement.id], {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);

    console.log('stopRecording()', url);

    const downloader = document.createElement('a');
    downloader.style.display = 'none';
    downloader.href = url;
    downloader.download = 'test.webm';
    document.body.appendChild(downloader);
    downloader.click();
    setTimeout(() => {
        document.body.removeChild(downloader);
        window.URL.revokeObjectURL(url);
        // delete allRecordedBlobs[streamableElement.id];
    }, 2500);
};

// Grab all <video> elements and create a MediaRecorder for each

const sampleVideo = document.querySelectorAll('#filmstripRemoteVideosContainer video')[0];
startRecording(sampleVideo);

// [...document.querySelectorAll('#filmstripRemoteVideosContainer video')]
//     .forEach(video => {
//         const mediaRecorder = new MediaRecorder(video, {mimeType: 'video/webm'});
// });

// [...document.querySelectorAll('#filmstripRemoteVideosContainer audio')]
//     .forEach(audio => {});
//
//
