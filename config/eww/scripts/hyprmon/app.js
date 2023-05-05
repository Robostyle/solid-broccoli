import { BatteryMonitor } from './battery.js'
import { GLib, Gtk, Gio, GObject } from './gtk.js'

function readLineAsync(stream, cancellable = null) {
    return new Promise((resolve, reject) => {
        stream.read_line_async(
            GLib.PRIORITY_DEFAULT,
            cancellable,
            (_stream, res) => {
                try {
                    resolve(_stream.read_line_finish_utf8(res)[0])
                } catch (e) {
                    reject(e)
                }
            }
        )
    })
}

async function readLoop(stream) {
    try {
        let line = null

        while ((line = await readLineAsync(stream)) !== null) print(line)

        // End of stream reached, no error
    } catch (e) {
        logError(e)
    }
}

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

            const hypr_instance = GLib.getenv('HYPRLAND_INSTANCE_SIGNATURE')
            const client = new Gio.SocketClient()
            const connection = client.connect(
                new Gio.UnixSocketAddress({
                    path: `/tmp/hypr/${hypr_instance}/.socket2.sock`,
                }),
                null
            )
            if (!connection) {
                throw 'Connection failed'
            }

            let input = connection.get_input_stream()
            if (!(input instanceof Gio.DataInputStream))
                input = Gio.DataInputStream.new(input)

            readLoop(input)
        }

        _output(json, name) {
            print(`eww update ${name}='${JSON.stringify(json)}'`)
            let [success, _1, err, _2] = GLib.spawn_command_line_sync(
                `eww update ${name}='${JSON.stringify(json)}'`
            )
            if (!success) log(err)
        }
    }
)
