const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

let freqs;

navigator.mediaDevices.enumerateDevices().then(devices => {
    devices.forEach((d, i) => console.log(d.label, i));
    navigator.mediaDevices
        .getUserMedia({
            audio: {
                deviceId: devices[0].deviceId
            }
        })
        .then(stream => {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = context.createAnalyser();
            const source = context.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.connect(context.destination);

            freqs = new Uint8Array(analyser.frequencyBinCount);

            function draw() {
                let radius = 175;
                let bars = 200;

                // Draw Background
                // https://www.w3schools.com/tags/ref_colornames.asp
                ctx.fillStyle = "SlateGray"; // DarkTurquoise Aquamarine DeepPink Orchid Turquoise SlateGray
                ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

                //ctx.fillStyle = 'hsla(220,50%,50%,1)';
                //ctx.fillRect(0, 0,  myCanvas.width, myCanvas.height); // fill offscreen canvas background

                /*

                // https://codepen.io/plavookac/pen/QMwObb
                // https://codepen.io/shshaw/pen/DxJka
                // https://codepen.io/jackrugile/pen/qLCuE
                // https://codepen.io/deathfang/pen/WxNVoq
                // https://codepen.io/loktar00/pen/uEJKl
                // https://codepen.io/nosurprisethere/pen/yoEmQE

                // http://www.coding-dude.com/wp/javascript/drawing-simple-line-patterns-using-html5-canvas/
                // https://codepen.io/whqet/pen/EHtre
                // https://codepen.io/asaaki/pen/LwkuH
                // https://gist.github.com/whitewhim/9559988
                // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash

                ctx.beginPath();
                var color1 = "#24A8AC",color2="#0087CB";
                var numberOfStripes = 30;
                for (var i=0;i < numberOfStripes;i++){
                    var thickness = 300 / numberOfStripes;
                    drawingContext.beginPath();
                    drawingContext.strokeStyle = i % 2?color1:color2;
                    drawingContext.lineWidth =thickness;
                    drawingContext.lineCap = 'round';                    
                    drawingContext.moveTo(i*thickness + thickness/2 - 300,0);
                    drawingContext.lineTo(0 + i*thickness+thickness/2,300);
                    drawingContext.stroke(); 
                }       
                ctx.stroke();*/


                // Dashed line
                ctx.beginPath();
                ctx.setLineDash([5, 15]);
                ctx.moveTo(0, 50);
                ctx.lineTo(1280, 50);
                ctx.stroke();

                // Solid line
                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.moveTo(0, 80);
                ctx.lineTo(1280, 80);
                ctx.stroke();

                // Draw Circle
                ctx.beginPath();
                ctx.arc(
                    myCanvas.width / 2,
                    myCanvas.height / 2,
                    radius,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
                analyser.getByteFrequencyData(freqs);

                // Draw label
                ctx.font = "500 36px Ubuntu";
                const avg =
                    [...Array(255).keys()].reduce((acc, curr) => acc + freqs[curr], 0) /
                    255;
                ctx.fillStyle = "rgb(" + 210 + ", " + (180 - avg) + ", " + avg + ")";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText("MPXVM", myCanvas.width / 2, myCanvas.height / 2 - 24);
                ctx.fillText("FUMIX", myCanvas.width / 2, myCanvas.height / 2 + 6);

                // Draw bars
                for (let i = 0; i < bars; i++) {
                    let radians = (Math.PI * 2) / bars;
                    let bar_height = freqs[i] * 0.5;

                    let x = myCanvas.width / 2 + Math.cos(radians * i) * radius;
                    let y = myCanvas.height / 2 + Math.sin(radians * i) * radius;
                    let x_end =
                        myCanvas.width / 2 + Math.cos(radians * i) * (radius + bar_height);
                    let y_end =
                        myCanvas.height / 2 + Math.sin(radians * i) * (radius + bar_height);
                    ctx.strokeStyle = "rgb(" + 220 + ", " + (180 - freqs[i]) + ", " + freqs[i] + ")";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x_end, y_end);
                    ctx.stroke();

                }
                requestAnimationFrame(draw);
            }

            requestAnimationFrame(draw);
        });
});
