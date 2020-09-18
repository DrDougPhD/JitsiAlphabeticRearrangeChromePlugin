console.log('Recording all videos and audio stream now!');

function JitsiRecorder() {
}

window.JitsiRecorder = {
    mimeTypes: {
        audio: [
            'audio/webm;codecs=opus',
            'audio/webm;codecs=vorbis',
            'audio/ogg;codecs=opus',
            'audio/ogg;codecs=vorbis',
            'audio/webm;codecs=flac',
            'audio/wav',
        ].filter(MediaRecorder.isTypeSupported),
        video: [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm;codecs=daala',
            'video/webm;codecs=h264',
            'video/webm;codecs="av01.2.19H.12.0.000.09.16.09.1"',
            'video/webm',
            'video/mpeg',
        ].filter(MediaRecorder.isTypeSupported),
    },
    recorders: {}
};

console.log('Supported video mime types:', window.JitsiRecorder.mimeTypes.video);
console.log('Supported audio mime types:', window.JitsiRecorder.mimeTypes.audio);


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
    const mimeType = window.JitsiRecorder.mimeTypes[streamableElement.tagName.toLowerCase()][0];
    console.log(`Mime type: ${mimeType}`);
    try {
        const stream = streamableElement.captureStream(30);
        mediaRecorder = new MediaRecorder(
            stream,
            {mimeType}
        );
        // TODO:  videoStream.onended = () => {...}
    } catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        return;
    }

    console.log(`Recording <${streamableElement.tagName}> with id="${streamableElement.id}"`);
    console.log('Created MediaRecorder', mediaRecorder, 'with options', mimeType);

    mediaRecorder.ondataavailable = (event) => downloadData(event, streamableElement.id, mediaRecorder);
    mediaRecorder.onstop = (event) => downloadData(event, streamableElement.id, mediaRecorder);

    const oneMinute = 60000;
    const fiveMinutes = oneMinute * 5;
    mediaRecorder.start(oneMinute);
    console.log('MediaRecorder started', mediaRecorder);

    setTimeout(() => {
        mediaRecorder.stop();
        console.log('Recording stopped.');
    }, fiveMinutes);
}

// Grab all <video> elements and create a MediaRecorder for each

const sampleVideo = document.querySelectorAll('#filmstripRemoteVideosContainer video')[0];
const sampleAudio = document.querySelectorAll('#filmstripRemoteVideosContainer audio')[0];
startRecording(sampleVideo);
startRecording(sampleAudio);

// [...document.querySelectorAll('#filmstripRemoteVideosContainer video')]
//     .forEach(video => {
//         const mediaRecorder = new MediaRecorder(video, {mimeType: 'video/webm'});
// });

// [...document.querySelectorAll('#filmstripRemoteVideosContainer audio')]
//     .forEach(audio => {});
//
//
