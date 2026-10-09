# StoreFlow Studio

Vue 3 + TypeScript + Tailwind CSS, creado sobre el scaffold oficial de npm create vue@latest.
La pantalla y los flujos siguen la referencia ../index.legacy.html; las interacciones usan Vue y la lógica del espacio está en src/composables/useStoreFlow.ts.

## Desarrollo con XAMPP

1. Inicia Apache y MySQL.
2. Ejecuta npm install y npm run dev desde esta carpeta.
3. Vite reenvía /store a Apache.

## Publicar

npm run build verifica tipos, compila Tailwind y publica los archivos en la raíz del proyecto.
Abre http://localhost/CodigoModelos/ al publicar en XAMPP.

## API por entorno

- .env.development: URL relativa para XAMPP local.
- .env.production: URL relativa al mismo servidor. Si publicas el API en otro host, cambia VITE_API_BASE_URL por su URL y configura CORS en PHP.
- .env.example: referencia de configuración. Las variables VITE_* son visibles en el navegador; no guardes contraseñas ni llaves privadas aquí.
