/**
 * Script de test manuel pour le système de cache
 * 
 * Ce script vous permet de tester le fonctionnement du système de cache
 * des classes dans l'application Mobaria. Copiez et collez ces fonctions 
 * dans la console du navigateur pour les exécuter.
 */

// Affiche l'état actuel du cache
function checkCacheStatus() {
  const CLASSES_STORAGE_KEY = 'mobaria_classes';
  const CLASSES_TIMESTAMP_KEY = 'mobaria_classes_timestamp';
  
  const classes = localStorage.getItem(CLASSES_STORAGE_KEY);
  const timestamp = localStorage.getItem(CLASSES_TIMESTAMP_KEY);
  
  console.log('=== ÉTAT DU CACHE ===');
  
  if (!classes || !timestamp) {
    console.log('Le cache est vide.');
    return;
  }
  
  const parsedTimestamp = parseInt(timestamp, 10);
  const now = Date.now();
  const diff = now - parsedTimestamp;
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  console.log('Données en cache: ' + (classes ? 'OUI' : 'NON'));
  console.log('Timestamp: ' + new Date(parsedTimestamp).toLocaleString());
  console.log('Âge du cache: ' + diffHours + ' heures et ' + diffMinutes + ' minutes');
  console.log('Validité: ' + (diff < 24 * 60 * 60 * 1000 ? 'VALIDE' : 'EXPIRÉ'));
  
  console.log('Nombre de classes en cache: ' + JSON.parse(classes).length);
}

// Efface le cache manuellement
function clearCache() {
  const CLASSES_STORAGE_KEY = 'mobaria_classes';
  const CLASSES_TIMESTAMP_KEY = 'mobaria_classes_timestamp';
  
  localStorage.removeItem(CLASSES_STORAGE_KEY);
  localStorage.removeItem(CLASSES_TIMESTAMP_KEY);
  
  console.log('Cache effacé avec succès!');
}

// Simule un cache expiré en définissant le timestamp à il y a 25 heures
function simulateExpiredCache() {
  const CLASSES_STORAGE_KEY = 'mobaria_classes';
  const CLASSES_TIMESTAMP_KEY = 'mobaria_classes_timestamp';
  
  const classes = localStorage.getItem(CLASSES_STORAGE_KEY);
  
  if (!classes) {
    console.log('Aucune donnée en cache. Chargez d\'abord les classes.');
    return;
  }
  
  // Timestamp d'il y a 25 heures
  const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000);
  localStorage.setItem(CLASSES_TIMESTAMP_KEY, expiredTimestamp.toString());
  
  console.log('Le cache a été modifié pour paraître expiré (25 heures).');
}

// Instructions d'utilisation
console.log('=== OUTIL DE TEST DU CACHE ===');
console.log('Pour vérifier l\'état du cache, exécutez: checkCacheStatus()');
console.log('Pour effacer le cache, exécutez: clearCache()');
console.log('Pour simuler un cache expiré, exécutez: simulateExpiredCache()');
