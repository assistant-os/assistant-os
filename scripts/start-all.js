import dotenv from 'dotenv'
import Os from '@assistant-os/os'

dotenv.config()

const os = new Os()

process.on('SIGINT', () => {
  os.stop()
  // eslint-disable-next-line no-process-exit
  process.exit(0)
})

os.start()
