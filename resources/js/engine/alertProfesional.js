export const alertProfesional = {
  config: {
    allowOutsideClick: true,
    allowEscapeKey: true,
    showConfirmButton: true,
    colorConfirmButton: '', // Ditambahkan dari versi lama
    confirmButtonText: 'OK',
    onConfirm: null,
    showCancelButton: false,
    colorCancelButton: '', // Ditambahkan dari versi lama
    cancelButtonText: 'Cancel',
    onCancel: null,
    showDeniedButton: false,
    colorDeniedButton: '', // Ditambahkan dari versi lama
    deniedButtonText: 'Denied',
    onDenied: null,
    showCloseButton: false,
    input: null,
    width: '400px',
    padding: '20px',
    backdrop: true,
    timer: null,
  },

  fire: function(args) {
    if (typeof args === 'string' || args instanceof HTMLElement) {
      args = { html: args };
    } else if (arguments.length > 1) {
      args = {
        title: arguments[0],
        text: arguments[1],
        icon: arguments[2]
      };
    }

    const defaults = {
      input: null,
      inputAttributes: {},
      footer: '',
      animation: {
        show: 'bounceUp',
        hide: 'fadeOut'
      }
    };

    const options = { ...defaults, ...this.config, ...args };
    this._manualClose = !!options.manualClose;

    this.close(options.animation);

    const overlay = this._createOverlay(options);
    const alertBox = this._createAlertBox(options);
    this._buildMainContent(alertBox, options);
    const buttonsContainer = this._createButtonsContainer(options);
    alertBox.appendChild(buttonsContainer);
    this._buildFooterContent(alertBox, options);
    if (options.showCloseButton) {
      alertBox.appendChild(this._createCloseButton(options.animation));
    }

    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);

    if (options.timer) {
      setTimeout(() => this.close(options.animation), options.timer);
    }

    return new Promise((resolve) => {
      this._currentResolve = resolve;
    });
  },

  close: function(animation = { show: 'bounceUp', hide: 'fadeOut' }) {
    const overlay = document.querySelector('.alert-profesional');
    if (overlay) {
      const alertBox = overlay.querySelector('.alert-box');
      alertBox.classList.remove(`alert-show-${animation.show}`);
      alertBox.classList.add(`alert-hide-${animation.hide}`);

      setTimeout(() => {
        overlay.remove();
        if (this._currentResolve) {
          this._currentResolve({
            isConfirmed: false,
            isDenied: false,
            isDismissed: true
          });
        }
      }, 200);
    }
  },

  _createOverlay: function(options) {
    const overlay = document.createElement('div');
    overlay.className = 'alert-profesional';
    overlay.style.zIndex = 9999;
    overlay.style.backgroundColor = options.backdrop ? 'rgba(0,0,0,0.4)' : 'transparent';

    if (options.allowOutsideClick) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close(options.animation);
      });
    }

    if (options.allowEscapeKey) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close(options.animation);
      }, { once: true });
    }

    return overlay;
  },

  _createAlertBox: function(options) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.style.width = options.width;
    alertBox.style.padding = options.padding;

    if (options.animation?.show) {
      alertBox.classList.add(`alert-show-${options.animation.show}`);
    }

    return alertBox;
  },

  _buildMainContent: function(alertBox, options) {
    if (options.icon) {
      alertBox.appendChild(this._createIcon(options.icon));
    }

    if (options.title) {
      const title = document.createElement('h2');
      title.textContent = options.title;
      alertBox.appendChild(title);
    }

    if (options.text) {
      const text = document.createElement('p');
      text.textContent = options.text;
      alertBox.appendChild(text);
    } else if (options.html) {
      const content = document.createElement('div');
      content.innerHTML = options.html;
      alertBox.appendChild(content);
    }

    if (options.input) {
      const input = document.createElement('input');
      input.type = options.input;
      Object.entries(options.inputAttributes || {}).forEach(([attr, value]) => {
        input.setAttribute(attr, value);
      });
      alertBox.appendChild(input);
    }
  },

  _buildFooterContent: function(alertBox, options) {
    if (options.footer) {
      const footer = document.createElement('div');
      footer.className = 'alert-footer';
      if (typeof options.footer === 'string') {
        footer.innerHTML = options.footer;
      } else if (options.footer instanceof HTMLElement) {
        footer.appendChild(options.footer);
      }
      alertBox.appendChild(footer);
    }
  },

  _createButtonsContainer: function(options) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'alert-buttons';

    if (options.showConfirmButton) {
      buttonsContainer.appendChild(this._createConfirmButton(options));
    }

    if (options.showDeniedButton) {
      buttonsContainer.appendChild(this._createDeniedButton(options));
    }

    if (options.showCancelButton) {
      buttonsContainer.appendChild(this._createCancelButton(options));
    }

    return buttonsContainer;
  },

  // Ditambahkan dari versi lama
  _createConfirmButton: function(options) {
    const btn = this._createButton(
      options.confirmButtonText,
      'confirm',
      () => {
        if (typeof options.onConfirm === 'function') options.onConfirm();
        if (!this._manualClose) this.close(options.animation);
      }
    );
    
    if (options.colorConfirmButton) {
      btn.style.backgroundColor = options.colorConfirmButton;
      btn.style.borderColor = options.colorConfirmButton;
      btn.style.color = this._getContrastColor(options.colorConfirmButton);
    } else {
      btn.classList.add('btn-primary-profesional');
    }

    return btn;
  },

  // Ditambahkan dari versi lama
  _createCancelButton: function(options) {
    const btn = this._createButton(
      options.cancelButtonText,
      'cancel',
      () => {
        if (typeof options.onCancel === 'function') options.onCancel();
        if (!this._manualClose) this.close(options.animation);
      }
    );

    if (options.colorCancelButton) {
      btn.style.backgroundColor = options.colorCancelButton;
      btn.style.borderColor = options.colorCancelButton;
      btn.style.color = this._getContrastColor(options.colorCancelButton);
    } else {
      btn.classList.add('btn-cancel-profesional');
    }

    return btn;
  },

  // Ditambahkan dari versi lama
  _createDeniedButton: function(options) {
    const btn = this._createButton(
      options.deniedButtonText,
      'denied',
      () => {
        if (typeof options.onDenied === 'function') options.onDenied();
        if (!this._manualClose) this.close(options.animation);
      }
    );

    if (options.colorDeniedButton) {
      btn.style.backgroundColor = options.colorDeniedButton;
      btn.style.borderColor = options.colorDeniedButton;
      btn.style.color = this._getContrastColor(options.colorDeniedButton);
    } else {
      btn.classList.add('btn-denied-profesional');
    }

    return btn;
  },

  // Ditambahkan dari versi lama
  _getContrastColor: function(hexColor) {
    if (!hexColor) return '#ffffff'; // Default jika tidak ada warna
    
    // Handle short hex and full hex
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substr(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substr(2, 2), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substr(4, 2), 16);
    
    // Hitung luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  },

  _createButton: function(text, type, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn btn-${type}`;
    button.textContent = text;
    
    button.addEventListener('click', (e) => {
      onClick();
        button.disabled = true
       // ⛔ hanya tahan auto-close jika tombolnya "confirm" DAN manualClose aktif
      const isConfirmAndManual = this._manualClose && type === 'confirm';
      if (!isConfirmAndManual) {
        this.close(this.config.animation);
      }
      
      if (this._currentResolve) {
        this._currentResolve({ 
          isConfirmed: type === 'confirm', 
          isDenied: type === 'denied', 
          isDismissed: type === 'cancel' 
        });
        this._currentResolve = null;
      }
    });
    
    return button;
  },

  _createCloseButton: function(animation) {
    const closeButton = document.createElement('div');
    closeButton.className = 'action-buttons-top';
    closeButton.innerHTML = '<button class="btn"><i class="fas fa-close"></i></button>';
    closeButton.addEventListener('click', () => this.close(animation));
    return closeButton;
  },

  _createIcon: function(iconType) {
    const icon = document.createElement('div');
    icon.className = 'alert-icon';

    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-times-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
      question: 'fas fa-question-circle'
    };

    const iconClass = icons[iconType];
    if (iconClass) {
      const i = document.createElement('i');
      i.className = iconClass;
      icon.appendChild(i);
    }

    return icon;
  }
};