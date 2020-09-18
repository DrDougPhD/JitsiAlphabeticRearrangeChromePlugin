console.log('Recording all videos and audio stream now!');
window.JitsiRecorder = {};

const supportedMimeTypes = [
    {mimeType: 'video/webm;codecs=vp9,opus'},
    {mimeType: 'video/webm;codecs=vp8,opus'},
    {mimeType: 'video/webm'},
    {mimeType: ''}
].filter(
    ({mimeType}) => MediaRecorder.isTypeSupported(mimeType)
);
const chosenMimeType = supportedMimeTypes[0];

let allRecordedBlobs = {};
let sizes = {};


const downloadData = (event, id, mediaRecorder) => {
    console.log('handleDataAvailable', event);
    if (!event.data || event.data.size === 0) {
        return;
    }

    console.log('Recorder milestone reached, downloading now...', event);
    console.log(`Data size: ${event.data.size} bytes`)
    console.log('Media recorder state:', mediaRecorder);

    const blob = new Blob([event.data], {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const downloader = document.createElement('a');
    downloader.style.display = 'none';
    downloader.href = url;
    downloader.download = `${id}_${Date.now()}.webm`;
    document.body.appendChild(downloader);
    downloader.click();
    setTimeout(() => {
        document.body.removeChild(downloader);
        window.URL.revokeObjectURL(url);
    }, 2500);
};


const startRecording = (streamableElement) => {
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

    allRecordedBlobs[streamableElement.id] = [];
    sizes[streamableElement.id] = 0;

    console.log('Created MediaRecorder', mediaRecorder, 'with options', chosenMimeType);

    // mediaRecorder.onstop = (event) => {
    //     console.log('Recorder stopped: ', event);
    //     console.log('Recorded Blobs: ', allRecordedBlobs[streamableElement.id]);
    //
    //     const blob = new Blob(allRecordedBlobs[streamableElement.id], {type: 'video/webm'});
    //     const url = window.URL.createObjectURL(blob);
    //
    //     console.log('mediaRecorder.stop() on', url);
    //
    //     const downloader = document.createElement('a');
    //     downloader.style.display = 'none';
    //     downloader.href = url;
    //     downloader.download = `${streamableElement.id}.webm`;
    //     document.body.appendChild(downloader);
    //     downloader.click();
    //     setTimeout(() => {
    //         document.body.removeChild(downloader);
    //         window.URL.revokeObjectURL(url);
    //         delete allRecordedBlobs[streamableElement.id];
    //     }, 2500);
    // };

    mediaRecorder.ondataavailable = (event) => downloadData(event, streamableElement.id, mediaRecorder);
    mediaRecorder.onstop = (event) => downloadData(event, streamableElement.id, mediaRecorder);

    const oneMinute = 60000;
    const fiveMinutes = oneMinute * 5;
    mediaRecorder.start(5000);
    console.log('MediaRecorder started', mediaRecorder);

    setTimeout(() => {
        mediaRecorder.stop();
        console.log('Recording stopped.');
    }, fiveMinutes);
}

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
