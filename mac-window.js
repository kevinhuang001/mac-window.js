(function() {
  const DOCK_OFFSET = 20;
  const DOCK_GAP = 10;

  function updateBadgePositions() {
    const badges = document.querySelectorAll('.mac-window-badge');
    badges.forEach((badge, index) => {
      const badgeWidth = badge.offsetWidth;
      badge.style.left = `${DOCK_OFFSET + (badgeWidth + DOCK_GAP) * index}px`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // --- Read Global Configuration ---
    const globalConfig = window.macWindowConfig || {};
    const globalOffsetX = globalConfig.fullscreenOffsetX || '0px';
    const globalOffsetY = globalConfig.fullscreenOffsetY || '0px';

    document.querySelectorAll('[mac-window]').forEach((win, index) => {
      const windowId = 'mac-window-' + (win.id || `${Date.now()}-${index}`);
      win.id = windowId;

      const config = {
        title: win.getAttribute('mac-window-title') || 'Window',
        width: win.getAttribute('mac-window-width'),
        height: win.getAttribute('mac-window-height'),
        top: win.getAttribute('mac-window-top'),
        left: win.getAttribute('mac-window-left'),
        initialState: win.getAttribute('mac-window-initial-state'), // Read initial state
      };
      
      const state = {
        isMaximized: false,
        translateX: 0,
        translateY: 0,
        preMaximizeState: {},
        preMaximizeBodyOverflow: '',
      };
      
      const originalContent = win.innerHTML;
      win.innerHTML = '';
      if (config.width) win.style.width = config.width;
      if (config.height) win.style.height = config.height;

      const titleBarHTML = `<div class="mac-window-title-bar"><div class="mac-window-controls"><div class="mac-window-control close"><svg viewBox="0 0 16 16"><path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/></svg></div><div class="mac-window-control minimize"><svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 7.75A.75.75 0 0 1 2.75 7h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 7.75z"/></svg></div><div class="mac-window-control maximize"><svg viewBox="0 0 16 16"><path fill="currentColor" d="M4.5 9.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5v6zM5 4h6v6H5V4z"/></svg></div></div><div class="mac-window-title">${config.title}</div></div>`;
      const contentHTML = `<div class="mac-window-content">${originalContent}</div>`;
      win.insertAdjacentHTML('beforeend', titleBarHTML + contentHTML);

      if (config.top && config.left) {
        win.style.top = config.top;
        win.style.left = config.left;
      } else {
        win.style.left = `calc(50% - ${win.offsetWidth / 2}px)`;
        win.style.top = `calc(50% - ${win.offsetHeight / 2}px)`;
      }

      const titleBar = win.querySelector('.mac-window-title-bar');
      const closeBtn = win.querySelector('.mac-window-control.close');
      const minimizeBtn = win.querySelector('.mac-window-control.minimize');
      const maximizeBtn = win.querySelector('.mac-window-control.maximize');

      // --- CLOSE BUTTON HANDLER ---
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (state.isMaximized) {
          document.body.style.overflow = state.preMaximizeBodyOverflow;
        }
        const badge = document.querySelector(`.mac-window-badge[data-controls-window="${windowId}"]`);
        if (badge) {
          badge.remove();
          updateBadgePositions();
        }
        win.remove();
      });

      // --- MINIMIZE BUTTON HANDLER ---
      minimizeBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (state.isMaximized) return;
        
        const badge = document.createElement('div');
        badge.className = 'mac-window-badge';
        badge.dataset.controlsWindow = windowId;
        badge.innerHTML = `<span class="mac-window-badge-icon"><svg viewBox="0 0 16 16"><path fill="currentColor" d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 12.5 2h-9z"/></svg></span><span class="mac-window-badge-title">${config.title}</span>`;
        
        badge.addEventListener('click', () => {
          win.style.visibility = 'visible';
          win.classList.remove('is-minimizing');
          badge.remove();
          updateBadgePositions();
        });

        document.body.appendChild(badge);
        updateBadgePositions();
        
        win.style.transformOrigin = 'bottom left';
        win.classList.add('is-minimizing');
        
        win.addEventListener('transitionend', () => {
          win.style.visibility = 'hidden';
        }, { once: true });
      });
      
      // --- MAXIMIZE BUTTON HANDLER ---
      maximizeBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (win.style.visibility === 'hidden') return;
        
        if (!state.isMaximized) {
          state.preMaximizeState = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height, transform: win.style.transform };
          
          state.preMaximizeBodyOverflow = document.body.style.overflow;
          document.body.style.overflow = 'hidden';

          win.style.setProperty('top', globalOffsetY, 'important');
          win.style.setProperty('left', globalOffsetX, 'important');
          win.style.setProperty('width', '100vw', 'important');
          win.style.setProperty('height', '100vh', 'important');
          win.style.setProperty('transform', 'translate(0, 0)', 'important');
          
          win.classList.add('maximized');
          state.isMaximized = true;

        } else {
          document.body.style.overflow = state.preMaximizeBodyOverflow;

          win.style.removeProperty('top');
          win.style.removeProperty('left');
          win.style.removeProperty('width');
          win.style.removeProperty('height');
          win.style.removeProperty('transform');
          
          Object.assign(win.style, state.preMaximizeState);
          
          win.classList.remove('maximized');
          state.isMaximized = false;
        }
      });

      // --- DRAGGING LOGIC ---
      let dragStartX, dragStartY;
      const onDragStart = e => {
        if (state.isMaximized) return;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        win.classList.add('is-dragging');
        document.addEventListener('mousemove', onDragging);
        document.addEventListener('mouseup', onDragEnd, { once: true });
      };

      const onDragging = e => {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        win.style.transform = `translate(${state.translateX + deltaX}px, ${state.translateY + deltaY}px)`;
      };
      
      const onDragEnd = e => {
        state.translateX += e.clientX - dragStartX;
        state.translateY += e.clientY - dragStartY;
        win.classList.remove('is-dragging');
        document.removeEventListener('mousemove', onDragging);
      };
      
      titleBar.addEventListener('mousedown', onDragStart);

      // --- Set Initial State ---
      if (config.initialState) {
        // Use a timeout to ensure the window is fully rendered before triggering actions
        setTimeout(() => {
          if (config.initialState === 'maximized') {
            maximizeBtn.click();
          } else if (config.initialState === 'minimized') {
            minimizeBtn.click();
          }
        }, 0);
      }
    });
  });
})();