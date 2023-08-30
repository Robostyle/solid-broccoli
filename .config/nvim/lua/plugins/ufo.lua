-- See for more information
-- https://github.com/chrisgrieser/.config/blob/main/nvim/lua/config/folding.lua
-- https://www.reddit.com/r/neovim/comments/12yomtj/configuring_nvimufo_to_use_lsp_with_lazynvim/
--
-- TODO: not fully done, but kinda works
--

vim.o.foldcolumn = "1" -- '0' is not bad
vim.o.foldlevel = 99 -- Using ufo provider need a large value, feel free to decrease the value
vim.o.foldlevelstart = 99
vim.o.foldenable = true

local foldIcon = ""
local hlgroup = "NonText"
local function foldTextFormatter(virtText, lnum, endLnum, width, truncate)
  local newVirtText = {}
  local suffix = "  " .. foldIcon .. "  " .. tostring(endLnum - lnum)
  local sufWidth = vim.fn.strdisplaywidth(suffix)
  local targetWidth = width - sufWidth
  local curWidth = 0
  for _, chunk in ipairs(virtText) do
    local chunkText = chunk[1]
    local chunkWidth = vim.fn.strdisplaywidth(chunkText)
    if targetWidth > curWidth + chunkWidth then
      table.insert(newVirtText, chunk)
    else
      chunkText = truncate(chunkText, targetWidth - curWidth)
      local hlGroup = chunk[2]
      table.insert(newVirtText, { chunkText, hlGroup })
      chunkWidth = vim.fn.strdisplaywidth(chunkText)
      if curWidth + chunkWidth < targetWidth then
        suffix = suffix .. (" "):rep(targetWidth - curWidth - chunkWidth)
      end
      break
    end
    curWidth = curWidth + chunkWidth
  end
  table.insert(newVirtText, { suffix, hlgroup })
  return newVirtText
end

return {
  {
    "kevinhwang91/nvim-ufo",

    dependencies = "kevinhwang91/promise-async",

    event = "BufReadPost",

    opts = {
      provider_selector = function(_, ft, _)
        local lspWithOutFolding = { "markdown", "bash", "sh", "bash", "zsh", "css" }
        if vim.tbl_contains(lspWithOutFolding, ft) then
          return { "treesitter", "indent" }
        else
          return { "lsp", "indent" }
        end
      end,

      -- open opening the buffer, close these fold kinds
      -- use `:UfoInspect` to get available fold kinds from the LSP
      close_fold_kinds = { "comment", "imports" },
      open_fold_hl_timeout = 500,
      fold_virt_text_handler = foldTextFormatter,
    },
  },
}
