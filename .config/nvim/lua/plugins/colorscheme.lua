return {
  {
    "catppuccin/nvim",
    lazy = true,
    name = "catppuccin",

    opts = {
      transparent_background = true,
      flavour = "frappe",
    },
  },

  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "catppuccin",
    },
  },
}
