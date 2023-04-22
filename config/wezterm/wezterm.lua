local wezterm = require("wezterm")

local function font_with_fallback(name, params)
	local names = { name, "Apple Color Emoji", "azuki_font" }
	return wezterm.font_with_fallback(names, params)
end

local font_name = "JetBrainsMono Nerd Font"

return {
  -- OpenGL for GPU acceleration, Software for CPU
  front_end = "OpenGL",

  color_scheme = "tokyonight",

  font = font_with_fallback(font_name),
  font_rules = {
    {
      italic = true,
      font = font_with_fallback(font_name, { italic = true }),
    },
    {
      italic = false,
      font = font_with_fallback(font_name, { bold = true }),
    },
    {
      intensity = "Bold",
      font = font_with_fallback(font_name, { bold = true }),
    },
  },

  warn_about_missing_glyphs = false,
  font_size = 10,
  -- line_height = 1.0,
  -- dpi = 96.0,

  -- Cursor style
  -- default_cursor_style = "BlinkingUnderline",

  -- X11
  enable_wayland = true,

  -- Tab Bar
	enable_tab_bar = true,
	hide_tab_bar_if_only_one_tab = true,

  -- General
  automatically_reload_config = true,
  selection_word_boundary = " \t\n{[}]()\"'/:",
  window_background_opacity = 0.85,
}

