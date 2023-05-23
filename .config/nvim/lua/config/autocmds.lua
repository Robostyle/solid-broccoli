-- Autocmds are automatically loaded on the VeryLazy event
-- Default autocmds that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/autocmds.lua
--

vim.api.nvim_create_autocmd("FileType", {
  pattern = {
    "c",
    "cpp",
    "h",
    "hpp",
  },
  callback = function()
    vim.keymap.set("n", "<A-o>", "<cmd>ClangdSwitchSourceHeader<cr>", { buffer = true, desc = "Switch source/header" })
  end,
})
