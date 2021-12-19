let recorder, audio_stream;
const recordButton = document.getElementById("recordButton");
recordButton.addEventListener("click", startRecording);

const stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", stopRecording);
stopButton.disabled = true;

const preview = document.getElementById("audio-playback");

const downloadAudio = document.getElementById("downloadButton");
downloadAudio.addEventListener("click", downloadRecording);

function startRecording() {
    recordButton.disabled = true;
    recordButton.innerText = "Recording..."
    $("#recordButton").addClass("button-animate");

    $("#stopButton").removeClass("inactive");
    stopButton.disabled = false;


    if (!$("#audio-playback").hasClass("hidden")) {
        $("#audio-playback").addClass("hidden")
    };

    if (!$("#downloadContainer").hasClass("hidden")) {
        $("#downloadContainer").addClass("hidden")
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            audio_stream = stream;
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = function (e) {
                const url = URL.createObjectURL(e.data);
                preview.src = url;
                downloadAudio.href = url;
            };
            recorder.start();

            timeout_status = setTimeout(function () {
                console.log("5 min timeout");
                stopRecording();
            }, 300000);
        });
}

function stopRecording() {
    recorder.stop();
    audio_stream.getAudioTracks()[0].stop();
    recordButton.disabled = false;
    recordButton.innerText = "Redo Recording"
    $("#recordButton").removeClass("button-animate");

    $("#stopButton").addClass("inactive");
    stopButton.disabled = true;

    $("#audio-playback").removeClass("hidden");

    $("#downloadContainer").removeClass("hidden");
}

function downloadRecording() {
    var name = new Date();
    var res = name.toISOString().slice(0, 10)
    downloadAudio.download = res + '.wav';
}