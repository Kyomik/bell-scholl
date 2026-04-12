const toastThemes = {
    glass: {
        className: 'toast-glass',
        content: (data) => `
            <i class="${data.icon} icon"></i>
            <div class="content">
                <div class="title">${data.title}</div>
                <span>${data.text}</span>
            </div>
            <button class="close-btn">&times;</button>

            `,
    },
    minimalist: {
        className: 'toast-minimalist',
        content: (data) => `
            <div class="toast-content">
                <i class="${data.icon}"></i>
                <div class="text-content">
                    <span class="toast-title">${data.title}</span>
                    <p class="toast-message">${data.text}</p>
                </div>
                <button class="close-btn">&times;</button>
            </div>
        `
    },

    material: {
        className: 'toast-material',
        content: (data) => `
                <div class="material-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="material-content">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <div class="material-actions">
                    <button class="close-btn">DISMISS</button>
                </div>
        `
    },
    gradient: {
        className: 'toast-gradient',
        content: (data) => `
                <div class="icon-wrapper">
                    <i class="${data.icon}"></i>
                </div>
                <div class="text-wrapper">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <button class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
        `
    },

    dark: {
        className: 'toast-dark',
        content: (data) => `
                <div class="dark-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="dark-text">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <div class="dark-progress"></div>
                <button class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
        `
    },
    glassLight: {
        className: 'toast-glasslight',
        content: (data) => `
                <div class="glass-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="glass-text">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <div class="glass-progress"></div>
                <button class="glass-close close-btn">
                    <i class="fas fa-times"></i>
                </button>
        `
    },
    shadowing: {
        className: 'toast-shadowing',
        content: (data) => `
                <div class="shadowing-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="shadowing-text">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <button class="shadowing-close close-btn">
                    <i class="fas fa-times"></i>
                </button>
        `
    },
    fly: {
        className: 'toast-fly',
        content: (data) => `
                <div class="floating-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="floating-text">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <button class="floating-close close-btn">
                    <i class="fas fa-times"></i>
                </button>
            <div class="floating-shadow"></div>
        `
    },
    cyberpunk: {
        className: 'toast-cyberpunk',
        content: (data) => `
                <div class="cyberpunk-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="cyberpunk-text">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <button class="cyberpunk-close close-btn">
                    <i class="fas fa-times"></i>
                </button>
                <div class="cyberpunk-glitch"></div>
        `
    },
    card3d: {
        className: 'toast-card3d',
        content: (data) => `
                <div class="card3d-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="card3d-text">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <button class="card3d-close close-btn">
                    <i class="fas fa-times"></i>
                </button>
        `
    },
    sticker: {
        className: 'toast-sticker',
        content: (data) => `
             <div class="d-flex gap-3">
                <div class="sticker-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="sticker-text">
                    <h4>${data.title}</h4>
                    <p>${data.text}</p>
                </div>
                <button class="sticker-close close-btn">
                    <i class="fas fa-times"></i>
                </button>
                </div>
            <div class="sticker-tape"></div>
        `
    },
    diagonalBg: {
        className: 'toast-diagonal-bg',
        content: (data) => `
            <div class="diagonal-background"></div>
            <div class="toast-content">
                <i class="${data.icon || 'fas fa-bell'} toast-icon"></i>
                <div class="text-content">
                    <h4 class="toast-title">${data.title || 'Notification'}</h4>
                    <p class="toast-message">${data.text || 'No message provided'}</p>
                </div>
                <button class="close-btn">&times;</button>
            </div>
        `
    },
};


export const toastProfesional = {
    create: function(customConfig) {
        //argumen gaya variabel non obj
     	if (arguments.length > 1) {
	      customConfig = {
	        title: arguments[0],
	        text: arguments[1],
	        type: arguments[2]
	      };
	    }

        // Gabungkan preset theme dengan konfig custom
        const baseConfig = toastThemes[customConfig.theme] || toastThemes.minimalist;

        //property lokal, tambahkan disini kalau mau menerapkan ke semua tema toats
        const defaultConfig = {
        	autoClose: 10000,
        	position: 'top-right',
        }

        //gabungkan smua config
        const options = { ...defaultConfig, ...baseConfig, ...customConfig };
        
        // Buat container (sama seperti sebelumnya)
        let container = document.querySelector(`.toast-${options.position}`);
        if (!container) {
            container = document.createElement('div');
            container.className = `toast-profesional toast-${options.position}`;
            document.body.appendChild(container);
        }

        // Buat toast
        const toast = document.createElement('div');
        toast.className = `${options.className}`;

        //hapus ini kalau toast hanya 1 type
        if(options.type){
        	toast.classList.add(options.type) 

        	const icons = {
	            info: 'fas fa-info-circle',
	            success: 'fas fa-check-circle',
	            warning: 'fas fa-exclamation-triangle',
	            error: 'fas fa-times-circle'
	        };

	        options.icon = options.icon || icons[options.type];
        }

        //tambahkan data yang ingin ditampilkan ke component dsini
        toast.innerHTML = options.content({
            icon: options.icon, 
            title: options.title, 
            text: options.text
        });

        if(toast.querySelector('.close-btn'))
        	toast.querySelector('.close-btn').addEventListener('click', () => this.remove(toast))

        if (options.autoClose) {
		    let timeoutId;
		    let isTimeUp = false;

		    // Set CSS variable untuk durasi animasi
    		toast.style.setProperty('--toast-duration', `${options.autoClose}ms`);

		    // Fungsi yang dipanggil ketika waktu habis
		    const handleTimeExpired = () => {
		        isTimeUp = true;
		        // Hapus toast jika mouse TIDAK di atasnya
		        if (!toast.matches(':hover')) {
		            this.remove(toast);
		        }
		    };

		    // Mulai timer
		    timeoutId = setTimeout(handleTimeExpired, options.autoClose);

		    // Saat mouse keluar, cek apakah waktu sudah habis
		    toast.addEventListener('mouseleave', () => {
		        if (isTimeUp) {
		            this.remove(toast);
		        }
		    });
		}

        container.appendChild(toast);
    },
    remove: function(toast) {
        toast.classList.add('toast-exit'); // Trigger fade-out animation
        
        toast.remove();
            // Hapus container jika kosong (optimasi)
        const container = toast.parentNode;
      	if (container && container.children.length === 0) {
            container.remove();
        }
    }
};