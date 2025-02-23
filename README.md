# README - Aplicación Angular

## Configuración y ejecución

### Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (última versión recomendada)
- [Angular CLI](https://angular.io/cli)

### Instalación del proyecto
1. **Clona el repositorio**
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd angular-app
   ```
2. **Instala las dependencias**
   ```sh
   npm install
   ```
3. **Configura las variables de entorno**
   - Crea un archivo `.env` en la raíz del proyecto y copia el contenido de `.env.example`, reemplazando los valores correspondientes.

### Archivo .env.example
```env
BASE_URL=http://localhost:3000
```

4. **Ejecuta la aplicación en modo desarrollo**
   ```sh
   ng serve
   ```

## Funcionalidades principales

### Usuarios

#### Listado de usuarios
![Listado de usuarios](https://res.cloudinary.com/drx14kwqo/image/upload/v1740277475/Screenshot_20250222_212112_rgft0x.png)

#### Crear usuario
![Crear usuario](https://res.cloudinary.com/drx14kwqo/image/upload/v1740277634/Screenshot_20250222_212653_gf78eq.png)

#### Eliminar usuario
Los usuarios pueden ser eliminados desde la interfaz.

---

### Transacciones

#### Historial de transacciones
![Historial de transacciones](https://res.cloudinary.com/drx14kwqo/image/upload/v1740277475/Screenshot_20250222_212239_doomue.png)

#### Crear una transacción (depósito o retiro)
![Crear transacción](https://res.cloudinary.com/drx14kwqo/image/upload/v1740277475/Screenshot_20250222_212308_bm4vro.png)

## Notas
- La aplicación se ejecutará en `http://localhost:4200/` por defecto.
- Se conecta al backend configurado en `BASE_URL`.

