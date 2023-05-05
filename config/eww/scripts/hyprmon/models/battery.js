import { UPowerGlib } from '../gtk.js'

export const EnableFakeBattery = true

/**!brief Encapsulates battery info
 *
 * constructor - model is a Gtk UPower device proxy.
 */
export class Battery {
    constructor(model) {
        if (EnableFakeBattery) {
            this._model = {
                IsPresent: true,
                State: UPowerGlib.DeviceState.DISCHARGING,
                Percentage: 5,
                TimeToFull: 1788,
            }
        } else {
            this._model = model || { IsPresent: false }
        }
    }

    get isPresent() {
        return this._model.IsPresent
    }

    get isCharging() {
        return this._model.State === UPowerGlib.DeviceState.CHARGING
    }

    get isCharged() {
        return (
            this._model.State === UPowerGlib.DeviceState.FULLY_CHARGED ||
            (this.isCharging && this.percentage >= 100)
        )
    }

    get percentage() {
        return this._model.Percentage
    }

    get timeLeft() {
        if (this.isCharging)
            return this._separateTimeLeft(this._model.TimeToFull)
        return this._separateTimeLeft(this._model.TimeToEmpty)
    }

    get state() {
        if (this.isCharged) return 'charged'
        else if (this.isCharging) return 'charging'
        else if (this.percentage < 30) return 'low'
        return 'discharging'
    }

    get icon() {
        const dicons = ['󰁺', '󰁻', '󰁼', '󰁽', '󰁾', '󰁿', '󰂀', '󰂁', '󰂂', '󰁹']
        const cicons = ['󰢜', '󰂆', '󰂇', '󰂈', '󰢝', '󰂉', '󰢞', '󰂊', '󰂋', '󰂅']
        const max_index = dicons.length

        const index = Math.round(this.percentage / max_index) - 1
        if (index < 0) index = 0
        else if (index > 9) index = 9

        if (this.isCharged) return '󰂄'
        else if (this.isCharging) return cicons[index]
        else if (this.percentage < 10) return '󱃍'

        return dicons[index]
    }

    _separateTimeLeft(time) {
        const totalMinutes = Math.floor(time / 60)

        const seconds = time % 60
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        return { hours, minutes, seconds }
    }
}
