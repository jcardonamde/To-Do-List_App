
# To-Do List App

Este proyecto es una aplicación de lista de tareas (To-Do List) construida con Ionic, Angular y Firebase. Permite a los usuarios crear, gestionar y completar tareas, así como gestionar categorías. La aplicación también utiliza Firebase Remote Config para activar o desactivar funciones de la interfaz de usuario, como la visibilidad del logotipo.


## Características
- **Gestión de tareas**: Crear, marcar y eliminar tareas.
- **Gestión de categorías**: Crear, editar y eliminar categorías de tareas.
- **Firebase Integration**: Incluye Firebase Remote Config para controlar funciones de la interfaz.
- **Multiplataforma**: Compilable para Android e iOS utilizando Cordova.

## Requisitos Previos
- Node.js (versión recomendada: 20.17.0)
- NPM (versión recomendada: 10.8.1)
- Angular CLI (versión recomendada: 18.2.1)
- Ionic CLI (versión recomendada: 7.x)
- Cordova CLI
- SDK de Android para la compilación en Android
- Xcode para la compilación en iOS (solo macOS)
## Instalación

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/jcardonamde/To-Do-List_App.git
   cd todo-app

2. **Instalar Dependencias**
    ```bash
    npm install

3. **Configurar Firebase**
- Crear un proyecto en Firebase.
- Copiar la configuración de Firebase en el archivo src/environments/environment.ts y src/environments/environment.prod.ts
    ```bash
    export const environment = {
        production: false,
        firebaseConfig: {
            apiKey: "TU_API_KEY",
            authDomain: "TU_AUTH_DOMAIN",
            projectId: "TU_PROJECT_ID",
            storageBucket: "TU_STORAGE_BUCKET",
            messagingSenderId: "TU_MESSAGING_SENDER_ID",
            appId: "TU_APP_ID"
        }
    };

4. **Iniciar el Servidor de Desarrollo**
    ```bash
    ionic serve
## Demo

- Video explicación de las funcionalidades de la App: 
https://www.youtube.com/watch?v=IgBDQb5Y-rQ



- Deploy de la App en el Hosting de firebase:
https://todo-list-app-4cd44.web.app/home


- Instaladores:
[Google Drive](https://drive.google.com/drive/folders/1Lb-yVOapp42sM9mZ25LdaAzfGlBdW_yP?usp=sharing)

## Screenshots

![App Screenshot](https://docs.google.com/drawings/d/13ZeSU9IMcefwaeJQsXjvFa1TS31F3NNpLACyWR7wdrw/pub?w=960&h=720)

![App Screenshot](https://docs.google.com/drawings/d/1kkUhv_ysM6Kjs32T9BA-DgWHGkKrmRQgyaMJMHHUba4/pub?w=960&h=720)

![App Screenshot](https://docs.google.com/drawings/d/1Sj9j-64syQ1xo6-Eaj35K7Bd1NlRDGimGdkv0TzmZmE/pub?w=928&h=468)

![App Screenshot](https://docs.google.com/drawings/d/1e6IU7F6FL3TD1ICwzyXHN1M5sygv3N3vgtF7ubq6Alc/pub?w=928&h=465)
## Deployment

### Compilación para Android

1. **Agregar la Plataforma Android**
    ```bash
    ionic cordova platform add android
    ```

2. **Compilar el APK**
    ```bash
    ionic cordova build android

    ```

3. **Ubicación del APK** 
El APK generado estará en la carpeta
platforms/android/app/build/outputs/apk.


### Compilación para iOS

1. **Agregar la Plataforma iOS**
    ```bash
    ionic cordova platform add ios
    ```

2. **Abrir el Proyecto en Xcode**
    ```bash
    ionic cordova build ios
    ```

3. **Luego abre el proyecto en Xcode:**
    ```bash
    open platforms/ios/YourAppName.xcworkspace
    ```

4. **Compilar y Ejecutar**
- Configurar un simulador o un dispositivo físico.
- Compilar y ejecutar la aplicación desde Xcode.

### Configuración de Remote Config con Firebase

1. **Acceder a Firebase Remote Config**
- Ve a la consola de Firebase.
- Navega a Remote Config.


2. **Agregar el Parámetro enableLogo**
- Crear un nuevo parámetro llamado enableLogo.
- Asignar el valor true o false según se quiera mostrar o no el logo en la aplicación.

3. **Uso en la Aplicación**
El valor de enableLogo se utilizará en la aplicación para determinar si se muestra el logotipo en la interfaz.


### Despliegue en Firebase Hosting

1. **Instalar Firebase CLI**
  ```bash
    npm install -g firebase-tools
  ```

2. **Iniciar Sesión en Firebase**
  ```bash
    firebase login
  ```

3. **Inicializar Firebase Hosting**
  ```bash
    firebase init
  ```

4. **Desplegar la Aplicación**
  ```bash
    firebase deploy
  ```



### Notas Adicionales
- Si estás utilizando un sistema operativo Windows, asegúrate de que las variables de entorno de Android SDK estén configuradas correctamente.
- En macOS, para la compilación en iOS, Xcode debe estar instalado y actualizado a la última versión.
## Running Tests

1. **Ejecutar Tests**
    ```bash
    npm run test
    ```

2. Ver Resultados de los Tests Los resultados de los tests se mostrarán en la consola o en el navegador si está configurado para ejecutar en un entorno gráfico.
## FAQ

#### ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?

Uno de los desafíos principales fue la integración de Firebase Remote Config. Asegurar que la configuración remota se activara y se aplicara correctamente en la aplicación fue un aspecto clave, especialmente al manejar la carga inicial de la configuración y asegurar que los valores se aplicaran sin causar retrasos en la interfaz de usuario.

Otro desafío fue la gestión de las dependencias y la compilación para plataformas móviles (Android e iOS). La migración entre Capacitor y Cordova también presentó desafíos técnicos que requirieron una reorganización del proyecto para cumplir con los requisitos de la prueba técnica.

#### ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

Implementé Virtual Scrolling en la lista de tareas para manejar grandes volúmenes de datos sin afectar el rendimiento de la aplicación. Esta técnica mejora significativamente la fluidez de la interfaz cuando se manejan listas largas, asegurando que solo los elementos visibles se rendericen en el DOM en un momento dado.

También optimicé la carga de recursos y datos a través del uso de ChangeDetectorRef, lo que ayuda a reducir la carga innecesaria de la interfaz y permite un manejo más eficiente de los cambios en el estado de la aplicación.


#### ¿Cómo aseguraste la calidad y mantenibilidad del código?

Para asegurar la calidad y mantenibilidad del código, seguí buenas prácticas como la separación de responsabilidades, creando servicios específicos para la gestión de tareas y categorías. Utilicé el patrón de diseño Model-View-Service para mantener el código organizado y modular.

Además, implementé pruebas unitarias para validar las funciones clave de la aplicación, lo que ayuda a detectar problemas antes de que lleguen a producción. 

La documentación y los comentarios en el código también se mantuvieron actualizados para facilitar el trabajo de futuros desarrolladores.
## Autor

- [@jcardonamde](https://github.com/jcardonamde)
- [LinkedIn](https://www.linkedin.com/in/jonathan-cardona-calderon-co/)

