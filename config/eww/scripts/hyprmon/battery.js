import { Gio, GObject, UPowerGlib } from './gtk.js'

const interfaceXML = `
<node>
    <interface name="org.freedesktop.UPower.Device">
        <property name="State" type="u" access="read"/>
        <property name="Percentage" type="d" access="read"/>
        <property name="IsPresent" type="b" access="read"/>
        <property name="TimeToEmpty" type="x" access="read"/>
        <property name="TimeToFull" type="x" access="read"/>
    </interface>
</node>
`

const PowerManagerProxy = Gio.DBusProxy.makeProxyWrapper(interfaceXML)

class Battery {
    constructor(model) {
        this._model = model || { IsPresent: false }
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
        const dicons = ['', '', '', '', '', '', '', '', '', '']
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

export const BatteryMonitor = GObject.registerClass(
    {
        Signals: { sync: {} },
    },
    class BatteryMonitor extends GObject.Object {
        constructor() {
            super()

            this._battery = new Battery()

            this._proxy = new PowerManagerProxy(
                Gio.DBus.system,
                'org.freedesktop.UPower',
                '/org/freedesktop/UPower/devices/DisplayDevice'
            )

            this._proxy.connect('g-properties-changed', () => {
                try {
                    this._sync(this._proxy)
                } catch (e) {
                    logError(e, 'Handling battery sync')
                }
            })
        }

        get json() {
            const { isPresent, timeLeft, icon, percentage, state } =
                this._battery
            if (!isPresent) {
                return { available: false }
            }

            return {
                available: isPresent,
                timeLeft,
                icon,
                percentage,
                state,
            }
        }

        _sync(proxy) {
            this._battery = new Battery(proxy)
            this.emit('sync')
        }
    }
)
