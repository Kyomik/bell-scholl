(function() {
    // Contact data
    const contacts = [
      { name: 'Ahmad Fauzi', initial: 'A' },
      { name: 'Siti Nurhaliza', initial: 'S' },
      { name: 'Budi Santoso', initial: 'B' },
      { name: 'Dewi Lestari', initial: 'D' },
      { name: 'Rizki Ramadhan', initial: 'R' }
    ];

    const wrapper = document.querySelector('.wheel-wrapper');
    const trigger = document.getElementById('wheelTrigger');
    const wheelContainer = document.getElementById('wheelContainer');
    const cardsGroup = document.getElementById('wheelCards');
    let currentRotation = 0;
    let isOpen = false;
    let isDragging = false;
    let startAngle = 0;
    let startRot = 0;

    // Parameters for circle layout
    const radius = 95;          // distance from center to card center
    const total = contacts.length;
    const angleStep = 360 / total;

    // Build cards and position them around a circle
    function buildWheel() {
      cardsGroup.innerHTML = '';
      contacts.forEach((contact, i) => {
        const angle = i * angleStep; // degrees, starting at 0 (to the right)
        const rad = angle * Math.PI / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        const card = document.createElement('div');
        card.className = 'wheel-card';
        card.setAttribute('data-name', contact.name);
        card.textContent = contact.initial;
        // Center the card at (x, y) relative to the center of cardsGroup
        card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          showToast(`Mengirim pesan ke ${contact.name}`);
          closeWheel(); // optional: close after selection
        });
        cardsGroup.appendChild(card);
      });
    }

    // Open wheel (show and animate)
    function openWheel() {
        if (isOpen) return;
        isOpen = true;
        wheelContainer.classList.add('active');
        trigger.classList.add('open');   // change button color
        }

        function closeWheel() {
        if (!isOpen) return;
        isOpen = false;
        wheelContainer.classList.remove('active');
        trigger.classList.remove('open'); // revert color
        }

    // Rotation functions
    function rotateWheel(deg) {
        currentRotation = deg;
        cardsGroup.style.transform = `rotate(${currentRotation}deg)`;
        const ring = document.querySelector('.rotate-ring');
        if (ring) ring.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        }

    // Drag to rotate
    function initDragRotation() {
      const onPointerStart = (e) => {
        if (!isOpen) return;
        e.preventDefault();
        isDragging = true;
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        startAngle = angle;
        startRot = currentRotation;
        cardsGroup.style.transition = 'none';
      };

      const onPointerMove = (e) => {
        if (!isDragging) return;
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let delta = (angle - startAngle) * 180 / Math.PI;
        rotateWheel(startRot + delta);
      };

      const onPointerEnd = () => {
        isDragging = false;
        cardsGroup.style.transition = '';
      };

      wrapper.addEventListener('pointerdown', onPointerStart);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerEnd);
    }

    // Toast notification
    function showToast(msg) {
      const toast = document.createElement('div');
      toast.className = 'wheel-toast';
      toast.innerHTML = `<i class="fas fa-paper-plane"></i> ${msg}`;
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 110px;
        background: rgba(0,0,0,0.8);
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

    // Add keyframes if missing
    if (!document.querySelector('#wheelToastStyle')) {
      const style = document.createElement('style');
      style.id = 'wheelToastStyle';
      style.textContent = `
        @keyframes fadeOut {
          0% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-8px); visibility: hidden; }
        }
      `;
      document.head.appendChild(style);
    }

    // Event listeners
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isOpen) closeWheel();
      else openWheel();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen && !wrapper.contains(e.target)) {
        closeWheel();
      }
    });

    // Prevent wheel from closing when clicking inside it (already handled by trigger and items)
    wrapper.addEventListener('click', (e) => e.stopPropagation());

    // Build and init
    buildWheel();
    initDragRotation();

    // Initially hidden
    wheelContainer.classList.remove('active');

    document.getElementById('rotateLeft').addEventListener('click', (e) => {
        e.stopPropagation();
        rotateWheel(currentRotation - 30);
        });

        document.getElementById('rotateRight').addEventListener('click', (e) => {
        e.stopPropagation();
        rotateWheel(currentRotation + 30);
        });
  })();