# ArandaTestFront

Este proyecto se genero usando [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1.

## Development server

Clona el repositorio 
git clone https://github.com/RoinerGomez98/ArandaTest.Front.git

Ejecuta

```bash
npm i
```
En caso de que visual studio genere un puerto diferente al  5032  cambialo en  src=> environments => environments.ts o environment.development.ts
```bash
export const environment = {
    production: false,
    Url: 'http://localhost:5032'
};
```
despues ejecuta para iniciar la aplicacion
```bash
ng s -o
```

Una vez que el servidor esté funcionando, abra su navegador y navegue hasta `http://localhost:4200/`. La aplicación se recarga automáticamente en cuanto cambias uno de los archivos fuente.

