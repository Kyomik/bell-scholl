export class ContactWheel {
  constructor(contacts, options = {}) {
    this.contacts = contacts;
    this.radius = options.radius || 95;
    this.rotationStep = options.rotationStep || 30;
    this.storageKey = options.storageKey || 'selectedContact';
    this.emptyMessage = options.emptyMessage || 'Belum ada device';
    this.onSelect = options.onSelect || null;

    // DOM elements
    this.wrapper = document.querySelector('.wheel-wrapper');
    this.trigger = document.getElementById('wheelTrigger');
    this.wheelContainer = document.getElementById('wheelContainer');
    this.cardsGroup = document.getElementById('wheelCards');
    this.rotateLeft = document.getElementById('rotateLeft');
    this.rotateRight = document.getElementById('rotateRight');

    // State
    this.currentRotation = 0;
    this.isOpen = false;
    this.isDragging = false;
    this.startAngle = 0;
    this.startRot = 0;
    this.selectedContact = this.loadSelectedContact();

    this.buildWheel();
    this.initEventListeners();
    this.initDragRotation();
    this.wheelContainer.classList.remove('active');
  }

  buildWheel() {
    this.cardsGroup.innerHTML = '';
    const total = this.contacts.length;
    const angleStep = total > 0 ? 360 / total : 0;

    // Clear any stored positions
    this.cardPositions = [];

    if (total === 0) {
        // Empty state (unchanged)
        // ...
    } else {
        // Normal contacts
        this.contacts.forEach((contact, i) => {
        const angle = i * angleStep;
        const rad = angle * Math.PI / 180;
        const x = Math.cos(rad) * this.radius;
        const y = Math.sin(rad) * this.radius;

        const card = document.createElement('div');
        card.className = 'wheel-card';
        if (contact.state === 'OFFLINE') {
            card.classList.add('wheel-card-offline');
            card.style.pointerEvents = 'none';
        }
        card.setAttribute('data-name', contact.deviceId);
        card.textContent = contact.id;
        // Store position for later use
        this.cardPositions.push({ card, x, y });
        // Initial transform (without rotation)
        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (contact.state !== 'OFFLINE') {
            this.selectContact(contact);
            } else {
            this.showToast(`${contact.deviceId} is offline`, 'error');
            }
        });

        this.cardsGroup.appendChild(card);
        });
    }
    }

    rotateWheel(deg) {
    this.currentRotation = deg;
    // Rotate the whole group (for the ring and card positions)
    this.cardsGroup.style.transform = `rotate(${this.currentRotation}deg)`;
    const ring = document.querySelector('.rotate-ring');
    if (ring) {
        ring.style.transform = `translate(-50%, -50%) rotate(${this.currentRotation}deg)`;
    }

    // Counter-rotate each card to keep text upright
    if (this.cardPositions) {
        this.cardPositions.forEach(({ card, x, y }) => {
        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${-this.currentRotation}deg)`;
        });
    }
    }

  // Public method to refresh contacts (called from app.js)
  refreshContacts(newContacts) {
    this.contacts = newContacts;
    this.buildWheel();
    // Optionally reset rotation to 0 when data changes
    this.rotateWheel(0);
  }

  selectContact(contact) {
    this.selectedContact = contact.deviceId;
    localStorage.setItem(this.storageKey, contact.deviceId);
    this.showToast(`Selected: ${contact.deviceId}`, 'success');
    if (this.onSelect) this.onSelect(contact);
    this.closeWheel();
  }

  loadSelectedContact() {
    return localStorage.getItem(this.storageKey) || null;
  }

  // Show a toast notification (improved, reusable)
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'wheel-toast';
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
    toast.innerHTML = `<i class="${icon}"></i> ${message}`;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 110px;
      background: ${type === 'success' ? 'rgba(0,0,0,0.8)' : 'rgba(220, 38, 38, 0.9)'};
      backdrop-filter: blur(8px);
      color: white;
      padding: 8px 16px;
      border-radius: 40px;
      font-size: 0.85rem;
      z-index: 1100;
      animation: fadeOut 2.5s forwards;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  // Open the wheel
  openWheel() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.wheelContainer.classList.add('active');
    this.trigger.classList.add('open');
  }

  // Close the wheel
  closeWheel() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.wheelContainer.classList.remove('active');
    this.trigger.classList.remove('open');
  }

  // Set up drag-to-rotate (works on both desktop and touch)
  initDragRotation() {
    const onPointerStart = (e) => {
      if (!this.isOpen) return;
      e.preventDefault();
      this.isDragging = true;
      const rect = this.wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      this.startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      this.startRot = this.currentRotation;
      this.cardsGroup.style.transition = 'none';
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const rect = this.wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let delta = (angle - this.startAngle) * 180 / Math.PI;
      this.rotateWheel(this.startRot + delta);
    };

    const onPointerEnd = () => {
      this.isDragging = false;
      this.cardsGroup.style.transition = '';
    };

    this.wrapper.addEventListener('pointerdown', onPointerStart);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerEnd);
  }

  // Initialize all event listeners
  initEventListeners() {
    // Toggle wheel on trigger click
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isOpen ? this.closeWheel() : this.openWheel();
    });

    // Close wheel when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.wrapper.contains(e.target)) {
        this.closeWheel();
      }
    });

    // Prevent wheel from closing when clicking inside it
    this.wrapper.addEventListener('click', (e) => e.stopPropagation());

    // Rotation buttons
    if (this.rotateLeft) {
      this.rotateLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        this.rotateWheel(this.currentRotation - this.rotationStep);
      });
    }
    if (this.rotateRight) {
      this.rotateRight.addEventListener('click', (e) => {
        e.stopPropagation();
        this.rotateWheel(this.currentRotation + this.rotationStep);
      });
    }
  }
}