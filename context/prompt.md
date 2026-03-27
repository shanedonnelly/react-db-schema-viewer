## But de ce prompt

Le but de ce prompt est de crée un composant react (encore je sais) réutilisable qui affiche un schéma de données. 

Ce composant sera essentiellement un wrapper autour de la librairie reactflow. 

Ce que je veux concretement : 
- une structure de données type script pour définir le schéma de données à afficher
- une fonction de mapping entre un schéma json et la structure de données typescript
- un composant React qui prendra en props cette structure de données et qui affichera le schéma de données à l'aide de reactflow.

Tu me le tout dan un fichier `DataSchemaVisualizer.tsx` que je pourrais ensuite réutiliser dans mes projets.

Dans le fichier App.tsx, je veux tu crée une app qui utilise de composant en lui imposant une taille fixe et un emplacement fix dans la page (histoire qu'on différencie bien le composant de l'app qui l'importe).

Dans cette app exemple tu feras un schéma de données assez complexe pour bien montrer les capacités du composant.

### Structure de données

Un schéma de données sera composé : 
- d'une liste d'entités 
- une liste de relations entre ces entités (le lien est orienté, il va de l'entité source vers l'entité cible)

Une entité est définie par :
- un id unique
- un nom
- une liste d'attributs

Un attribut est défini par :
- un nom
- un type (un string libre). 

### Le composant React

Le composant React sera donc un wrapper autour de reactflow pour afficher les entités et les relations entre elles.

On restreints pas mal l'utilisation de react flow. 

On ne peux pas modifier la donnée, on peut pas bouger les éléments... 

Concrètement, on peut juste zoomer et se déplacer dans le schéma de données.

### auto layout

L'auto layout est payant dans reactflow, mais je veux que tu me l'implémente toi même.

Tu vas utiliser une des librairies que tu veux pour faire de l'auto layout (dagre, elkjs, etc...) (t'en choisi qu'une).

Tu as le droit d'ajouter une libriairie via npm install, mais tu dois me diras laquelle. 

## Style

Je te fais confiance sur le style pour un truc assez simple, assez natif de la librairie reactflow, mais tu peux faire quelques ajustements pour que ce soit plus joli. Concrètement il faut qu'on soit ce qu'on cherche d'un bon outil de MCD / MLD : la lisibilité et la clarté du schéma de données.

## Context

Utilise bien le MCP Context7 pour chercher tout ce dont tu as besoin pour comprendre la librairie reactflow avec tous ces détails. Utilise plusieurs fois l'outil de recherche dans la doc. 

L'id de cette librairie est `reactflow.dev`et `/xyflow/reactflow` pour la doc.