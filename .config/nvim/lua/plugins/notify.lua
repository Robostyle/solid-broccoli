-- Fix to prevent a notification about:
--   Highlight group 'NotifyBackground' has no background highlight.
--

return {
  {
    "rcarriga/nvim-notify",
    opts = {
      background_colour = "#000000",
    },
  },
}
