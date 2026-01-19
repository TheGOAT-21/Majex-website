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
  production: true,  // true = mode production
  apiUrl: 'https://api.majexconsulting.com/api'  // URL de votre backend en production sur Hostinger
};

/**
 * ====================================================================
 * IMPORTANT : À MODIFIER AVANT LE DÉPLOIEMENT
 * ====================================================================
 * 
 * Quand vous déployez votre backend Laravel sur Hostinger, vous devrez :
 * 
 * 1. Remplacer 'https://api.majexconsulting.com/api' par votre vraie URL
 *    Exemples possibles :
 *    - https://majexconsulting.com/api (si backend et frontend même domaine)
 *    - https://backend.majexconsulting.com/api (sous-domaine dédié)
 * 
 * 2. S'assurer que le CORS est bien configuré dans Laravel
 *    (le fichier cors.php doit autoriser votre domaine frontend)
 * 
 * ====================================================================
 */
