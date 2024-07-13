# nodejs-first-project


# Node.js Kick-off Workshop: Proyecto Real

## Introducción
Bienvenidos al proyecto de introducción a Node.js. Este proyecto está diseñado para aplicar los conceptos básicos de Node.js y Express que has aprendido durante la primera semana del curso. Crearás una API RESTful que interactúa con el sistema de archivos en lugar de una base de datos.

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

##1. ¿Qué es el filesystem (fs) en Node.js y para qué se utiliza?
 el módulo fs en Node.js es como un conjunto de herramientas que te permite interactuar con los archivos y carpetas en tu computadora desde tu código JavaScript. Piénsalo como una caja de herramientas que Node.js te proporciona para leer, escribir, crear y borrar archivos, así como para gestionar directorios.

Por ejemplo, con el módulo fs, puedes escribir un programa en Node.js que lea el contenido de un archivo, lo modifique y luego lo guarde de nuevo. También puedes crear nuevas carpetas, verificar si un archivo existe, cambiar permisos de archivo, y muchas otras cosas relacionadas con la manipulación de archivos y directorios.

Es especialmente útil en aplicaciones donde necesitas leer o escribir archivos desde el disco, como bases de datos locales, sistemas de gestión de archivos, o cualquier otra aplicación que necesite interactuar con archivos y directorios en el sistema operativo donde se ejecuta Node.js.

En resumen, fs es como tu asistente para manejar archivos desde Node.js, dándote las herramientas necesarias para trabajar con el sistema de archivos de manera eficiente y segura.
##2. ¿Qué es un middleware en Express y cuál es su propósito?

un middleware es como un ayudante que procesa las solicitudes que llegan al servidor antes de que realmente se responda a esas solicitudes. Imagina que tienes un restaurante y cada mesero representa un middleware. Cuando un cliente hace un pedido, el mesero (middleware) puede hacer cosas como verificar si el cliente está autorizado para pedir, registrar qué pedido se hizo, o incluso modificar el plato antes de que llegue a la mesa.

Entonces, el propósito principal de los middlewares en Express es manejar diferentes aspectos de cada solicitud HTTP. Pueden realizar tareas como autenticar usuarios, registrar datos importantes, modificar la respuesta que se envía de vuelta al cliente, o simplemente asegurarse de que todo esté en orden antes de que la solicitud termine su camino.

En resumen, los middlewares en Express son como los empleados dedicados a garantizar que cada solicitud sea manejada de manera adecuada y eficiente, asegurándose de que todo funcione sin problemas en tu aplicación web.


##3. ¿Qué es un endpoint en una API RESTful y cuál es su función?
  en una API RESTful, un "endpoint" es como la dirección específica de un recurso, similar a una dirección en un mapa que te lleva a un lugar específico. Cada endpoint define dónde y cómo puedes interactuar con los datos dentro de esa API.

Imagina que estás en una tienda en línea y cada producto tiene una etiqueta con un código de barras. Cada código de barras es como un endpoint en la API de la tienda. Escaneando el código, puedes ver detalles del producto, agregarlo al carrito, actualizar su cantidad o incluso eliminarlo.

Entonces, la función principal de un endpoint es proporcionar un camino claro y definido para que las aplicaciones (o los clientes) se comuniquen con la API. Los endpoints permiten realizar operaciones como obtener datos, crear nuevos registros, actualizar información existente o eliminar registros, todo utilizando métodos estándar de HTTP como obtener (GET), crear (POST), actualizar (PUT), y eliminar (DELETE).

En resumen, los endpoints en una API RESTful actúan como los accesos directos que te permiten interactuar y gestionar los datos de manera efectiva a través de internet, siguiendo un conjunto de reglas y direcciones bien definidas.



##4. ¿Qué son los verbos HTTP y cuáles son los más comunes?
  los verbos HTTP son como instrucciones que usamos al navegar por internet para interactuar con diferentes partes de un sitio web o una aplicación. Cada verbo describe qué tipo de acción queremos realizar sobre un recurso específico que está en un servidor.

    GET: Es como pedir ver algo. Por ejemplo, cuando abres una página web o consultas el perfil de un usuario en redes sociales, estás usando el verbo GET para obtener esa información.

    POST: Lo usamos para enviar datos nuevos al servidor. Por ejemplo, cuando publicas una foto en redes sociales o llenas un formulario en línea para realizar una compra, estás usando POST para enviar esa información al servidor.

    PUT: Es para actualizar algo que ya existe. Por ejemplo, si editas tu perfil en una aplicación o ajustas los detalles de un producto en un carrito de compras en línea, estás usando PUT para actualizar esos datos.

    DELETE: Lo usamos para eliminar algo. Por ejemplo, si borras un mensaje de correo electrónico o eliminas una publicación en redes sociales, estás usando DELETE para quitar ese contenido del servidor.

    PATCH: Similar a PUT, pero se usa cuando quieres hacer cambios parciales en algo sin necesidad de enviar toda la información. Por ejemplo, si solo actualizas la dirección de envío en tu perfil de compras en línea, podrías usar PATCH.

    HEAD: Es como hacer una solicitud de información sin realmente obtener el contenido completo. Por ejemplo, cuando un navegador web solicita los encabezados de una página sin cargar toda la página, está usando HEAD.

    OPTIONS: Sirve para preguntar qué opciones están disponibles en un recurso. Por ejemplo, si quieres saber qué métodos y funciones puedes usar en una API, podrías usar OPTIONS para obtener esa información.

Estos verbos son esenciales para comunicarnos con los servidores web y realizar acciones específicas sobre los datos que manejamos en internet.





##5. ¿Qué es JSON y por qué es utilizado en las API RESTful?
  Claro, JSON (JavaScript Object Notation) es como un formato de comunicación universal que usamos para enviar y recibir datos entre aplicaciones y servidores en internet. Es muy popular en las APIs RESTful por varias razones importantes:

1. **Simplicidad y Claridad:** JSON utiliza una estructura sencilla de pares clave-valor que es fácil de entender tanto para personas como para programas. Esto hace que sea muy accesible y legible.

2. **Compatibilidad Universal:** Puede ser utilizado por prácticamente cualquier lenguaje de programación moderno. Esto significa que diferentes sistemas pueden intercambiar datos sin importar qué lenguaje estén usando.

3. **Ideal para la Web:** Como está basado en texto, es ligero y eficiente para transmitir datos a través de la red. Esto es crucial para aplicaciones web que necesitan ser rápidas y responsivas.

4. **Integración Natural con JavaScript:** Dado que JSON es parte integral de JavaScript, es perfecto para aplicaciones web desarrolladas con tecnologías como React, Angular o Node.js. Esto facilita mucho el desarrollo de APIs y aplicaciones web completas.

5. **Flexibilidad en la Representación de Datos:** JSON permite representar datos complejos de manera estructurada usando objetos y arrays. Esto es ideal para APIs RESTful que manejan recursos con relaciones y datos diversos.

En resumen, JSON es fundamental en las APIs RESTful porque proporciona una forma simple, eficiente y universal de intercambiar datos entre clientes y servidores en la web, facilitando así la creación de aplicaciones modernas y conectadas.





##6. En lo que respecta al envio de datos a lo largo de los verbos http responde:
    - ¿Qué es el body de una petición?
    - ¿Qué es el body de una respuesta?
    - ¿Qué es el query de una petición?
    - ¿Qué es el params de una petición?



*. **Body de una petición (Request body)**:
   - El body de una petición HTTP es la parte que sigue a las cabeceras (headers) y contiene los datos que se envían al servidor. Es comúnmente utilizado en peticiones POST, PUT, PATCH, y DELETE para enviar datos al servidor, como por ejemplo en formularios, datos JSON, o archivos binarios. En términos de formato, puede ser texto plano, JSON, XML, entre otros.

*. **Body de una respuesta (Response body)**:
   - El body de una respuesta HTTP es la parte que sigue a las cabeceras de la respuesta y contiene los datos devueltos por el servidor. Estos datos pueden ser HTML (en el caso de respuestas de páginas web), JSON (en APIs RESTful), XML u otros formatos dependiendo de la aplicación y el tipo de solicitud realizada.

*. **Query de una petición (Query parameters)**:
   - El query de una petición se refiere a los parámetros que se envían en la URL de una solicitud HTTP GET. Estos parámetros son visibles en la propia URL después del signo de interrogación (`?`) y suelen tener la forma `clave=valor`. Por ejemplo, en la URL `https://example.com/search?q=term&page=2`, los query parameters son `q=term&page=2`.

*. **Params de una petición**:
   - Los params (parámetros) de una petición pueden referirse a diferentes cosas dependiendo del contexto:
     - En algunos frameworks de desarrollo web (como Express en Node.js), los params se refieren a los segmentos variables de la URL definidos en la ruta, por ejemplo, en la ruta `/users/:id`, el `:id` sería un parámetro.
     - En otros contextos, como en APIs RESTful, los params pueden referirse a parámetros adicionales que no son parte del path o del query, pero que se envían junto con la solicitud para modificar su comportamiento o contenido, a menudo en el body de la solicitud.

Es importante entender estos conceptos para manejar adecuadamente las solicitudes y respuestas HTTP y poder trabajar con datos de manera efectiva en aplicaciones web y APIs.

    


##7. En lo que respecta al verbo POST responde:
    - ¿Qué es un verbo POST y cuál es su propósito?
    - ¿Cuándo se utiliza un verbo POST?
    - ¿En qué se diferencia un verbo POST de los otros verbos HTTP como GET, PUT y DELETE?
    - ¿Como se envian datos en un verbo POST?



7.1. **¿Qué es un verbo POST y cuál es su propósito?**
   - POST es un verbo HTTP utilizado para enviar datos desde el cliente al servidor. Su propósito principal es enviar una entidad al recurso especificado, que puede ser procesada para almacenarla, actualizarla o realizar cualquier otra acción necesaria en el servidor.

7.2. **¿Cuándo se utiliza un verbo POST?**
   - POST se utiliza cuando se necesita enviar datos al servidor que no deben ser visibles en la URL (como en el caso de GET) y que pueden ser bastante largos o complejos. Es ideal para enviar datos sensibles o grandes, como formularios con muchos campos, archivos adjuntos, o cualquier otra información que se deba procesar en el servidor.

7.3. **¿En qué se diferencia un verbo POST de los otros verbos HTTP como GET, PUT y DELETE?**
   - **GET**: Se utiliza para solicitar datos del servidor y no debe tener ningún efecto secundario en el servidor. Es decir, debería ser una operación idempotente y segura.
   - **PUT**: Se utiliza para actualizar o crear un recurso en el servidor. Es idempotente, lo que significa que realizar la misma solicitud varias veces tendrá el mismo efecto.
   - **DELETE**: Se utiliza para eliminar un recurso específico en el servidor.
   - **POST**: A diferencia de GET, PUT y DELETE, POST no es idempotente, lo que significa que realizar la misma solicitud POST varias veces puede tener efectos diferentes cada vez. POST se utiliza principalmente para crear nuevos recursos en el servidor, enviar datos complejos o realizar acciones que cambian el estado del servidor.

7.4. **¿Cómo se envían datos en un verbo POST?**
   - Los datos en un verbo POST se envían en el cuerpo (body) de la solicitud HTTP. Este cuerpo puede contener diversos tipos de datos, como formularios codificados (`application/x-www-form-urlencoded`), datos JSON (`application/json`), XML u otros formatos según la necesidad y la implementación específica de la aplicación.
   - En una aplicación web estándar, los datos de un formulario HTML se envían usando el método `POST` en el atributo `method` del elemento `<form>`. Para aplicaciones más complejas o servicios API, los datos pueden ser enviados mediante solicitudes AJAX en JavaScript o utilizando librerías como `fetch` o Axios en el lado del cliente.

En resumen, POST es fundamental para enviar datos desde el cliente al servidor en HTTP, siendo útil para crear nuevos recursos, enviar formularios completos o realizar acciones que modifiquen el estado del servidor.




##8. En lo que respecta al verbo GET responde:
    - ¿Qué es un verbo GET y cuál es su propósito?
    - ¿Cuándo se utiliza un verbo GET?
    - ¿En qué se diferencia un verbo GET de los otros verbos HTTP como POST, PUT y DELETE?
Aquí tienes las respuestas detalladas sobre el verbo GET en HTTP:

8.1. **¿Qué es un verbo GET y cuál es su propósito?**
   - GET es un verbo HTTP utilizado para solicitar datos del servidor. Su propósito principal es recuperar recursos o información específica del servidor identificado por una URL. GET no debe tener ningún efecto secundario en el servidor; es decir, debería ser una operación segura e idempotente.

8.2. **¿Cuándo se utiliza un verbo GET?**
   - GET se utiliza cuando se quiere obtener datos del servidor sin realizar ningún cambio en el estado del servidor. Es adecuado para recuperar información como páginas HTML, imágenes, archivos, o datos específicos de una API sin modificar nada en el servidor. Por ejemplo, cuando un usuario accede a una página web, su navegador realiza una solicitud GET para obtener el contenido HTML y otros recursos asociados.

8.3. **¿En qué se diferencia un verbo GET de los otros verbos HTTP como POST, PUT y DELETE?**
   - **POST**: Se utiliza para enviar datos al servidor para crear nuevos recursos o realizar acciones que cambian el estado del servidor. No es idempotente.
   - **PUT**: Se utiliza para actualizar o crear un recurso específico en el servidor. Es idempotente, lo que significa que realizar la misma solicitud varias veces tendrá el mismo efecto.
   - **DELETE**: Se utiliza para eliminar un recurso específico en el servidor. Es idempotente.
   
   **Diferencias clave con GET**:
   - GET es idempotente en el sentido de que realizar la misma solicitud GET varias veces no debería cambiar el estado del servidor ni tener efectos secundarios.
   - GET utiliza los parámetros de la URL para enviar datos, mientras que POST, PUT y DELETE pueden enviar datos en el cuerpo de la solicitud HTTP.
   - GET es más adecuado para obtener datos y no debería utilizarse para enviar datos sensibles o grandes, ya que los parámetros se incluyen en la URL, que podría quedar expuesta y limitada por la longitud máxima de la URL.

En resumen, GET es utilizado principalmente para recuperar datos del servidor de manera segura y sin efectos secundarios, utilizando parámetros de consulta en la URL para especificar los datos requeridos. Es fundamental entender estas diferencias para diseñar y desarrollar aplicaciones web y APIs de manera efectiva.





##9. En lo que respecta al verbo PUT responde:
    - ¿Qué es un verbo PUT y cuál es su propósito?
    - ¿Cuándo se utiliza un verbo PUT?
    - ¿En qué se diferencia un verbo PUT de los otros verbos HTTP como POST, GET y DELETE?

Aquí tienes las respuestas relacionadas con el verbo PUT en HTTP:

9.1. **¿Qué es un verbo PUT y cuál es su propósito?**
   - PUT es un verbo HTTP que se utiliza para enviar datos al servidor para crear o actualizar un recurso específico en una ubicación predefinida. Su propósito principal es modificar o crear un recurso identificado por la URL en el servidor según los datos proporcionados en el cuerpo de la solicitud.

9.2. **¿Cuándo se utiliza un verbo PUT?**
   - PUT se utiliza cuando se desea actualizar completamente un recurso existente en el servidor con los datos proporcionados en la solicitud. También se puede utilizar para crear un nuevo recurso si la URL específica no existe previamente en el servidor. Es importante destacar que PUT es idempotente, lo que significa que realizar la misma solicitud PUT varias veces debería tener el mismo efecto que hacerlo una sola vez.

9.3. **¿En qué se diferencia un verbo PUT de los otros verbos HTTP como POST, GET y DELETE?**
   - **POST**: Se utiliza para enviar datos al servidor para que sean procesados, generalmente para crear nuevos recursos o realizar acciones que no son idempotentes. POST no garantiza la idempotencia.
   - **GET**: Se utiliza para recuperar datos del servidor y no debe tener ningún efecto secundario en el servidor. Es idempotente.
   - **DELETE**: Se utiliza para eliminar un recurso específico en el servidor. Es idempotente.
   
   **Diferencias clave con PUT**:
   - PUT se utiliza específicamente para actualizar o crear un recurso en una ubicación determinada por la URL.
   - PUT es idempotente, lo que significa que realizar la misma solicitud PUT varias veces no debería tener efectos secundarios adicionales después de la primera operación exitosa.
   - PUT generalmente se usa para operaciones de actualización completa de recursos, mientras que POST puede ser más versátil para enviar datos que pueden no estar directamente relacionados con la creación o actualización de recursos específicos.

En resumen, PUT es esencial en HTTP para actualizar o crear recursos de manera idempotente y específica, utilizando los datos proporcionados en el cuerpo de la solicitud para modificar el estado del servidor en la ubicación especificada por la URL.




##10. En lo que respecta al verbo DELETE responde:
    - ¿Qué es un verbo DELETE y cuál es su propósito?
    - ¿Cuándo se utiliza un verbo DELETE?
    - ¿En qué se diferencia un verbo DELETE de los otros verbos HTTP como POST, GET y PUT?

    Aquí tienes las respuestas relacionadas con el verbo DELETE en HTTP:

10.1. **¿Qué es un verbo DELETE y cuál es su propósito?**
   - DELETE es un verbo HTTP utilizado para solicitar al servidor que elimine un recurso específico identificado por la URL proporcionada. Su propósito principal es eliminar permanentemente el recurso en el servidor que coincide con la URL especificada en la solicitud.

10.2. **¿Cuándo se utiliza un verbo DELETE?**
   - DELETE se utiliza cuando se desea eliminar un recurso específico en el servidor. Por ejemplo, podría utilizarse para eliminar un artículo de una base de datos, un archivo almacenado en un servidor, o cualquier otro tipo de recurso que sea identificado de manera única por una URL.

10.3. **¿En qué se diferencia un verbo DELETE de los otros verbos HTTP como POST, GET y PUT?**
   - **POST**: Se utiliza para enviar datos al servidor para ser procesados, generalmente para crear nuevos recursos o realizar acciones que no son idempotentes. No es idempotente.
   - **GET**: Se utiliza para recuperar datos del servidor y no debe tener ningún efecto secundario en el servidor. Es idempotente.
   - **PUT**: Se utiliza para actualizar o crear un recurso específico en el servidor. Es idempotente.
   
   **Diferencias clave con DELETE**:
   - DELETE se utiliza exclusivamente para eliminar recursos en el servidor, mientras que POST, GET y PUT tienen propósitos más diversos como la creación, recuperación y actualización de recursos.
   - DELETE es idempotente, lo que significa que realizar la misma solicitud DELETE varias veces debería tener el mismo efecto que hacerlo una sola vez. Sin embargo, es importante tener en cuenta que la implementación de idempotencia puede variar dependiendo de cómo esté implementado el servidor.
   - DELETE elimina permanentemente el recurso en el servidor, lo cual es diferente de las operaciones de actualización (PUT) o creación (POST).

En resumen, DELETE es crucial en HTTP para eliminar recursos específicos en el servidor, garantizando que el recurso identificado por la URL sea eliminado de manera efectiva y permanente.



##11. ¿Qué es un status code y cuáles son los más comunes?
Un status code (código de estado) es un número de tres dígitos devuelto por el servidor HTTP en respuesta a una solicitud realizada por un cliente (como un navegador web o una aplicación). Este código de estado proporciona información sobre el estado de la solicitud realizada y si se completó correctamente o no. Los status codes se dividen en cinco clases principales:

11.1. **1xx - Respuestas informativas**: Indican que la solicitud ha sido recibida y el servidor está procesando la solicitud.
   - Ejemplo común: **100 Continue** (indica que el servidor ha recibido los encabezados de solicitud y el cliente debe proceder con la solicitud).

11.2. **2xx - Respuestas satisfactorias**: Indican que la solicitud fue recibida, comprendida y aceptada correctamente por el servidor.
   - Ejemplos comunes:
     - **200 OK** (indica que la solicitud ha tenido éxito).
     - **201 Created** (indica que la solicitud ha tenido éxito y se ha creado un nuevo recurso).

11.3. **3xx - Redirecciones**: Indican que se necesita tomar medidas adicionales para completar la solicitud.
   - Ejemplos comunes:
     - **301 Moved Permanently** (indica que la URL solicitada ha sido permanentemente movida a una nueva ubicación).
     - **302 Found** (indica que la solicitud debe ser redirigida temporalmente a otra URL).

11.4. **4xx - Errores del cliente**: Indican que hubo un error por parte del cliente al realizar la solicitud.
   - Ejemplos comunes:
     - **400 Bad Request** (indica que la solicitud del cliente no se pudo entender por parte del servidor).
     - **404 Not Found** (indica que el recurso solicitado no fue encontrado en el servidor).

11.5. **5xx - Errores del servidor**: Indican que hubo un error en el servidor al intentar procesar la solicitud del cliente.
   - Ejemplos comunes:
     - **500 Internal Server Error** (indica que ocurrió un error interno en el servidor y no pudo completar la solicitud).
     - **503 Service Unavailable** (indica que el servidor no está disponible temporalmente debido a sobrecarga o mantenimiento).

Estos son algunos de los status codes más comunes utilizados en HTTP para comunicar el resultado de las solicitudes entre clientes y servidores. Cada código de estado tiene un significado específico que ayuda a diagnosticar y solucionar problemas relacionados con las comunicaciones HTTP.


##12. ¿Cuales son los status code mas comunes para el verbo POST?
Para el verbo POST en HTTP, los status codes más comunes que pueden ser devueltos por el servidor incluyen aquellos que indican el resultado de la solicitud POST específicamente. Aquí algunos de los status codes más comunes para el verbo POST:

12.1. **200 OK**:
   - Indica que la solicitud POST fue exitosa. El servidor ha recibido, entendido y aceptado la solicitud.

12.2. **201 Created**:
   - Indica que la solicitud POST ha sido exitosa y que ha resultado en la creación de un nuevo recurso en el servidor.

12.3. **400 Bad Request**:
   - Indica que la solicitud POST no pudo ser entendida o procesada por el servidor debido a un error en el formato de la solicitud o datos inválidos enviados por el cliente.

12.4. **401 Unauthorized**:
   - Indica que la solicitud POST no fue aceptada porque el cliente no ha proporcionado las credenciales de autenticación válidas necesarias.

12.5. **403 Forbidden**:
   - Indica que el servidor entendió la solicitud POST, pero está rechazando procesarla debido a restricciones en el acceso o permisos del cliente.

12.6. **404 Not Found**:
   - Indica que el servidor no pudo encontrar el recurso solicitado por la URL especificada en la solicitud POST.

12.7. **409 Conflict**:
   - Indica que la solicitud POST no pudo ser completada debido a un conflicto con el estado actual del recurso en el servidor.

12.8. **500 Internal Server Error**:
   - Indica que ocurrió un error interno en el servidor mientras procesaba la solicitud POST, lo cual impidió que se completara correctamente.

Estos status codes son utilizados por los servidores HTTP para comunicar el resultado de una solicitud POST específica. La elección del código de estado dependerá de la situación específica que haya ocurrido durante el procesamiento de la solicitud por parte del servidor.



##13. ¿Cuales son los status code mas comunes para el verbo GET?
Para el verbo GET en HTTP, los status codes más comunes que pueden ser devueltos por el servidor incluyen aquellos que indican el resultado de la solicitud GET específicamente. Aquí algunos de los status codes más comunes para el verbo GET:

13.1. **200 OK**:
   - Indica que la solicitud GET fue exitosa. El servidor ha encontrado y devuelto el recurso solicitado.

13.2. **301 Moved Permanently**:
   - Indica que la URL solicitada ha sido permanentemente movida a una nueva ubicación. El cliente debería redirigir sus futuras solicitudes a la URL nueva.

13.3. **302 Found**:
   - Indica que la URL solicitada ha sido temporalmente movida a una nueva ubicación. El cliente debería redirigir sus futuras solicitudes a la URL temporalmente nueva.

13.4. **304 Not Modified**:
   - Indica que el recurso solicitado no ha sido modificado desde la última vez que fue solicitado. Esto se utiliza en respuestas condicionales.

13.5. **400 Bad Request**:
   - Indica que la solicitud GET no pudo ser entendida o procesada por el servidor debido a un error en el formato de la solicitud o datos inválidos enviados por el cliente.

13.6. **401 Unauthorized**:
   - Indica que la solicitud GET no fue aceptada porque el cliente no ha proporcionado las credenciales de autenticación válidas necesarias.

13.7. **403 Forbidden**:
   - Indica que el servidor entendió la solicitud GET, pero está rechazando procesarla debido a restricciones en el acceso o permisos del cliente.

13.8. **404 Not Found**:
   - Indica que el servidor no pudo encontrar el recurso solicitado por la URL especificada en la solicitud GET.

13.9. **500 Internal Server Error**:
   - Indica que ocurrió un error interno en el servidor mientras procesaba la solicitud GET, lo cual impidió que se completara correctamente.

Estos son algunos de los status codes más comunes que pueden ser devueltos en respuesta a una solicitud GET. La elección del código de estado dependerá de la situación específica que haya ocurrido durante el procesamiento de la solicitud por parte del servidor.




##14. ¿Cuales son los status code mas comunes para el verbo PUT?
Para el verbo PUT en HTTP, los status codes más comunes que pueden ser devueltos por el servidor incluyen aquellos que indican el resultado de la solicitud PUT específicamente. Aquí algunos de los status codes más comunes para el verbo PUT:

14.1. **200 OK**:
   - Indica que la solicitud PUT fue exitosa. El servidor ha actualizado el recurso especificado por la URL correctamente.

14.2. **201 Created**:
   - Indica que la solicitud PUT ha sido exitosa y que ha resultado en la creación de un nuevo recurso en el servidor en la URL especificada.

14.3. **400 Bad Request**:
   - Indica que la solicitud PUT no pudo ser entendida o procesada por el servidor debido a un error en el formato de la solicitud o datos inválidos enviados por el cliente.

14.4. **401 Unauthorized**:
   - Indica que la solicitud PUT no fue aceptada porque el cliente no ha proporcionado las credenciales de autenticación válidas necesarias.

14.5. **403 Forbidden**:
   - Indica que el servidor entendió la solicitud PUT, pero está rechazando procesarla debido a restricciones en el acceso o permisos del cliente.

14.6. **404 Not Found**:
   - Indica que el servidor no pudo encontrar el recurso especificado por la URL en la solicitud PUT.

14.7. **409 Conflict**:
   - Indica que la solicitud PUT no pudo ser completada debido a un conflicto con el estado actual del recurso en el servidor.

14.8. **500 Internal Server Error**:
   - Indica que ocurrió un error interno en el servidor mientras procesaba la solicitud PUT, lo cual impidió que se completara correctamente.

Estos son algunos de los status codes más comunes que pueden ser devueltos en respuesta a una solicitud PUT. La elección del código de estado dependerá de la situación específica que haya ocurrido durante el procesamiento de la solicitud por parte del servidor.



##15. ¿Cuales son los status code mas comunes para el verbo DELETE?
Para el verbo DELETE en HTTP, los status codes más comunes que pueden ser devueltos por el servidor incluyen aquellos que indican el resultado de la solicitud DELETE específicamente. Aquí algunos de los status codes más comunes para el verbo DELETE:

15.1. **200 OK**:
   - Indica que la solicitud DELETE fue exitosa. El servidor ha eliminado el recurso especificado por la URL correctamente.

15.2. **204 No Content**:
   - Indica que la solicitud DELETE fue exitosa y que no hay contenido para devolver en la respuesta.

15.3. **400 Bad Request**:
   - Indica que la solicitud DELETE no pudo ser entendida o procesada por el servidor debido a un error en el formato de la solicitud o datos inválidos enviados por el cliente.

15.4. **401 Unauthorized**:
   - Indica que la solicitud DELETE no fue aceptada porque el cliente no ha proporcionado las credenciales de autenticación válidas necesarias.

15.5. **403 Forbidden**:
   - Indica que el servidor entendió la solicitud DELETE, pero está rechazando procesarla debido a restricciones en el acceso o permisos del cliente.

15.6. **404 Not Found**:
   - Indica que el servidor no pudo encontrar el recurso especificado por la URL en la solicitud DELETE.

15.7. **409 Conflict**:
   - Indica que la solicitud DELETE no pudo ser completada debido a un conflicto con el estado actual del recurso en el servidor.

15.8. **500 Internal Server Error**:
   - Indica que ocurrió un error interno en el servidor mientras procesaba la solicitud DELETE, lo cual impidió que se completara correctamente.

Estos son algunos de los status codes más comunes que pueden ser devueltos en respuesta a una solicitud DELETE. La elección del código de estado dependerá de la situación específica que haya ocurrido durante el procesamiento de la solicitud por parte del servidor.