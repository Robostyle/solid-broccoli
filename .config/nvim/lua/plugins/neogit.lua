return {
  "NeogitOrg/neogit",

  dependencies = {
    "nvim-lua/plenary.nvim", -- required
    "nvim-telescope/telescope.nvim", -- optional
    "sindrets/diffview.nvim", -- optional
    "ibhagwan/fzf-lua", -- optional
  },

  config = true,

  opts = {
    disable_line_numbers = false,
    graph_style = "unicode",
    status = {
      recent_commit_count = 40,
    },
  },

  keys = {
    { "<leader>gn", [[<Cmd>lua require"neogit".open({ kind = "auto", cwd = "%:p:h" })<CR>]], desc = "Neogit" },
  },
}
