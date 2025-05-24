# Système de mise en cache dans l'application Mobaria

Ce document explique le système de mise en cache implémenté pour les données des classes de personnages dans l'application Mobaria.

## Fonctionnement du cache

Le cache utilise le `localStorage` du navigateur pour stocker les données des classes de personnages. Cela permet de:

1. Réduire les requêtes HTTP au serveur
2. Accélérer le chargement des données
3. Permettre l'utilisation de l'application en mode hors ligne (fallback)

## Implémentation

### Service WikiDataService

Le service `WikiDataService` gère la récupération des données des classes et leur mise en cache:

- Les données sont stockées dans le localStorage sous la clé 'mobaria_classes'
- Un timestamp est également stocké sous la clé 'mobaria_classes_timestamp'
- La durée de validité du cache est de 24 heures

### Méthodes principales

- `getClasses()`: Récupère toutes les classes, soit depuis le cache si valide, soit depuis le fichier JSON
- `getClassById(id)`: Récupère une classe spécifique par son ID
- `clearClassesCache()`: Efface le cache pour forcer un rechargement depuis le serveur
- `isCacheValid()`: Vérifie si le cache est toujours valide en fonction du timestamp

## Interface utilisateur

Un bouton de rafraîchissement du cache a été ajouté dans la page d'accueil du Wiki pour permettre aux utilisateurs de forcer la mise à jour des données:

1. Accédez à la page Wiki
2. Dans la section "Administration du Wiki", cliquez sur "Actualiser les données"

## Gestion des erreurs

Le système implémente une stratégie de fallback:

1. Si le chargement depuis le JSON échoue, mais que des données en cache existent (même expirées), ces données sont utilisées comme solution de secours
2. Des indicateurs de chargement et des messages d'erreur sont affichés lorsque nécessaire
3. Des boutons "Réessayer" permettent aux utilisateurs de tenter de recharger les données en cas d'échec

## Développement futur

Pour améliorer davantage ce système, on pourrait:

1. Ajouter un système de versioning pour le cache (pour forcer l'actualisation après des mises à jour de structure)
2. Étendre le cache à d'autres types de données (monstres, zones, quêtes)
3. Ajouter des mécanismes de synchronisation en arrière-plan
