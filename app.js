const recordBtn = document.querySelector(".btn-record");
const result = document.querySelector(".result");
const clearBtn = document.querySelector("#btn-clear");
const downloadBtn = document.querySelector("#btn-download");
const inputLanguages = document.querySelector("#language");


let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
    recognition,
    recording = false;

function listLanguages() {
    languages.forEach((lang) => {
        const option = document.createElement("option");
        option.style.fontWeight = 600;
        option.value = lang.code;
        option.innerHTML = lang.name;
        inputLanguages.appendChild(option);
    })
}
listLanguages();


function speechToText() {
    try {
        recognition = new SpeechRecognition();
        recognition.lang = inputLanguages.value;
        recognition.interimResults = true;
        recordBtn.classList.add("recording");
        recordBtn.querySelector("p").innerHTML = "Listening...";
        recognition.start();
        
        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            //detect when intrim results
            if(event.results[0].isFinal){
                result.innerHTML += speechResult;
                
                 
            } else{
                if (!document.querySelector(".interim")) {
                    const interim = document.createElement("p");
                    interim.classList.remove("interim");
                    
                    result.appendChild(interim);
                    
                  }
                //update
                document.querySelector(".result").innerHTML += " ";
            }

            downloadBtn.disabled = false;
        };
        recognition.onspeechend = () => {
            speechToText();
            
        };
        recognition.onerror = (event) => {
            stopRecording();
            if (event.error === "no-speech") {
                alert("no speech was detected.");
            } else if (event.error == "audio-capture") {
                alert("No microphone was found.");
            } else if (event.error === "not-allowed") {
                alert("microphone permission allow denied.");
            } else if (event.error === "aborted") {
                alert("listening stopped.");
            } else {
                alert("Error recognition occured: " + event.error);
            }
        };

    } catch (error) {
        recording = false;
        console.log(error);

    }
}
recordBtn.addEventListener("click", () => {
    if (!recording) {
      speechToText();
      recording = true;
    } else {
      stopRecording();
    }
});

function stopRecording() {
    recognition.stop();
    recordBtn.querySelector("p").innerHTML = "start listening";
    recordBtn.classList.remove("recording");
    recording = false;
}


function download() {
    const text = result.innerText;
    const filename = "speech.txt";

    const element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

downloadBtn.addEventListener("click", download);

clearBtn.addEventListener("click", () => {
    result.innerHTML = "";
    downloadBtn.disabled = true;
});