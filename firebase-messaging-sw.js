importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBawdAvivw24kEJJcZ8pjOVKLnUCPlWxig",
    authDomain: "project-aqi-43620.firebaseapp.com",
    projectId: "project-aqi-43620",
    storageBucket: "project-aqi-43620.appspot.com",
    messagingSenderId: "853048957452",
    appId: "1:853048957452:web:51b30fd41cab4658cdec29",
    measurementId: "G-MVKRVKVVB0"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
