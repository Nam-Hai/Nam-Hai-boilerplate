const isMobile = window.matchMedia('(pointer: coarse)').matches
history.pushState(isMobile, '', '?d=' + isMobile)