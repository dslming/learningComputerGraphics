onmessage = (params) => {
  hello(params.data)
}


function hello(img2Data) {
  for (let i = 0; i < img2Data.data.length; i += 4) {
    let avg = 200
    img2Data.data[i] = avg; // red
    img2Data.data[i + 1] = avg; // green
    img2Data.data[i + 2] = avg; // blue
    img2Data.data[i + 3] = 255; //alpha
  }
  postMessage(img2Data);
}
