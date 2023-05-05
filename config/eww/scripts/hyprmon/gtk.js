imports.gi.versions.Gtk = '3.0'
imports.gi.versions.Gio = '2.0'
imports.gi.versions.GLib = '2.0'
imports.gi.versions.GObject = '2.0'
imports.gi.versions.UPowerGlib = '1.0'

imports.package.init({
    name: 'hyprmon',
    version: '0.1.0',
    prefix: '/usr/local',
    libdir: '/usr/local/lib64',
})

pkg.require({
    Gtk: '3.0',
    Gio: '2.0',
})

export const { Gtk, Gio, GLib, GObject, UPowerGlib } = imports.gi
