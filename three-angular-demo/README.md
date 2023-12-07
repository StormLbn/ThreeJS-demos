# ThreeAngularDemo

Démo d'utilisation de Three.js dans un projet Angular.

Ressources :
- [Tutoriel Three.js natif](https://threejs.org/manual/#en/fundamentals)
- [Installation et mise en place de Three.js dans Angular](https://medium.com/geekculture/hello-cube-your-first-three-js-scene-in-angular-176c44b9c6c0)
- [Tutoriel globe avec atmosphère](https://www.youtube.com/watch?v=vM8M4QloVL0) et [repo GitHub associé](https://github.com/chriscourses/Intermediate-Three.js/blob/main/main.js)

A faire :
- interactions avec le globe (rotation manuelle)
- refactoriser pour "sortir" les éléments du ngAfterViewInit()

## Sommaire
1. [Initialisation du projet Angular](#Initialisation-du-projet)
1. [Bases pour créer un objet 3D](#Création-d'un-composant-pour-l'affichage-d'un-objet-3D)
1. [Notions supplémentaires pour le globe](#Création-d'un-globe-avec-texture-et-shaders)
---

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

Pour animer un objet, il faut modifier continuellement un ou plusieurs de ses paramètres `rotation` (en radians). Pour cela, on utilise une fonction récursive qui fait appel à `requestAnimationFrame(callback)`.

Dans cette démo, l'animation est faite avec la fonction `render(time)`, qui prend automatiquement en paramètre le temps depuis lequel la page a été chargée (en millisecondes). C'est ce paramètre temps est utilisé pour faire la rotation du Mesh.

Le paramètre de temps n'est pas indispensable pour faire une animation : dans la démo du globe, on ajoute simplement une valeur (0.005) à la rotation à chaque "boucle".

Après avoir modifié la rotation, on déclanche le rendu, puis on appelle la fonction `requestAnimationFrame(callback)` en utilisant `render` comme callback afin que l'animation se poursuive à la frame suivante.
Il faut quand même appeler une première fois la fonction pour lancer l'animation, on ajoute donc `requestAnimationFrame(render)` à la suite d'instructions.

Il y a peut-être plus simple mais c'est ce que j'ai trouvé dans toutes les démos dont celle de Three.js docs ¯\_(ツ)_/¯

## Création d'un globe avec texture et shaders

### Appliquer une texture

Pour appliquer une texture à un objet 3D, il faut ajouter une texture à son Material.
Pour cela, il faut d'abord "charger" la texture, puis la "mapper" sur le Material.
Il suffit ensuite d'ajouter le Material au Mesh comme d'habitude.

```typescript
const texture = new THREE.TextureLoader().load('url/de/la/texture.jpg');
const material = new THREE.MeshBasicMaterial({
    map: texture
});
```

### Utiliser des shaders

Un shader est un petit programme, écrit en GLSL, qui calcule les niveaux de lumière, couleur, etc. pendant le rendu d'un objet 3D. Je n'ai pas plus de détails concernant leur fonctionnement, en tout cas ici ils permettent de simuler l'atmosphère de la Terre et les étoiles.

Normalement, le shader s'écrit dans un fichier à part (voir [src/assets/three-shaders](./src/assets/three-shaders/) pour les shaders avec commentaires), mais je n'ai pas réussi à importer les fichiers dans Angular comme on aurait pu le faire en JS, donc j'ai écrit les shaders sous forme de string directement dans le fichier TS.

Pour utiliser un shader, il faut un Material de type ShaderMaterial ; à sa création, on lui passe un objet de configuration avec, selon les besoins :
- vertexShader : script GLSL pour appliquer des effets à l'objet 3D via ses sommets
- fragmentShader : script GLSL permettant d'appliquer une texture et/ou une couleur à l'objet 3D
- uniforms : objet de configuration permettent d'envoyer des données (comme une texture par exemple) à un fichier GLSL

Autres propriétés de Material utilisées :
- blending : ajoute un effet de transparence
- side : définit quel "côté" de l'objet est affiché

### Utiliser BufferGeometry

D'après ce que j'ai compris, BufferGeometry permet d'avoir une forme customisable, via l'utilisation d'une matrice/tableau de coordonnées correspondant aux sommets de la forme.

Associé à un PointsMaterial et un Mesh de type Points, il permet d'afficher uniquement les sommets du Geometry sous forme de points blancs pour simuler les étoiles.

### Taille de l'affichage

J'ai pas mal galéré pour pouvoir afficher un canvas dont la taille s'adapte à l'espace disponible sans dépasser de la fenêtre ; je n'ai pas encore réussi à rendre l'affichage dynamique.

Pour adapter la taille du canvas et du Renderer à celle de son contenant, il faut importer l'élément `host` via le constructeur, puis utiliser clientWidht/Height pour l'aspect de la caméra et la taille du Renderer :
```typescript
  constructor(private hostElement: ElementRef) {}

  // ...

  const camera = new THREE.PerspectiveCamera(
        75,
        this.hostElement.nativeElement.clientWidth /
            this.hostElement.nativeElement.clientHeight,
        0.1,
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: this.canvasRef.nativeElement
    });

    renderer.setSize(
        this.hostElement.nativeElement.clientWidth,
        this.hostElement.nativeElement.clientHeight,
        false
    );
```