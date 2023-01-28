let intervalID;

function timer() {
  postMessage('tick');
}

onmessage = (e) => {
  if (e.data == 'play') {
    intervalID = setInterval(timer, 1000);
  } else {
    clearInterval(intervalID);
  }
}