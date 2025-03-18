
## 🚀 IMSSB-Tasks

Este repositorio es **una prueba de concepto** y se encuentra disponible públicamente para fines de transparencia. **No representa un desarrollo oficial de IMSS Bienestar**.

El propósito de este proyecto es explorar soluciones tecnológicas para la gestión de tareas en el ámbito de TI dentro de la institución. **Cualquier implementación a nivel gubernamental de este repositorio requeriría un proceso de autorización formal conforme a los mecanismos establecidos a nivel federal.**

📌 **Nota:** Este código está licenciado bajo la licencia MIT, lo que permite su uso, modificación y distribución bajo los términos especificados en el archivo [LICENSE](LICENSE).


## Versiones usadas:
- Angular 19.2.3
- Node 22.14.0
- NPM 11.2.0


## Así se creó el proyecto desde cero:

- Instalar Docker Desktop en la PC 
- Se creó manualmente folder /IMSSB-Tasks 
- Se creó manualmente folder /IMSSB-Tasks/client
- Se creó manualmente folder /IMSSB-Tasks/server


### Frontend steps (/IMSSB-Tasks/client) 

```
ng new imssb-tasks --skip-git --directory ./ 
```
el --skip-git es debido a que en este repo conviven backend y frontend

### Backend steps (/IMSSB-Tasks/server) 

```
npm init 
```

y dar enter a todas las preguntas. Después ejecutar:

```
npm install nodemon -D
npm install ts-node -D
npm install express
npm install mongoose
npm install socket.io
npm install @types/express -D
npm install @types/node -D
npm install validator 
npm install @types/validator -D
npm install bcryptjs
npm install @types/bcryptjs
```

con "-D" significa que estas dependencias solo son usadas en Desarrollo.

- nodemon sirve para que se recargue el servidor cada que se modifica el c贸digo (tal como lo hace Angular de forma predeterminada)
- ts-node permite ejecutar archivos TypeScript sin necesidad de compilarlos previamente a JavaScript. Esto hace que el desarrollo sea más rápido y eficiente. 
- express es un framework para nodejs que permite crear servidores web, usar middleware, rutas e integracion con base de datos.
- mongoose es una herramienta para trabajar con MongoDB el cual se describe mas adelante.
- socket.io sirve para aplicaciones que requieren comunicacion bidireccional en tiempo real entre servidor y cliente.
- @types/express es esencial para desarrollar aplicaciones Express con Typescript
- @types/node proporciona definiciones de tipos para Node.js, permitiendo a los desarrolladores usar TypeScript con Node.js de manera más efectiva.
- validator es una biblioteca de validación (correos, urls, telefonos, etc) y sanitización de cadenas de texto en JavaScript.
- @types/validator proporciona definiciones de tipos para TypeScript para el paquete validator
- bcryptjs es una biblioteca de JavaScript que se utiliza para hashing de contraseñas.
- @types/bcryptjs proporciona definiciones de tipos para TypeScript para el paquete bcryptjs

el archivo package.json > "scripts" remover el nodo "test" y escribir algo como:

```
"scripts": {
    "start": "nodemon src/server.ts"
  },
```

ahora, en raiz de /server crear archivo "tsconfig.json" con el contenido siguiente:
```
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",        
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "esModuleInterop": true,
        "strict": true,
    }
}
```

Esto es lo que hace el archivo:

- module: "commonjs" especifica el sistema de módulos que se utilizará. CommonJS es el sistema de módulos estándar en Node.js.
- target: "es6" define la versión de JavaScript a la que se transpilará el código TypeScript. ES6 (ECMAScript 2015) incluye características modernas de JavaScript.
- moduleResolution: "node" indica cómo resolver los módulos. La resolución de módulos de Node busca en node_modules y sigue las reglas de importación de Node.js.
- sourceMap: true genera archivos de mapa de origen (.map) que ayudan a depurar el código TypeScript en el navegador o en herramientas de desarrollo.
- outDir: "dist" especifica el directorio donde se colocarán los archivos JavaScript generados después de la compilación.
- esModuleInterop: true permite la interoperabilidad entre módulos ES y CommonJS, facilitando la importación de módulos.
- strict: true habilita todas las verificaciones estrictas de TypeScript, lo que ayuda a detectar errores potenciales y mejorar la calidad del código.

Crear folder /src 

Crear archivo "server.ts"

Abrir Docker, asegurarse estar logueado con cuenta docker.
		- Ir a docker hub y buscar por contenedor por palabra clave "mongo"
		- una vez hallada la imagen oficial de mongo para docker hacer click en boton RUN
		- nombrar al contenedor "mongodb" en puerto 27017 y ejecutar
		





