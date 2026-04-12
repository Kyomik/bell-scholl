import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import wsManager from './core/ws-instance';
import { ApiService } from './utils/ApiService';
import { tokenManager } from './utils/TokenManager';
import { CardController } from './controllers/CardController';
import { deviceManager } from './utils/DeviceManager';
import { ContactWheel } from './utils/ContactSpinner';
import { Notify } from './helpers/helper-notif';

let contactWheel = null;

// Helper to refresh the wheel with current devices
function updateContactWheel() {
  if (contactWheel) {
    contactWheel.refreshContacts(deviceManager.devices || []);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await ApiService.refreshCsrf();
  await tokenManager.ensureValidToken();

  const cardController = new CardController('main-card');

  wsManager.on('NOTIFICATION', (error) => {
    ApiService.showAlert(error.message);
    cardController.closeAllLoadingButtonChildren()
  });

    wsManager.on('WARNING', (message) => {
        cardController.closeAllLoadingButtonChildren()
    })

    wsManager.on('device-snapshot', (result) => {
        deviceManager.setSnapshot(result);
        updateContactWheel(); // refresh after snapshot
    });

  wsManager.on('device-connected', (result) => {
    deviceManager.addOrUpdateDevice(result);
    updateContactWheel();
  });

  wsManager.on('device-suspend', (result) => {
    deviceManager.updateDeviceState(result);
    updateContactWheel();
  });

  wsManager.on('device-disconnected', (result) => {
    deviceManager.updateDeviceState(result);
    updateContactWheel();
  });

  wsManager.on('device-reconnect', (result) => {
    deviceManager.addOrUpdateDevice(result);
    updateContactWheel();
  });

  wsManager.on('event:delivered', (result) => {
    const data = result.data
    switch(data.originalEventName){
        case 'create-sesi':
            cardController.flipped()
            cardController.list.updateUI(cardController.formAlarm.getFormData(), 'add')
            cardController.formAlarm.submitButton.setLoading(false)
            break;
        case 'destroy-sesi':
            cardController.list.updateUI(cardController.list.item.component.dataset.index, 'delete')
            break;
        case 'destroy-all-sesi':
            cardController.list.updateUI()
            cardController.clearAllSubmit.setLoading(false)
            break;
        case 'sync-alarm':
            cardController.list.updateUI(null, 'sync')
            cardController.syncSubmit.setLoading(false)
            break;
        case 'lets-fucking-go':
            cardController.formAlarm.audioSelection.audioUpload.letsFuckingGo()
            break;
        case "thats-it-b1tch":
            Notify.success(`Berhasil mengupload file ${cardController.formAlarm.audioSelection.audioUpload.fileNameSpan.textContent}`)
    }

  })

    wsManager.on('event_expired', (result) => {
        let namaEvent
        switch(result.eventName){
            case 'create-sesi':
                namaEvent = 'pembuatan sesi'
                cardController.flipped()
                cardController.list.updateUI(cardController.formAlarm.getFormData(), 'add')
                cardController.formAlarm.submitButton.setLoading(false)
                break;
            case 'destroy-sesi':
                namaEvent = 'Penghapusan sesi'
                cardController.list.updateUI(cardController.list.item.component.dataset.index, 'delete')
                break;
            case 'destroy-all-sesi':
                namaEvent = 'Penghapusan semua sesi'
                cardController.list.updateUI()
                cardController.clearAllSubmit.setLoading(false)
                break;
            case 'sync-alarm':
                namaEvent = 'Syncronisasi alarm'
                cardController.list.updateUI(null, 'sync')
                cardController.syncSubmit.setLoading(false)
                break;
            case 'upload-audio-start':
                namaEvent = 'Memulai upload audio'
                cardController.formAlarm.audioSelection.audioUpload.hideModal()
                cardController.formAlarm.audioSelection.audioUpload.uploadBtn.setLoading(false)
                break;
            case 'upload-audio-end':
                Notify.error(`Gagal mengupload file ${cardController.formAlarm.audioSelection.audioUpload.fileNameSpan.textContent}`)
                break;
        }

        Notify.error(`${namaEvent} Request timed out. Please try again.`)
    })

  // Create the contact wheel (initially with empty array)
  contactWheel = new ContactWheel([], {
    radius: 95,
    rotationStep: 30,
    storageKey: 'selectedContact',
    onSelect: (contact) => {
      console.log('Selected device:', contact);
    }
  });

  // If deviceManager already has devices (e.g., from localStorage), show them immediately
  updateContactWheel();

  // Add toast styles if not already present
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
});