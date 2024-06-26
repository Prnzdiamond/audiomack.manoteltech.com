// (function() {
//     //const API_BASE = 'https://d1w84o1yn9ge3a.cloudfront.net';
//     const API_BASE = 'https://manotelvas.com';
//     const form = document.getElementById('form');
//     const submitButton = document.getElementById('submitButton');
//     const error = document.getElementById('error');
//     const modal = document.getElementById('modal');
//     const modalOverlay = document.getElementById('modal-overlay');
//     const modalClose = document.getElementById('modal-close');
//     const cancelPlan = document.getElementById('cancel-plan');
//     const cancelPlanButton = document.getElementById('cancel-plan-btn');
//     // For weekly and monthly
//     const serviceId = 234102200006637;
//     let currentStatus;

//     form.addEventListener('submit', function(e) {
//         e.preventDefault();
//         const phoneNumber = parsePhoneNumber(e.currentTarget.phoneNumber.value);
//         const productId = e.currentTarget.productId.value;

//         error.setAttribute('hidden', true);

//         setSubmitState(true, 'Submittingâ€¦');

//         subscribe(phoneNumber, productId).then(() => {
//             setSubmitState(false);
//             showSubmitMessage(false);
//         }).catch((err) => {
//             setSubmitState(false);
//             showSubmitMessage(true, err.message);
//         });
//     });

//     form.addEventListener('input', function(e) {
//         const phoneInput = e.currentTarget.phoneNumber;
//         const phoneNumber = phoneInput.value;
//         const productId = e.currentTarget.productId.value;
//         const phoneNumberValid = phoneNumber && parsePhoneNumber(phoneNumber).length === 10;
//         const phoneFn = phoneNumberValid ? 'remove' : 'add';
//         const isSubscriberAlready = currentStatus && currentStatus.sub_status;

//         phoneInput.value = (phoneNumber.match(/[\d-]+/) || [])[0] || '';

//         error.setAttribute('hidden', true);

//         if (phoneInput.value.trim()) {
//             phoneInput.classList[phoneFn]('hasError');
//         }

//         if (phoneNumber && phoneNumberValid && productId && !isSubscriberAlready) {
//             submitButton.removeAttribute('disabled');
//             return;
//         }

//         submitButton.setAttribute('disabled', 'disabled');
//     });

//     const radios = document.querySelectorAll('[name="productId"]');
//     radios.forEach((r) => {
//         r.addEventListener('change', () => {
//             const phoneInput = form.phoneNumber;
//             const phoneNumber = phoneInput.value;
//             const productId = r.value;

//             if (phoneNumber) {
//                 checkStatus(phoneNumber, productId).then((response) => {
//                     postStatusCheck(response);
//                 });
//                 return;
//             }
//         })
//     })

//     form.phoneNumber.addEventListener('blur', () => {
//         const phoneNumber = parsePhoneNumber(form.phoneNumber.value);

//         const productId = form.productId.value;

//         if (productId) {
//             checkStatus(phoneNumber, productId).then((response) => {
//                 postStatusCheck(response);
//             });
//             return;
//         }

//         return;
//     });

//     cancelPlanButton.addEventListener('click', function() {
//         const originalText = cancelPlanButton.textContent;
//         const phoneNumber = parsePhoneNumber(form.phoneNumber.value);
//         const productId = form.productId.value;

//         cancelPlanButton.disabled = true;

//         unsubscribe(phoneNumber, productId).then((response) => {
//             console.log(response);
//             cancelPlanButton.textContent = originalText;
//         }).catch((err) => {
//             cancelPlan.setAttribute('hidden', true);
//             cancelPlanButton.textContent = originalText;
//             showSubmitMessage(true, err.message);
//         });
//     });

//     modalClose.addEventListener('click', function() {
//         hideModal();
//     });

//     function showModal() {
//         modal.style.display = 'block';
//         modalOverlay.style.display = 'block';

//         window.requestAnimationFrame(() => {
//             window.requestAnimationFrame(() => {
//                 modal.classList.add('active');
//                 modalOverlay.classList.add('active');
//             });
//         });
//     }

//     function hideModal() {
//         modalOverlay.classList.remove('active');
//         modal.classList.remove('active');

//         modalOverlay.addEventListener('transitionend', function onOverlayEnd() {
//             modalOverlay.style.display = 'none';
//             modalOverlay.removeEventListener('transitionend', onOverlayEnd);
//         });

//         modal.addEventListener('transitionend', function onModalEnd() {
//             modal.style.display = 'none';
//             modal.removeEventListener('transitionend', onModalEnd);
//         });
//     }

//     function parsePhoneNumber(number) {
//         number = (number.match(/\d+/g) || []).join('')
//         if (number.length === 11) {
//             number = number.slice(1);
//         }
//         return `234${number}`;
//     }

//     function showSubmitMessage(hasError, text) {
//         if (hasError) {
//             if (text) {
//                 error.querySelector('span').textContent = text;
//             }

//             error.removeAttribute('hidden');
//         } else {
//             error.setAttribute('hidden', true);
//             showModal();
//         }
//     }

//     function setSubmitState(disabled, text) {
//         if (disabled) {
//             submitButton.setAttribute('disabled', 'disabled');
//         }
//         else {
//             submitButton.removeAttribute('disabled');
//         }

//         if (text) {
//             submitButton.value = 'Submittingâ€¦';
//         }
//         else {
//             submitButton.value = 'Submit';
//         }
//     }

//     function subscribe(phoneNumber, productId) {
//         return fetch(`${API_BASE}/mtn_serve/request.php`, {
//             method: 'POST',
//             body: JSON.stringify({
//                 serviceId: serviceId,
//                 productId: productId,
//                 phoneNumber: phoneNumber,
//                 action: 'subscribe',
//                 token: 'WQH'
//             })
//         }).then((res) => {
//             return res.json();
//         }).then((response) => {
//             console.log(response);
//             if (response.responseCode.toString() !== '22007233') {
//                 track({
//                     eventAction: 'Subscribe Failure',
//                     eventLabel: productId
//                 });
//                 throw new Error('There was an error completing your subscription.')
//             }

//             track({
//                 eventAction: 'Subscribe Success',
//                 eventLabel: productId
//             });
//         });
//     }

//     function unsubscribe(phoneNumber, productId) {
//         return fetch(`${API_BASE}/mtn_serve/request.php`, {
//             method: 'POST',
//             body: JSON.stringify({
//                 serviceId: serviceId,
//                 productId: productId,
//                 phoneNumber: phoneNumber,
//                 action: 'unsubscribe',
//                 token: 'WQH'
//             })
//         }).then((res) => {
//             return res.json();
//         }).then((response) => {
//             console.log(response);
//             if (response.responseCode.toString() !== '00000000') {
//                 track({
//                     eventAction: 'Unsubscribe Failure',
//                     eventLabel: productId
//                 });
//                 throw new Error('There was an error removing your subscription.')
//             }

//             track({
//                 eventAction: 'Unsubscribe Success',
//                 eventLabel: productId
//             });
//         });
//     }

//     function checkStatus(phone, productId) {
//         return fetch(`${API_BASE}/mtn_serve/checkSub.php`, {
//             method: 'POST',
//             body: JSON.stringify({
//                 network: 'MTN',
//                 phoneNumber: phone,
//                 serviceId: serviceId,
//                 productId: productId,
//                 token: 'WQH'
//             })
//         }).then((res) => {
//             return res.json();
//         });
//     }

//     function postStatusCheck(response) {
//         console.log(response);

//         currentStatus = response;

//         if (response.sub_status) {
//             cancelPlan.removeAttribute('hidden');
//             setSubmitState(true);
//         } else {
//             cancelPlan.setAttribute('hidden', true);
//             setSubmitState(false);
//         }
//         return;
//     }

//     function track(options) {
//         if (typeof window.gtag !== 'function') {
//             return;
//         }

//         const { eventAction, eventLabel, eventValue } = options;

//         window.gtag('event', options.event_action || eventAction, {
//             event_category: event,
//             event_label: options.event_label || eventLabel,
//             value: options.value || eventValue
//         });
//     }

// })();

document.addEventListener("DOMContentLoaded", () => {
  const premuim = document.getElementById("premuim");
  const access = document.getElementById("access");
  const modal = document.getElementById("modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalClose = document.getElementById("modal-close");
  const cancelRedirect = document.getElementById("cancel-redirect");
  const countdown = document.getElementById("countdown");
  const modalTitle = document.querySelector(".modal-title");
  const radio_p = document.getElementById("radio-p");
  const radio_a = document.getElementById("radio-a");
  let countdownInterval;

  const generateTxid = () =>
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const redirectUrl = (plantype) => {
    const txid = generateTxid();
    const url =
      plantype === "premium"
        ? `https://ng-app.com/MANOTEL/audiomack-premium-landing-otp-en-doi-web?origin_banner=1&trxId=${txid}`
        : `https://ng-app.com/MANOTEL/audiomack-access-with-data-landing-otp-en-doi-web?origin_banner=1&trxId=${txid}`;

    modalTitle.textContent = `Confirm ${plantype} Subscription`;
    modal.style.display = "block";
    modalOverlay.style.display = "block";

    let seconds = 3;
    countdown.textContent = seconds;
    countdownInterval = setInterval(() => {
      countdown.textContent = --seconds;
      if (seconds === 0) {
        clearInterval(countdownInterval);
        window.location.href = url;
      }
    }, 1000);
  };

  const closeModal = () => {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
    clearInterval(countdownInterval);
  };

  modalOverlay.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  cancelRedirect.addEventListener("click", closeModal);
  premuim.addEventListener("click", () => {
    redirectUrl("premium");
  });
  access.addEventListener("click", () => redirectUrl("access"));
});
