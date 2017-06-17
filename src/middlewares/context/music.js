import Middleware from '../../os/middleware'

let music = new Middleware('music')

music.startMusic = (user, speed = 'fast') => {
  const homeSpark = music.getNexus().getNode('home-spark')
  if (homeSpark && homeSpark.isConnected()) {
    homeSpark.send('start-music', {
      speed: speed
    })
    music.speak(user, `ok`)
  } else {
    music.speak(user, `Sorry but the ${homeSpark.real_name} is disconnected.`)
  }
}

music.stopMusic = (user, speed = 'none') => {
  const homeSpark = music.getNexus().getNode('home-spark')
  if (homeSpark && homeSpark.isConnected()) {
    homeSpark.send('stop-music', {
      speed: speed
    })
    music.speak(user, `ok`)
  } else {
    music.speak(user, `Sorry but the ${homeSpark.real_name} is disconnected.`)
  }
}

music.volumeUp = (user) => {
  const homeSpark = music.getNexus().getNode('home-spark')
  if (homeSpark && homeSpark.isConnected()) {
    homeSpark.send('volume-up')
    music.speak(user, `ok`)
  } else {
    music.speak(user, `Sorry but the ${homeSpark.real_name} is disconnected.`)
  }
}

music.volumeDown = (user) => {
  const homeSpark = music.getNexus().getNode('home-spark')
  if (homeSpark && homeSpark.isConnected()) {
    homeSpark.send('volume-down')
    music.speak(user, `ok`)
  } else {
    music.speak(user, `Sorry but the ${homeSpark.real_name} is disconnected.`)
  }
}

music.hear('start music', (req, res) => {
  music.startMusic(req.user)
})

music.hear('stop music', (req, res) => {
  music.stopMusic(req.user)

})

music.hear('volume up', (req, res) => {
  music.volumeUp(req.user)
})

music.hear('volume down', (req, res) => {
  music.volumeDown(req.user)
})


export default music
