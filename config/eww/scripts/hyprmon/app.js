import { BatteryMonitor } from './battery.js'
import { HyprlandMonitor } from './hyprland.js'
import { GLib, Gtk, Gio, GObject } from './gtk.js'

export const App = GObject.registerClass(
    class App extends Gtk.Application {
        constructor({ backend }) {
            super({
                application_id: 'com.github.robostyle.hyprmon',
                flags: Gio.ApplicationFlags.DEFAULT_FLAGS,
            })

            this._backend = backend

            // Monitors
            this._monitors = {
                workspaces: new HyprlandMonitor(),
                battery: new BatteryMonitor(),
            }

            this.run(null)
        }

        vfunc_activate() {
            this.hold()

            for (const [name, monitor] of Object.entries(this._monitors)) {
                print(`key: ${name}`)

                this._output(monitor.json, name)
                monitor.connect('sync', (o) => this._output(o.json, name))
            }
        }

        _output(json, name) {
            let [success, _1, err, _2] = GLib.spawn_command_line_sync(
                `eww update ${name}='${JSON.stringify(json)}'`
            )
            if (!success) log(err)
        }
    }
)
