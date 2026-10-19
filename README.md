# StoreFlow Studio

Vue 3 + TypeScript + Tailwind CSS. Esta es la copia fuente activa del frontend StoreFlow Studio.
La lógica de autenticación y espacios está en src/composables/useStoreFlow.ts.

## Desarrollo con XAMPP

1. Inicia Apache y MySQL y confirma que la API PHP exista en http://localhost/store/backend_store/public/index.php.
2. Ejecuta npm install y npm run dev desde esta carpeta.
3. Vite reenvía /store a Apache. El registro y el guardado requieren la API PHP y la base hu_schema.

## Publicar

npm run build verifica tipos, compila Tailwind y publica los archivos en la raíz del proyecto.
Abre http://localhost/CodigoModelos/ al publicar en XAMPP.

## API por entorno

- .env.development y .env.production: URL relativa a /store/backend_store/public/index.php. Si publicas el API en otro host, cambia VITE_API_BASE_URL por su URL y configura CORS en PHP.
- .env.example: referencia de configuración. Las variables VITE_* son visibles en el navegador; no guardes contraseñas ni llaves privadas aquí.
