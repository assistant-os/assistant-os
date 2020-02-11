import dotenv from 'dotenv'
import Os from '@assistant-os/os'
// import Slack from '@assistant-os/slack'
import Http from '@assistant-os/http'
import Hello from '@assistant-os/hello'
import Oups from '@assistant-os/oups'
// import Emails from '@assistant-os/emails'
// import Contracts from '@assistant-os/contracts'
// import Movies from '@assistant-os/movies'
import Memory from '@assistant-os/memory'
import consciousness from '@assistant-os/consciousness'
import admin from '@assistant-os/admin'

// import Timelog from '@assistant-os/timelog'

dotenv.config()

const os = new Os()

os.addAction(Hello)
os.addAction(Oups)
// os.addAction(Emails)
// os.addAction(Contracts)
// os.addAction(Movies)
os.addAction(Memory)
os.addAction(consciousness)
os.addAction(admin)
// os.addAction(Timelog)

os.adapters = [new Http()]

process.on('SIGINT', () => {
  os.stop()
  // eslint-disable-next-line no-process-exit
  process.exit(0)
})

os.start()
