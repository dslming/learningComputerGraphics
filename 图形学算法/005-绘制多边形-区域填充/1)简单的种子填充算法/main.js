window.addEventListener('load', function () {
    const canvas = document.querySelector('canvas')
    const cc = canvas.getContext('2d');

    let img = new Image()
    img.src = "./123.png"
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        cc.drawImage(img, 0, 0);
        run()
    }

    const run = () => {
        const bitmap = cc.getImageData(0, 0, canvas.width, canvas.height)
        const filledImage = document.createElement('img')
        const floodFill = new FloodFill({
            bitmap,
            width: img.width,
            height: img.height
        });

        floodFill.boundaryFill4(150, 130, "ff3f00", "00ff00");
        cc.clearRect(0, 0, canvas.width, canvas.height);
        cc.putImageData(bitmap, 0, 0);

        filledImage.src = canvas.toDataURL();
        canvas.parentNode.insertBefore(filledImage, canvas);
        canvas.parentNode.removeChild(canvas);
    };


}, false);
