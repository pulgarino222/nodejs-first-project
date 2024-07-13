# nodejs-first-project


# Node.js Kick-off Workshop: Proyecto Real

## Introducción
Bienvenidos al proyecto de introducción a Node.js. Este proyecto está diseñado para aplicar los conceptos básicos de Node.js y Express que has aprendido durante la primera semana del curso. Crearás una API RESTful que interactúa con el sistema de archivos en lugar de una base de datos.

## Instrucciones de Entrega
1. Crea un repositorio en GitHub llamado `nodejs-first-project`.
2. Sigue las instrucciones y completa los objetivos establecidos en este documento.
3. Sube tu proyecto a GitHub y comparte el enlace del repositorio.

## Objetivos
- Configurar un entorno de desarrollo Node.js.
- Crear un servidor web utilizando Node.js y Express.
- Implementar rutas y middlewares en Express.
- Leer y escribir datos en el sistema de archivos utilizando el módulo `fs`.
- Manejar errores y asegurar la API con middlewares.

## Descripción del Proyecto
Crearás una API RESTful para gestionar una lista de tareas (To-Do List). Las tareas se almacenarán en un archivo JSON en el sistema de archivos.

## Historias de Usuario

### 1. Como usuario, quiero poder crear una nueva tarea para agregarla a mi lista de tareas.
- **Ruta:** POST `/tasks`
- **Cuerpo de la solicitud:**
  ```json
  {
    "title": "Nombre de la tarea",
    "description": "Descripción de la tarea"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Tarea creada exitosamente",
    "task": {
      "id": 1,
      "title": "Nombre de la tarea",
      "description": "Descripción de la tarea"
    }
  }
  ```

### 2. Como usuario, quiero poder ver todas mis tareas para revisarlas.
- **Ruta:** GET `/tasks`
- **Respuesta:**
  ```json
  [
    {
      "id": 1,
      "title": "Nombre de la tarea",
      "description": "Descripción de la tarea"
    },
    ...
  ]
  ```

### 3. Como usuario, quiero poder ver una tarea específica por su ID para conocer sus detalles.
- **Ruta:** GET `/tasks/:id`
- **Respuesta:**
  ```json
  {
    "id": 1,
    "title": "Nombre de la tarea",
    "description": "Descripción de la tarea"
  }
  ```

### 4. Como usuario, quiero poder actualizar una tarea existente para modificar su información.
- **Ruta:** PUT `/tasks/:id`
- **Cuerpo de la solicitud:**
  ```json
  {
    "title": "Nuevo nombre de la tarea",
    "description": "Nueva descripción de la tarea"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Tarea actualizada exitosamente",
    "task": {
      "id": 1,
      "title": "Nuevo nombre de la tarea",
      "description": "Nueva descripción de la tarea"
    }
  }
  ```

### 5. Como usuario, quiero poder eliminar una tarea para mantener mi lista organizada.
- **Ruta:** DELETE `/tasks/:id`
- **Respuesta:**
  ```json
  {
    "message": "Tarea eliminada exitosamente"
  }
  ```

## Requisitos del Proyecto

### 1. Configuración del Entorno
- Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/). Recomendamos la versión LTS.
- Verifica la instalación con los siguientes comandos:
  ```sh
  node -v
  npm -v
  ```

### 2. Inicialización del Proyecto
- Inicia un nuevo proyecto Node.js:
  ```sh
  mkdir nodejs-first-project
  cd nodejs-first-project
  npm init -y
  ```

### 3. Instalación de Dependencias
- Instala Express:
  ```sh
  npm install express
  ```

### 4. Creación de la API RESTful

#### Estructura del Proyecto
```
nodejs-first-project/
├── data/
│   └── tasks.json
├── src/
│   ├── routes/
│   │   └── tasks.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   └── app.js
├── package.json
└── index.js
```

#### 1. Crear el archivo `tasks.json`
- Crea la carpeta `data` y el archivo `tasks.json`:
  ```sh
  mkdir data
  echo "[]" > data/tasks.json
  ```

#### 2. Crear el Servidor con Express
- Crea la carpeta `src` y el archivo `app.js`:
  ```js
  const express = require("express"); // Importamos Express
  const tasksRoutes = require("./routes/tasks"); // Importamos las rutas de la API
  const errorHandler = require("./middlewares/errorHandler"); // Importamos el middleware para manejo de errores

  const app = express(); // Instanciamos Express
  const PORT = 3000; // Puerto del servidor en donde se ejecutará la API

  app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes en formato JSON. Tambien conocido como middleware de aplicación.
  app.use("/tasks", tasksRoutes); // Middleware para manejar las rutas de la API. Tambien conocido como middleware de montaje o de enrutamiento.
  app.use(errorHandler); // Middleware para manejar errores.

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
  ```

#### 3. Crear las Rutas de la API
- Crea la carpeta `routes` y el archivo `tasks.js`:
  ```js
  const express = require("express");
  const fs = require("fs");
  const path = require("path");

  const router = express.Router();
  const tasksFilePath = path.join(__dirname, "../../data/tasks.json");

  // Leer tareas desde el archivo
  const readTasks = () => {
    const tasksData = fs.readFileSync(tasksFilePath); // Leer el archivo. Este poderoso metodo nos permite leer archivos de manera sincrona.
    return JSON.parse(tasksData); // Retornar los datos en formato JSON.
  };

  // Escribir tareas en el archivo
  const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2)); // Escribir los datos en el archivo. Este poderoso metodo nos permite escribir archivos de manera sincrona.
  };

  // Crear una nueva tarea
  router.post("/", (req, res) => {
    const tasks = readTasks();
    const newTask = {
      id: tasks.length + 1, // simulamos un id autoincrementable
      title: req.body.title, // obtenemos el titulo de la tarea desde el cuerpo de la solicitud
      description: req.body.description, // obtenemos la descripcion de la tarea desde el cuerpo de la solicitud
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json({ message: "Tarea creada exitosamente", task: newTask });
  });

  // Obtener todas las tareas
  router.get("/", (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
  });

  // Obtener una tarea por ID
  router.get("/:id", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.json(task);
  });

  // Actualizar una tarea por ID
  router.put("/:id", (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    const updatedTask = {
      ...tasks[taskIndex],
      title: req.body.title,
      description: req.body.description,
    };
    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);
    res.json({ message: "Tarea actualizada exitosamente", task: updatedTask });
  });

  // Eliminar una tarea por ID
  router.delete("/:id", (req, res) => {
    const tasks = readTasks();
    const newTasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
    if (tasks.length === newTasks.length) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    writeTasks(newTasks);
    res.json({ message: "Tarea eliminada exitosamente" });
  });

  module.exports = router;
  ```

#### 4. Crear Middleware para Manejo de Errores
- Crea la carpeta `middlewares` y el archivo `errorHandler.js`:
  ```js
  const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Ocurrió un error en el servidor" });
  };

  module.exports = errorHandler;
  ```

#### 5. Archivo de Entrada del Proyecto
- Crea el archivo `index.js` en la raíz del proyecto:
  ```js
  require("./src/app");
  ```

## 5. Ejecución del Proyecto
- Ejecuta el proyecto con el siguiente comando:
  ```sh
  node index.js
  ```

- Deberás ver un mensaje similar al siguiente:
  ```
  Server running at http://localhost:3000/
  ```

- Abre tu navegador y accede a [http://localhost:3000/tasks](http://localhost:3000/tasks) para probar la API.

## 6. Probando la API (Ejemplo con POST)

Para probar nuestra API, podemos utilizar herramientas como [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/). Descarga e instala una de estas aplicaciones para realizar las siguientes pruebas.

Para este ejemplo, consideraremos que estamos utilizando Postman. Una vez descargado e instalado, sigue los pasos a continuación:

1. Abre Postman y encontrarás una interfaz similar a la siguiente:

<img src="./assets/postman_1.png" alt="Postman" width="500">

2. Le daremos click al boton `new` para crear una colección de peticiones. 

3. Se nos abrirá una venta donde elegiremos colección. En postman, las colecciones son grupos de peticiones que se pueden ejecutar juntas. Es mas que todo para organizar las peticiones que haremos a nuestra API y poder compartirlas con otros desarrolladores.

<img src="./assets/postman_2.png" alt="Postman" width="500">

4. Le damos un nombre a nuestra colección, en este caso `Node.js Kick-off Project`. A este punto puedes indagar más sobre funcionalidades de postman como variables de entorno, autenticación, etc. Te dejaré un link a la documentación oficial de postman [aquí](https://learning.postman.com/docs/getting-started/introduction/). Y un video de youtube que explica como usar postman mas a profundidad [aquí](https://www.youtube.com/watch?v=iFDQ3NFs95M&list=PLDbrnXa6SAzUsLG1gjECgFYLSZDov09fO).

<img src="./assets/postman_3.png" alt="Postman" width="500">

<img src="./assets/postman_4.png" alt="Postman" width="500">

5. Ahora crearemos una petición para crear una tarea. Para ello, le daremos click al boton `...` que se encuentra al lado de la colección que acabamos de crear y seleccionaremos `Add request`.

<img src="./assets/postman_5.png" alt="Postman" width="500">

6. Se nos abrirá una ventana donde podremos configurar nuestra petición. Le daremos un nombre a nuestra petición, en este caso `Create Task`. En el campo `Request URL` colocaremos la dirección de nuestra API, en este caso `http://localhost:3000/tasks`. En el campo `Request type` seleccionaremos `POST`. En el campo `Body` seleccionaremos `raw` y en el tipo de dato seleccionaremos `JSON` y en el campo inferior colocaremos el siguiente JSON:

```json
{
  "title": "Comprar leche",
  "description": "Ir al supermercado y comprar leche"
}
```

<img src="./assets/postman_6.png" alt="Postman" width="500">

<img src="./assets/postman_7.png" alt="Postman" width="500">

7. Ahora le daremos click al boton `Send` y veremos la respuesta de nuestra API.

<img src="./assets/postman_8.png" alt="Postman" width="500">

A este punto, ya debes suponer que el archivo `tasks.json` creado en la carpeta `data` contiene la tarea que acabamos de crear. 

<img src="./assets/tasks.json_1.png" alt="Postman" width="500">

Si no ves una respuesta similar a la que se muestra en la imagen, es posible que haya un error en tu código. Revisa el paso a paso y asegúrate de que todo esté configurado correctamente.

## 7. Probando la API (Resto de Verbos HTTP)

Como trabajo autonomo, prueba el resto de los verbos HTTP que se mencionan en las historias de usuario los cuales son:

- GET `/tasks`
- ![Captura desde 2024-07-12 19-07-37](https://github.com/user-attachments/assets/ef45b011-0183-45a7-bb37-62de518a9eda)
- GET `/tasks/:id`
- PUT `/tasks/:id`
- ![Captura desde 2024-07-12 19-20-27](https://github.com/user-attachments/assets/b05b02a8-16ca-449a-9a4c-cf314163d0ca)
- DELETE `/tasks/:id`
![Captura desde 2024-07-12 19-24-41](https://github.com/user-attachments/assets/347f9d9d-3d27-4d75-a314-d227108d63b8)


## 8. Preguntas de Reflexión y trabajo investigativo

1. ¿Qué es el filesystem (fs) en Node.js y para qué se utiliza?
 el módulo fs en Node.js es como un conjunto de herramientas que te permite interactuar con los archivos y carpetas en tu computadora desde tu código JavaScript. Piénsalo como una caja de herramientas que Node.js te proporciona para leer, escribir, crear y borrar archivos, así como para gestionar directorios.

Por ejemplo, con el módulo fs, puedes escribir un programa en Node.js que lea el contenido de un archivo, lo modifique y luego lo guarde de nuevo. También puedes crear nuevas carpetas, verificar si un archivo existe, cambiar permisos de archivo, y muchas otras cosas relacionadas con la manipulación de archivos y directorios.

Es especialmente útil en aplicaciones donde necesitas leer o escribir archivos desde el disco, como bases de datos locales, sistemas de gestión de archivos, o cualquier otra aplicación que necesite interactuar con archivos y directorios en el sistema operativo donde se ejecuta Node.js.

En resumen, fs es como tu asistente para manejar archivos desde Node.js, dándote las herramientas necesarias para trabajar con el sistema de archivos de manera eficiente y segura.
2. ¿Qué es un middleware en Express y cuál es su propósito?

un middleware es como un ayudante que procesa las solicitudes que llegan al servidor antes de que realmente se responda a esas solicitudes. Imagina que tienes un restaurante y cada mesero representa un middleware. Cuando un cliente hace un pedido, el mesero (middleware) puede hacer cosas como verificar si el cliente está autorizado para pedir, registrar qué pedido se hizo, o incluso modificar el plato antes de que llegue a la mesa.

Entonces, el propósito principal de los middlewares en Express es manejar diferentes aspectos de cada solicitud HTTP. Pueden realizar tareas como autenticar usuarios, registrar datos importantes, modificar la respuesta que se envía de vuelta al cliente, o simplemente asegurarse de que todo esté en orden antes de que la solicitud termine su camino.

En resumen, los middlewares en Express son como los empleados dedicados a garantizar que cada solicitud sea manejada de manera adecuada y eficiente, asegurándose de que todo funcione sin problemas en tu aplicación web.


3. ¿Qué es un endpoint en una API RESTful y cuál es su función?
  en una API RESTful, un "endpoint" es como la dirección específica de un recurso, similar a una dirección en un mapa que te lleva a un lugar específico. Cada endpoint define dónde y cómo puedes interactuar con los datos dentro de esa API.

Imagina que estás en una tienda en línea y cada producto tiene una etiqueta con un código de barras. Cada código de barras es como un endpoint en la API de la tienda. Escaneando el código, puedes ver detalles del producto, agregarlo al carrito, actualizar su cantidad o incluso eliminarlo.

Entonces, la función principal de un endpoint es proporcionar un camino claro y definido para que las aplicaciones (o los clientes) se comuniquen con la API. Los endpoints permiten realizar operaciones como obtener datos, crear nuevos registros, actualizar información existente o eliminar registros, todo utilizando métodos estándar de HTTP como obtener (GET), crear (POST), actualizar (PUT), y eliminar (DELETE).

En resumen, los endpoints en una API RESTful actúan como los accesos directos que te permiten interactuar y gestionar los datos de manera efectiva a través de internet, siguiendo un conjunto de reglas y direcciones bien definidas.
4. ¿Qué son los verbos HTTP y cuáles son los más comunes?
  los verbos HTTP son como instrucciones que usamos al navegar por internet para interactuar con diferentes partes de un sitio web o una aplicación. Cada verbo describe qué tipo de acción queremos realizar sobre un recurso específico que está en un servidor.

    GET: Es como pedir ver algo. Por ejemplo, cuando abres una página web o consultas el perfil de un usuario en redes sociales, estás usando el verbo GET para obtener esa información.

    POST: Lo usamos para enviar datos nuevos al servidor. Por ejemplo, cuando publicas una foto en redes sociales o llenas un formulario en línea para realizar una compra, estás usando POST para enviar esa información al servidor.

    PUT: Es para actualizar algo que ya existe. Por ejemplo, si editas tu perfil en una aplicación o ajustas los detalles de un producto en un carrito de compras en línea, estás usando PUT para actualizar esos datos.

    DELETE: Lo usamos para eliminar algo. Por ejemplo, si borras un mensaje de correo electrónico o eliminas una publicación en redes sociales, estás usando DELETE para quitar ese contenido del servidor.

    PATCH: Similar a PUT, pero se usa cuando quieres hacer cambios parciales en algo sin necesidad de enviar toda la información. Por ejemplo, si solo actualizas la dirección de envío en tu perfil de compras en línea, podrías usar PATCH.

    HEAD: Es como hacer una solicitud de información sin realmente obtener el contenido completo. Por ejemplo, cuando un navegador web solicita los encabezados de una página sin cargar toda la página, está usando HEAD.

    OPTIONS: Sirve para preguntar qué opciones están disponibles en un recurso. Por ejemplo, si quieres saber qué métodos y funciones puedes usar en una API, podrías usar OPTIONS para obtener esa información.

Estos verbos son esenciales para comunicarnos con los servidores web y realizar acciones específicas sobre los datos que manejamos en internet.

5. ¿Qué es JSON y por qué es utilizado en las API RESTful?
6. En lo que respecta al envio de datos a lo largo de los verbos http responde:
    - ¿Qué es el body de una petición?
    - ¿Qué es el body de una respuesta?
    - ¿Qué es el query de una petición?
    - ¿Qué es el params de una petición?
7. En lo que respecta al verbo POST responde:
    - ¿Qué es un verbo POST y cuál es su propósito?
    - ¿Cuándo se utiliza un verbo POST?
    - ¿En qué se diferencia un verbo POST de los otros verbos HTTP como GET, PUT y DELETE?
    - ¿Como se envian datos en un verbo POST?
8. En lo que respecta al verbo GET responde:
    - ¿Qué es un verbo GET y cuál es su propósito?
    - ¿Cuándo se utiliza un verbo GET?
    - ¿En qué se diferencia un verbo GET de los otros verbos HTTP como POST, PUT y DELETE?
9. En lo que respecta al verbo PUT responde:
    - ¿Qué es un verbo PUT y cuál es su propósito?
    - ¿Cuándo se utiliza un verbo PUT?
    - ¿En qué se diferencia un verbo PUT de los otros verbos HTTP como POST, GET y DELETE?
10. En lo que respecta al verbo DELETE responde:
    - ¿Qué es un verbo DELETE y cuál es su propósito?
    - ¿Cuándo se utiliza un verbo DELETE?
    - ¿En qué se diferencia un verbo DELETE de los otros verbos HTTP como POST, GET y PUT?
11. ¿Qué es un status code y cuáles son los más comunes?
12. ¿Cuales son los status code mas comunes para el verbo POST?
13. ¿Cuales son los status code mas comunes para el verbo GET?
14. ¿Cuales son los status code mas comunes para el verbo PUT?
15. ¿Cuales son los status code mas comunes para el verbo DELETE?
