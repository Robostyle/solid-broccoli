import { Battery, EnableFakeBattery } from './models/battery.js'
import { Gio, GObject } from './gtk.js'

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

/**!brief Battery monitor.
 *
 * Monitors the DBus UPower for changes in battery state.
 */
export const BatteryMonitor = GObject.registerClass(
    {
        Signals: { sync: {} },
    },
    class BatteryMonitor extends GObject.Object {
        constructor() {
            super()

            this._battery = new Battery()

            if (EnableFakeBattery) {
                setInterval(() => this._sync(), 5000)
            } else {
                this._proxy = new PowerManagerProxy(
                    Gio.DBus.system,
                    'org.freedesktop.UPower',
                    '/org/freedesktop/UPower/devices/DisplayDevice'
                )

                this._proxy.connect('g-properties-changed', (...other) => {
                    print(other)
                    try {
                        this._battery = new Battery(this._proxy)
                        this._sync()
                    } catch (e) {
                        logError(e, 'Handling battery sync')
                    }
                })
            }
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

        _sync() {
            this.emit('sync')
        }
    }
)
