/**
 * ====================================================================
 * ENVIRONMENT - Configuration de production
 * ====================================================================
 * 
 * Fichier : src/environments/environment.prod.ts
 * 
 * Ce fichier contient les variables de configuration pour la PRODUCTION.
 * Angular utilise ces valeurs quand vous lancez : ng build --configuration=production
 */

export const environment = {
  production: true,
  apiUrl: 'https://majexconsulting.com'  
};

/**
 * ====================================================================
 * CONFIGURATION PRODUCTION
 * ====================================================================
 *
 * AVANT LE DÉPLOIEMENT, REMPLACEZ L'URL PAR :
 *
 * 1. Votre domaine de production Hostinger :
 *    - https://majexconsulting.com (si backend et frontend même domaine)
 *    - https://api.majexconsulting.com (sous-domaine API dédié)
 *
 * 2. Vérifications backend Laravel requises :
 *    ✓ CORS configuré pour autoriser le domaine frontend
 *    ✓ APP_URL dans .env correspond à l'URL de production
 *    ✓ Certificat SSL/HTTPS actif
 *    ✓ Rate limiting configuré pour /api/login et /api/login/verify
 *
 * ====================================================================
 */
