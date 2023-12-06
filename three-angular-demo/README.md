# ThreeAngularDemo

Démo d'utilisation de Three.js dans un projet Angular.

Ressources :
- [Tutoriel Three.js natif](https://threejs.org/manual/#en/fundamentals)
- [Installation et mise en place de Three.js dans Angular](https://medium.com/geekculture/hello-cube-your-first-three-js-scene-in-angular-176c44b9c6c0)

A faire : démo d'une sphère avec texture.

## Initialisation du projet

Initialisation du projet et ajout de la librairie Three.js via le CLI :
```bash
ng new --skip-tests three-angular-demo
cd three-angular-demo
npm i three
npm i -D @types/three
```

## Création d'un composant pour l'affichage d'un objet 3D

Création du composant via le CLI :
```bash
ng g c components/cube
```

Ce composant est ajouté au template de *app.component*.

### Template
Le template se constitue uniquement d'une balise "canvas" avec une référence.
```html
<canvas #canvas></canvas>
```

### Classe du composant

Pour pouvoir utiliser Three.js, on commence par importer le package avec un alias :
```typescript
import * as THREE from 'three';
```

Il faut ensuite récupérer le canvas du template :
```typescript
@ViewChild('canvas')
private canvasRef!: ElementRef<HTMLCanvasElement>;
```
Les éléments récupérés via `@ViewChild()` ne sont disponibles qu'après l'initialisation de la vue ; on utilise donc le *lifecycle hook* **AfterViewInit** pour écrire les instructions pour l'affichage de l'objet en 3D.


#### Eléments nécessaires pour un render en Three.js :

- Mesh : objet 3D à afficher ; constitué de deux éléments :
    - Geometry : forme de l'objet (sphère, cube, cône, cylindre...)
    - Material : propriétés de la surface de l'objet, comme la couleur ou la texture
- Scene : élément contenant les objets ou groupes d'objets et la lumière, un peu comme un plateau de tournage ; les Mesh et la lumière doivent être ajoutés à la scène avec la méthode `add()`
- Light : éclairage de la scène, pas nécessaire si on utilise MeshBasicMaterial
- Camera : point de vue sur la scène ; se compose de 4 paramètres :
    - field of view (fov) : champ de vision de la caméra
    - aspect : ratio largeur/hauteur du canvas
    - near et far : espace à afficher (en coordonnées), relatif à la caméra
- Renderer : permet l'affichage des éléments présents dans la scène visibles depuis la caméra, grâce à la méthode `render(scene, camera)` ; le Renderer est créé à partir du canvas

Remarque : il est possible de modifier les paramètres de certains éléments (position par exemple) après leur création.

*Schéma d'exemple de la structure d'un Renderer :*
![Schéma d'un rendu Three.js](https://threejs.org/manual/resources/images/threejs-1cube-with-directionallight.svg)


#### Etapes à suivre (cf. [cube.component.ts](./src/app/cube/cube.component.ts) ou la démo [hello-cube](/hello-cube/main.mjs)) :

- Créer les instances de Geometry et Material nécessaires à la création des Mesh ; un Geometry ou Material peut être utilisé pour créer plusieurs Mesh
- Créer et paramétrer les Mesh nécessaires au rendu
- Créer et paramétrer la lumière si besoin
- Créer la scène, y ajouter la lumière et les Mesh
- Créer et paramétrer la caméra
- "Récupérer" le canvas, grâce à sa référence avec `@ViewChild('reference')`, ou son id avec `document.getElementById('id')`
- Créer le Renderer avec le canvas
- Démarrer le rendu, soit commencer le tournage, pour continuer l'analogie avec le cinéma


#### Animer un objet :

Dans cette démo, l'animation est faite avec une fonction récursive `render(time)`, qui prend automatiquement en paramètre le temps depuis lequel la page a été chargée (en millisecondes).
Ce paramètre temps est utilisé pour faire une rotation du Mesh ; le paramètre de rotation est en radians.
Après la rotation, on déclanche le rendu, puis on utilise la fonction `requestAnimationFrame(callback)` en appelant `render` en paramètre, pour que l'animation se poursuive à la frame suivante.
Il faut quand même appeler une première fois la fonction en ajoutant `requestAnimationFrame(render)` à la suite d'instructions.

Il y a peut-être plus simple mais c'est ce que j'ai trouvé dans la démo Three.js `¯\_(ツ)_/¯`