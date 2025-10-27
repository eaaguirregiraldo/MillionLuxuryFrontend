# Million Luxury - Frontend (React)

Proyecto frontend para el Technical Test - SR Frontend Developer.

Descripción rápida
- Cliente React que consume las APIs del backend ya corriendo localmente.
- Implementa filtros (name, address, price range), listado, vista detalle y eliminación.

Requisitos previos
- Node.js 18+ y npm o yarn
- Backend corriendo en local (se espera baseUrl en .env o por defecto http://localhost:5000)

Instalación y ejecución
1. Instala dependencias:

```bash
cd MillionLuxuryFrontend
npm install
```

2. Ejecuta en modo desarrollo:

```bash
npm run dev
```

3. Visita http://localhost:5173 (por defecto Vite)

Configuración de la API
- Puedes especificar la base URL del backend con la variable de entorno REACT_APP_API_BASE_URL. Ejemplo:

```bash
REACT_APP_API_BASE_URL=http://localhost:5000 npm run dev
```

Export/backup de MongoDB (sugerencia)
- Para exportar la colección de propiedades a un archivo JSON:

```bash
mongoexport --uri="mongodb://<user>:<pass>@localhost:27017/<db>" --collection=properties --out=properties_backup.json
```

Entrega / subida a GitHub
- Para subir a GitHub: crea un nuevo repo e "push". Para dar acceso a los correos pedidos (crios@millionluxury.com) agrega como colaboradores o miembros del repo.

Notas
- El backend no es parte de este paquete porque ya corre localmente según tu nota. El frontend asume los endpoints expuestos:
  - GET /api/properties (con query params: name, address, minPrice, maxPrice, page, pageSize)
  - GET /api/properties/{id}
  - DELETE /api/properties/{id}
- **Paginación**: El frontend solicita 10 registros por página. El backend debe responder con:
  - Formato esperado: `{ items: [...], total: N }` o `{ properties: [...], total: N }`
  - Si el backend devuelve un array simple, se asume una sola página.
- Todos los datos recibidos del backend se muestran en la consola del navegador para debugging.
