import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'bottom' },
})

export function notifySuccess(message: string) {
  notyf.success(message)
}

export function notifyError(message: string) {
  notyf.error(message)
}
