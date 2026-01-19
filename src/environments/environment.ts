/**
 * ====================================================================
 * ENVIRONMENT - Configuration de développement
 * ====================================================================
 * 
 * Fichier : src/environments/environment.ts
 * 
 * Ce fichier contient les variables de configuration pour l'environnement LOCAL.
 * Angular utilise ces valeurs quand vous lancez : ng serve
 */

export const environment = {
  production: false,  // false = mode développement
  apiUrl: 'http://127.0.0.1:8000/api'  // URL de votre backend Laravel local
};

/**
 * ====================================================================
 * POURQUOI UTILISER DES FICHIERS ENVIRONMENT ?
 * ====================================================================
 * 
 * Imaginez que vous avez 3 environnements :
 * 1. LOCAL : http://localhost:8000/api
 * 2. STAGING : https://api-staging.majexconsulting.com/api
 * 3. PRODUCTION : https://api.majexconsulting.com/api
 * 
 * Sans fichiers environment, vous devriez changer l'URL manuellement
 * dans TOUS les services à chaque déploiement. 😱
 * 
 * Avec les fichiers environment, Angular switch automatiquement
 * selon la commande utilisée :
 * - ng serve → environment.ts (local)
 * - ng build --configuration=production → environment.prod.ts
 * 
 * ====================================================================
 */
