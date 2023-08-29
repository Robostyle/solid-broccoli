return {
  "neovim/nvim-lspconfig",
  dependencies = {
    {
      "SmiteshP/nvim-navbuddy",
      dependencies = {
        "SmiteshP/nvim-navic",
        "MunifTanjim/nui.nvim",
        "numToStr/Comment.nvim",
        "nvim-telescope/telescope.nvim",
      },
      opts = { lsp = { auto_attach = true }, window = {
        size = "95%",
      } },
    },
  },

  keys = {
    { "<leader>n", ":Navbuddy<cr>", desc = "Nav Buddy" },
  },
}
