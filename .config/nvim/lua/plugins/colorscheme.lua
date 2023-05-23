return {
  {
    "catppuccin/nvim",
    lazy = true,
    name = "catppuccin",

    opts = {
      flavour = "mocha",
      transparent_background = true,
    },
  },

  {
    "lazyVim/lazyVim",
    opts = {
      colorscheme = "catppuccin",
    },
  },
}

-- return {
--   {
--     "folke/tokyonight.nvim",
--     opts = {
--       transparent = true,
--       styles = {
--         sidebars = "transparent",
--         floats = "dark",
--       },
--       dim_inactive = true,
--     },
--   },
-- }
