/**
 * Module to listen to events on sock2.socket to update
 * the workspaces.
 */

// TODO: Handle urgent state. "urgent" state is outputed on sock2. Idea, when captured set property (value)
//       and check the argument against all windows. This must be an array of all warkspaces marked as active
//       which get cleared when the workspace is visited.
//       so, something like: [ {ws_id: 1, whandle: "054424242424"}] which marks workspace 1 has an active
//       window. When ws 1 is visited, this entry will be removed (maybe instead of an array, make it a dictionary)

import { Gio, GLib, GObject } from './gtk.js'

const debounce = (func, delay) => {
    let inDebounce
    return function () {
        const context = this
        const args = arguments
        clearTimeout(inDebounce)
        inDebounce = setTimeout(() => func.apply(context, args), delay)
    }
}

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

export const HyprlandMonitor = GObject.registerClass(
    {
        Signals: { sync: {} },
    },
    class HyprlandMonitor extends GObject.Object {
        constructor() {
            super()

            this._activeWindow = this._getActiveWindow()
            this._monitors = this._getMonitors()
            this._workspaces = this._getWorkspaces()

            this._activeWorkspace = this._activeWindow.workspace.id
            print(`active ws: ${this._activeWorkspace}`)

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
            if (!(input instanceof Gio.DataInputStream)) {
                input = Gio.DataInputStream.new(input)
            }

            this._debouncedSync = debounce((arg) => {
                print(arg)
                this._sync()
            }, 100)

            this._readLoop(input)
        }

        get json() {
            const result = {
                monitors: this._monitors.sort((lhs, rhs) => lhs.id > rhs.id),
                activeWindow: this._activeWindow,
            }
            for (const monitor of result.monitors) {
                monitor.workspaces = this._workspaces
                    .filter((ws) => ws.monitor === monitor.name)
                    .map((ws) => ({
                        id: ws.id,
                        name: ws.name,
                        windows: ws.windows,
                    }))
                    .sort((lhs, rhs) => lhs.id > rhs.id)
            }

            print(`result: ${JSON.stringify(result)}`)

            return result

            return {
                active: this._activeWorkspace,
                activeWindow: this._activeWindow,
                monitors: this._monitors,
                workspaces: this._workspaces,
            }

            /**
             * {
             *  monitors: {
             *      name: string
             *      id: number
             *      description: string
             *      model: string
             *      activeWorkspace: {
             *          id: number
             *          name: string
             *      }
             *      workspaces: [{
             *          id: number
             *          name: string
             *          windows: number
             *      }
             *      ]
             *      focused: boolean
             *  },
             *  activeWindow: string
             * }
             *
             *
             */
        }

        async _readLoop(stream) {
            try {
                let line = null

                while ((line = await readLineAsync(stream)) !== null) {
                    const regex = /^([a-z0-9]+)>>(.+)/
                    const [_, token, argument] = line.match(regex)

                    log(`trying to handle ${token}: ${argument}`)
                    switch (token) {
                        case 'workspace':
                            this._activeWorkspace = argument
                            break
                        case 'activewindow':
                            this._activeWindow = this._getActiveWindow()
                            break
                        case 'focusedmon':
                            this._monitors = this._getMonitors()
                            break

                        case 'openlayer':
                        case 'closelayer':

                        case 'activewindowv2':
                        case 'openwindow':
                        case 'closewindow':
                        case 'movewindow':

                        case 'createworkspace':
                        case 'destroyworkspace':
                            // this._workspaces = this._getWorkspaces()
                            continue

                        default:
                            print(`unhandled: ${token}, arg: ${argument}`)
                            continue
                    }

                    this._debouncedSync(`sync: ${token}`)
                }

                // End of stream reached, no error
            } catch (e) {
                logError(e)
            }
        }

        _sync() {
            this.emit('sync')
        }

        _getMonitors() {
            let [success, out, err, _2] =
                GLib.spawn_command_line_sync(`hyprctl -j monitors`)

            if (success) {
                const utf8decoder = new TextDecoder()
                const json = JSON.parse(utf8decoder.decode(out))

                return json
                    .map((m) => ({
                        description: m.description,
                        id: m.id,
                        name: m.name,
                        make: m.make,
                        model: m.model,
                        activeWorkspace: {
                            id: m.activeWorkspace.id,
                            name: m.activeWorkspace.name,
                        },
                        focused: m.focused,
                    }))
                    .sort((lhs, rhs) => lhs.id > rhs.id)
            }

            log(err)
            return
        }

        _getWorkspaces() {
            let [success, out, err, _2] = GLib.spawn_command_line_sync(
                `hyprctl -j workspaces`
            )

            if (success) {
                const utf8decoder = new TextDecoder()
                const json = JSON.parse(utf8decoder.decode(out))

                return json
                    .map((ws) => ({
                        id: ws.id,
                        monitor: ws.monitor,
                        name: ws.name,
                        windows: ws.windows,
                    }))
                    .sort((lhs, rhs) => lhs.id > rhs.id)
            }

            log(err)
            return []
        }

        _getActiveWindow() {
            let [success, out, err, _2] = GLib.spawn_command_line_sync(
                `hyprctl -j activewindow`
            )

            if (success) {
                const utf8decoder = new TextDecoder()
                const activeWindow = JSON.parse(utf8decoder.decode(out))
                return {
                    title: activeWindow.title,
                    workspace: { id: activeWindow.workspace.id },
                }
            }

            log(err)
            return ''
        }
    }
)
