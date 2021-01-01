clock = document.getElementById('clock')
button = document.getElementById('control')
auto = document.getElementById('auto')

working = true
ding = new Audio('ding.mp3')
count = 0

button.onclick = function () {
  if (button.innerHTML == 'Start') {
    if (working)
      document.body.style.backgroundColor = '#4e0000'
    else
      document.body.style.backgroundColor = '#004e00'

    button.innerHTML = 'Stop'
    limit = parseInt(clock.innerHTML)

    let initMin, initSec;
    [initMin, initSec] = clock.innerHTML.split(':')
    seconds = 60 * parseInt(initMin) + parseInt(initSec)

    timer = setInterval(function () {
      seconds -= 1;
      min = Math.floor(seconds / 60)
      sec = seconds % 60
      timeLeft = `${min}:${String(sec).padStart(2, '0')}`

      clock.innerHTML = timeLeft
      document.title = `${timeLeft} | ${working ? `Work ${count+1}` : 'Break'}`

      if (seconds == 0) {
        document.body.style.backgroundColor = '#1d1d1d'
        ding.play()
        clearInterval(timer)
        button.innerHTML = 'Start'

        if (working) {
          working = false;
          count++;

          if (count % 4 == 0) {
            clock.innerHTML = `30:00`
          } else {
            clock.innerHTML = `5:00`
          }
        } else {
          working = true;
          clock.innerHTML = `25:00`
        }

        if (auto.checked)
          button.click()
      }
    }, 1000)
  } else {
    document.body.style.backgroundColor = '#1d1d1d'
    button.innerHTML = 'Start'
    clearInterval(timer)
  }
}